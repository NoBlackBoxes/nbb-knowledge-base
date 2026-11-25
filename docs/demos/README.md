# NBB Demos

Interactive hardware demos: control **Flex Run** using Arduino sensors or electromyography (EMG), and play **Snake** using an Arduino joystick.

## Quick start

1. Clone or download `nbb-knowledge-base` and open its `demos/` directory. Keep the directory structure intact.
2. Choose a hardware configuration from the guides below and follow its setup instructions.
3. For analog/digital sensors or EMG, open [Flex Run](flex-run.html) locally in Google Chrome, select the corresponding input mode, and connect the device. For the joystick, open [Snake](https://playsnake.org/#google_vignette) in Chrome and follow the [joystick connection instructions](arduino/joystick/wiring.md).

To try Flex Run without hardware, select **Keyboard** and press Space to jump.

## Demo setups

| Platform | Input | Game | Setup guide |
| --- | --- | --- | --- |
| Arduino | Analog sensor (light sensor example) | [Flex Run](flex-run.html) | [Analog wiring and sketch](arduino/sensors/analog/wiring.md) |
| Arduino | Digital sensor (magnetic sensor) | [Flex Run](flex-run.html) | [Digital wiring and sketch](arduino/sensors/digital/wiring.md) |
| Arduino | Joystick | [Snake](https://playsnake.org/#google_vignette) | [Joystick wiring and sketch](arduino/joystick/wiring.md) |
| Digilent | EMG | [Flex Run](flex-run.html) | [EMG wiring and acquisition](digilent/emg/wiring.md) |

Arduino demos require an Arduino Nano, Arduino IDE and Chrome. For Chromebook-specific instructions, see [Arduino setup](arduino/setup.md). The EMG demo uses a Digilent Analog Discovery Studio, EMG Click, WaveForms SDK and Python on macOS; follow the safety and setup requirements in the EMG guide before connecting electrodes to a person.

## Directory structure

```text
demos/
    ├── README.md
    ├── flex-run.html
    ├── arduino/
    │   ├── setup.md
    │   ├── sensors/
    │   │   ├── client.js
    │   │   ├── analog/
    │   │   │   ├── analog.ino
    │   │   │   └── wiring.md
    │   │   └── digital/
    │   │       ├── digital.ino
    │   │       └── wiring.md
    │   └── joystick/
    │       ├── joystick.ino
    │       ├── wiring.md
    │       └── client.js
    └── digilent/
        └── emg/
            ├── acquisition.py
            ├── wiring.md
            └── client.js
```

Analog and digital sensors share a JavaScript client for Flex Run. EMG has its own Flex Run client. The joystick client sends arrow-key commands to Snake.

Each Arduino sketch is in its own matching sketch directory. Switching input modes in Flex Run reloads the page.
