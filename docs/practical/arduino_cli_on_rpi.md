---
title: Arduino CLI on Raspberry Pi
tags:
  - technical
  - arduino
  - raspberry-pi
  - hardware
  - embedded
author: viktor
---

# Arduino (Nano) from Raspberry Pi terminal — cheat sheet

## 1) Install + configure (with checks)

### Install `arduino-cli`

```bash
curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | sh
sudo mv bin/arduino-cli /usr/local/bin/
arduino-cli version
```

### Initialize + update index

```bash
arduino-cli config init
arduino-cli core update-index
```

### Install the AVR core (for Uno/Nano/328P boards)

```bash
arduino-cli core install arduino:avr
arduino-cli core list
```

### Find the USB port + (sometimes) the board

```bash
arduino-cli board list
```

Typical port names:

- `/dev/ttyUSB0` (common for CH340/CP2102 USB-serial)
- `/dev/ttyACM0` (common for native USB CDC devices)

If Board shows `Unknown`, that’s fine — you can still compile/upload by specifying the FQBN manually.

## 2) Organize sketches + compile + upload

### Suggested folder layout

In your home directory:

```bash
mkdir -p ~/arduino_code
cd ~/arduino_code
```

Each sketch goes in its own folder with a matching `.ino`:

```text
~/arduino_code/
  blink/
    blink.ino
  light_sensor/
    light_sensor.ino
```

Create a new sketch folder:

```bash
arduino-cli sketch new blink
cd blink
```

Edit the sketch:

```bash
nano blink.ino
```

### Nano (ATmega328P, *new bootloader*) — your working FQBN

Use this FQBN for both compile and upload:

```text
arduino:avr:nano:cpu=atmega328
```

### Compile (build the `.hex` for the board)

Run this inside the sketch folder:

```bash
arduino-cli compile --fqbn arduino:avr:nano:cpu=atmega328
```

### Upload (flash to the board)

```bash
arduino-cli upload -p /dev/ttyUSB0 --fqbn arduino:avr:nano:cpu=atmega328
```

### One-liner: compile + upload

```bash
arduino-cli compile --fqbn arduino:avr:nano:cpu=atmega328 && arduino-cli upload  -p /dev/ttyUSB0 --fqbn arduino:avr:nano:cpu=atmega328
```

### Tips / common gotchas

#### Port changes

- If you unplug/replug, port might change (`/dev/ttyUSB0` → `/dev/ttyUSB1`).
- Re-check quickly:

```bash
arduino-cli board list
```

#### Permissions

If you get `permission denied` on `/dev/ttyUSB0`:

```bash
sudo usermod -aG dialout $USER
logout
```

Log back in.

#### Old vs new Nano bootloader

- If you ever see `avrdude: stk500_getsync() ... not in sync`, try the other Nano variant:

```bash
# old bootloader
arduino-cli upload -p /dev/ttyUSB0 --fqbn arduino:avr:nano:cpu=atmega328old
```

#### Serial monitor from terminal

If your sketch prints with `Serial.println(...)` at 9600 baud:

```bash
screen /dev/ttyUSB0 9600
```

Exit screen: `Ctrl+A` then `K`

#### Multiple `.ino` files

- Arduino builds can merge multiple `.ino` files in the same folder, but easiest is:
  - keep *one* main `sketchname.ino`
  - put reusable code into `.h/.cpp` files in the same folder.

## 3) Custom commands for convenience

### Insert in `~/.bashrc`

```bash
##############################################
# Arduino (Nano) — terminal workflow helpers
##############################################
#
# Purpose:
#   - Compile and upload Arduino sketches from terminal only
#   - Target: Arduino Nano (ATmega328P, new bootloader)
#   - Works even if USB device name changes (ttyUSB0 ↔ ttyUSB1 ↔ ttyACM0)
#
# Usage (from inside a sketch folder):
#   arduino_compile
#   arduino_upload
#   arduino_build
#

# Detect the first connected Arduino serial port
# Matches common USB serial device names
arduino_port () {
  arduino-cli board list \
    | awk '/ttyUSB|ttyACM/ {print $1; exit}'
}

# Compile the sketch in the current directory for Arduino Nano
# Produces a .hex file but does NOT touch the board
arduino_compile () {
  arduino-cli compile \
    --fqbn arduino:avr:nano:cpu=atmega328 \
    "$@"
}

# Upload the compiled sketch to the detected Arduino port
arduino_upload () {
  local port
  port="$(arduino_port)"

  if [ -z "$port" ]; then
    echo "❌ No Arduino serial port found"
    return 1
  fi

  arduino-cli upload \
    -p "$port" \
    --fqbn arduino:avr:nano:cpu=atmega328 \
    "$@"
}

# Convenience helper: compile first, then upload
arduino_build () {
  arduino_compile "$@" && arduino_upload "$@"
}
```
