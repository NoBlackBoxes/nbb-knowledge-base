"""EMG Click -> Digilent C1 -> three notch filters -> JUMP over WebSocket.

Original JUMP logic preserved: >1.4 V, rearm <1.3 V, 0.4 s cooldown.
Requires: python3 -m pip install numpy scipy websockets
Close WaveForms before running; it cannot share control of the Digilent.
"""
import time
from ctypes import *

import numpy as np
from scipy.signal import butter, sosfilt, sosfilt_zi
from websockets.sync.server import serve

THRESHOLD = 1.4
RESET_THRESHOLD = 1.3
COOLDOWN = 0.4
SAMPLE_RATE = 400

# Same M1 -> M2 -> M3 settings as WaveForms (applied inside Python).
NOTCHES = [(48, 52), (98, 102), (148, 152)]
FILTER_ORDER = 32

# Stable stateful filters: they continue across successive blocks of samples.
FILTERS = [
    butter(FILTER_ORDER, band, btype="bandstop", fs=SAMPLE_RATE, output="sos")
    for band in NOTCHES
]

dwf = cdll.LoadLibrary("/Library/Frameworks/dwf.framework/dwf")


def check(name, *args):
    if not getattr(dwf, name)(*args):
        error = create_string_buffer(512)
        dwf.FDwfGetLastErrorMsg(error)
        raise RuntimeError(f"{name}: {error.value.decode()}")


def handle_browser(ws):
    device = c_int()
    count = c_int()

    check("FDwfEnum", c_int(0), byref(count))
    print(f"Digilent devices detected: {count.value}", flush=True)
    if count.value == 0:
        raise RuntimeError("Digilent not detected by SDK")

    check("FDwfDeviceOpen", c_int(0), byref(device))
    print("Digilent connected!", flush=True)
    if device.value == 0:
        raise RuntimeError("No available Digilent device")

    try:
        check("FDwfAnalogInChannelEnableSet", device, c_int(0), c_int(1))
        check("FDwfAnalogInChannelRangeSet", device, c_int(0), c_double(5.0))
        check("FDwfAnalogInFrequencySet", device, c_double(SAMPLE_RATE))
        # Record mode is needed so notch filters receive *every* 400 Hz sample.
        check("FDwfAnalogInAcquisitionModeSet", device, c_int(3))
        check("FDwfAnalogInRecordLengthSet", device, c_double(-1.0))
        check("FDwfAnalogInTriggerSourceSet", device, c_int(0))
        check("FDwfAnalogInConfigure", device, c_int(1), c_int(1))

        status = c_byte()
        available = c_int()
        lost = c_int()
        corrupt = c_int()
        states = [None] * len(FILTERS)
        armed = True
        last_jump = -float("inf")
        last_print = time.monotonic()
        peak_filtered = -float("inf")
        trough_filtered = float("inf")

        print("Reading FILTERED EMG (M1 -> M2 -> M3); JUMP threshold = 1.4 V", flush=True)

        while True:
            check("FDwfAnalogInStatus", device, c_int(1), byref(status))
            check("FDwfAnalogInStatusRecord", device, byref(available),
                  byref(lost), byref(corrupt))

            if lost.value or corrupt.value:
                print(f"Warning: lost={lost.value}, corrupt={corrupt.value}", flush=True)
                states = [None] * len(FILTERS)

            if available.value <= 0:
                time.sleep(0.005)
                continue

            n = available.value
            buffer = (c_double * n)()
            check("FDwfAnalogInStatusData", device, c_int(0), buffer, c_int(n))
            raw = np.ctypeslib.as_array(buffer)

            # Filter C1 in sequence; 'filtered' is the software equivalent of M3.
            filtered = raw
            for i, sos in enumerate(FILTERS):
                if states[i] is None:
                    states[i] = sosfilt_zi(sos) * float(filtered[0])
                filtered, states[i] = sosfilt(sos, filtered, zi=states[i])

            peak_filtered = max(peak_filtered, float(np.max(filtered)))
            trough_filtered = min(trough_filtered, float(np.min(filtered)))
            now = time.monotonic()
            if now - last_print > 0.5:
                print(f"Raw: {raw[-1]:.3f} V | Filtered: {filtered[-1]:.3f} V | "
                      f"Filtered range: {trough_filtered:.3f} to {peak_filtered:.3f} V",
                      flush=True)
                last_print = now
                peak_filtered = -float("inf")
                trough_filtered = float("inf")

            # ORIGINAL logic, unchanged: no new debounce, warmup or averaging.
            for v in filtered:
                now = time.monotonic()
                if armed and v > THRESHOLD and now - last_jump > COOLDOWN:
                    ws.send("JUMP")
                    print(f"JUMP (filtered: {v:.3f} V)", flush=True)
                    armed = False
                    last_jump = now
                if v < RESET_THRESHOLD:
                    armed = True

    finally:
        dwf.FDwfDeviceClose(device)


with serve(handle_browser, "127.0.0.1", 8765) as server:
    print("EMG server listening on port 8765", flush=True)
    server.serve_forever()
