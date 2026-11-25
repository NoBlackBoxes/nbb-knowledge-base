# Demos

Demo notes provide instructions and supporting material for demonstrations used in the No Black Boxes course.

Interactive hardware demos: control **Flex Run** using Arduino sensors or electromyography (EMG), and play **Snake** using an Arduino joystick.

## Quick start

To try the game without hardware, open [Flex Run](flex-run.html) in Google Chrome, select **Keyboard**, and press Space to jump.

To play with hardware, choose an input from the table below and follow its setup guide.

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
docs/demos/
    ├── index.md
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

## Browse by topic

Select a topic below, or use search to find a specific demo.

<!-- material/tags { scope: true } -->
