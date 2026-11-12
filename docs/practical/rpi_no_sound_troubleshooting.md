---
title: Raspberry Pi MAX98357A I2S — No Sound
tags:
  - technical
  - raspberry-pi
  - audio
  - troubleshooting
author: viktor
---

# Raspberry Pi MAX98357A I²S — No Sound

## Problem

The MAX98357A I²S amplifier was detected by the Raspberry Pi and I²S activity was visible on an oscilloscope, but there was no sound.

The speaker and amplifier were tested on another robot and worked correctly.

## Diagnosis

Check the relevant I²S/audio configuration:

```bash
cat /boot/firmware/config.txt | grep -Ei 'i2s|audio|max98357|overlay'
```

This showed:

```text
dtparam=i2s=on
dtoverlay=max98357a,sdmode-pin=16dtparam=i2s=on
```

The problem is the second line:

```text
dtoverlay=max98357a,sdmode-pin=16dtparam=i2s=on
```

An extra `dtparam=i2s=on` had been accidentally concatenated onto the MAX98357A overlay configuration.

To see the exact line and surrounding configuration:

```bash
grep -n -B2 -A2 'max98357' /boot/firmware/config.txt
```

This showed:

```text
6-#dtparam=i2c_arm=on
7-dtparam=i2s=on
8:dtoverlay=max98357a,sdmode-pin=16dtparam=i2s=on
9-#dtparam=spi=on
10-
```

## Solution

Edit the configuration:

```bash
sudo nano /boot/firmware/config.txt
```

Change:

```text
dtparam=i2s=on
dtoverlay=max98357a,sdmode-pin=16dtparam=i2s=on
```

to:

```text
dtparam=i2s=on
dtoverlay=max98357a,sdmode-pin=16
```

Only **one** `dtparam=i2s=on` is required. The concatenated second copy should simply be deleted.

The relevant configuration should be:

```text
# Uncomment some or all of these to enable the optional hardware interfaces
#dtparam=i2c_arm=on
dtparam=i2s=on
dtoverlay=max98357a,sdmode-pin=16
#dtparam=spi=on

# Enable audio (loads snd_bcm2835)
dtparam=audio=on
```

Reboot:

```bash
sudo reboot
```

This restored the audio.

## Additional Diagnostics

These were useful while narrowing down the problem but were not required for the final fix.

### Check that the MAX98357A is detected

```bash
aplay -l
```

Expected to see something similar to:

```text
card 3: MAX98357A [MAX98357A], device 0: bcm2835-i2s-HiFi HiFi-0
```

Additional ALSA checks:

```bash
aplay -L
cat /proc/asound/cards
```

### Check kernel audio messages

```bash
dmesg | grep -Ei 'i2s|max98357|simple-card|snd'
```

### Test the MAX98357A directly

This bypasses PipeWire and sends a test tone directly through ALSA:

```bash
speaker-test -D hw:CARD=MAX98357A,DEV=0 -c 2 -r 48000 -F S16_LE -t sine -f 1000
```

### Check ALSA mixer controls

```bash
amixer -c 3
amixer -c 3 scontrols
```

The MAX98357A did not expose a normal ALSA hardware volume control.

### Check PipeWire

```bash
wpctl status
```

Identify the MAX98357A sink:

```bash
wpctl inspect <sink-id>
```

Check or change its software volume:

```bash
wpctl get-volume <sink-id>
wpctl set-volume <sink-id> 1.0
```

Changing the PipeWire volume did not solve this particular problem.
