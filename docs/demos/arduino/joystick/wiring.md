---
title: Arduino joystick input
tags:
  - arduino
  - demo
author: quentin
---

# Arduino joystick input

**Game:** [Snake](https://playsnake.org/#google_vignette). The joystick sends arrow-key commands to steer the snake.

Chromebook users: start with [Arduino setup](../setup.md). At **Wire and upload**, follow the wiring and upload instructions below, then return to the checklist for **Test serial output**.

**Hardware:** Arduino Nano, two-axis analog joystick, jumpers.

![Wiring diagram](wiring.png)

| Joystick pin | Arduino Nano |
| --- | --- |
| `VRx` | `A0` |
| `VRy` | `A1` |
| `VCC` | `5V` (if supported) |
| `GND` | `GND` |
| `SW` | Not connected |

Power off before wiring. Keep joystick centred when the Nano powers up or reconnects.

Upload [`joystick.ino`](joystick.ino).

**Test:** Push in each direction to see `UP`, `DOWN`, `LEFT`, and `RIGHT`. Return to centre before another command. The JavaScript controller maps these commands to the corresponding arrow keys in Snake.

## Play Snake

Close the Serial Monitor. On Chromebook, turn off Linux USB sharing before connecting.

1. Open [Snake](https://playsnake.org/#google_vignette) in Chrome.
2. Copy the complete contents of [`client.js`](client.js). In the **Snake tab**, open Chrome's Developer Tools → **Console**, paste the code and run it. This adds a **CONNECT JOYSTICK** button to the Snake page.
3. Click **CONNECT JOYSTICK** and select the Nano's serial port.
4. Choose a game level and play. Move the joystick to steer; return it to centre between turns.
