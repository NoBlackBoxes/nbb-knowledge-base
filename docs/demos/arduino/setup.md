# Arduino Nano on Chromebook

**Hardware:** Arduino Nano (ATmega328P), USB data cable, Chromebook running Chrome.

1. Enable **Linux development environment** in Chromebook Settings and install the Arduino IDE in Linux.
2. Plug in the Nano. Under **Linux development environment → Manage USB devices**, share its USB serial device with Linux (often FT232R/CH340).
3. In Arduino IDE, select **Board: Arduino Nano**, **Processor: ATmega328P**, and the detected serial port. If upload fails on a clone, try **ATmega328P (Old Bootloader)**.
4. **Wire and upload:** Choose **one** guide: [Analog](sensors/analog/wiring.md), [Digital](sensors/digital/wiring.md), or [Joystick](joystick/wiring.md). Complete its wiring and sketch upload, then return here for **Test serial output**.
5. **Test serial output:** Check Serial Monitor at **9600 baud**: analog/digital print `JUMP`; joystick prints direction commands. Then **close the Serial Monitor and Arduino IDE**.
6. **Release USB to Chrome:** Turn **off Linux USB sharing** for the Nano (leave the USB cable connected). This releases the port for Chrome.
7. **Play:** Follow the game instructions for your hardware: [Analog → Flex Run](sensors/analog/wiring.md#play-flex-run), [Digital → Flex Run](sensors/digital/wiring.md#play-flex-run), or [Joystick → Snake](joystick/wiring.md#play-snake).

If Chrome cannot see the Nano, confirm nothing else owns its serial port and Linux sharing is off. Only one application can use the port at a time.
