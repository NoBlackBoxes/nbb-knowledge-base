---
title: Arduino Programming
tags:
  - technical
  - arduino
  - programming
  - hardware
author: viktor
---

# Arduino Programming Cheat Sheet

## 1. What Arduino Is

**Arduino = [microcontroller](../concepts/ai_processing_units.md#mcu-microcontroller-unit) + simple programming environment**

- Runs small programs called **sketches**
- Written in **C/C++-like syntax**
- Designed for **hardware interaction**

Examples of what Arduino controls:

- LEDs
- motors
- sensors
- speakers
- displays

!!! note
    Unlike a normal computer program, an Arduino sketch runs in a **continuous loop on hardware**, not in an operating system.

## 2. Structure of an Arduino Program

Every Arduino sketch has two required functions:

```cpp
void setup() {
}

void loop() {
}
```

### setup()

Runs **once** when the board powers on.

Used for:

- configuring pins
- starting serial communication
- initializing sensors

Example:

```cpp
void setup() {
  pinMode(13, OUTPUT);
}
```

### loop()

Runs **repeatedly forever**.

Example:

```cpp
void loop() {
  digitalWrite(13, HIGH);
  delay(1000);
  digitalWrite(13, LOW);
  delay(1000);
}
```

The Arduino doesn’t “exit” programs — it keeps executing `loop()` continuously.

## 3. Pin Control

### pinMode()

Sets how a pin behaves.

```cpp
pinMode(pinNumber, INPUT);
pinMode(pinNumber, OUTPUT);
```

### digitalWrite()

Turns a pin ON or OFF.

```cpp
digitalWrite(13, HIGH);
digitalWrite(13, LOW);
```

### digitalRead()

Reads a button or digital sensor.

```cpp
int value = digitalRead(2);
```

## 4. Timing

### delay()

Pauses execution.

```cpp
delay(1000); // milliseconds
```

!!! note
    `delay()` blocks the program. Nothing else runs during this time.

## 5. Variables

Example:

```cpp
int ledPin = 13;
int buttonState = 0;
```

Common types:

- `int`
- `float`
- `bool`
- `char`

Variables let you avoid repeating numbers and make code easier to change.

## 6. Conditionals

```cpp
if (buttonState == HIGH) {
  digitalWrite(13, HIGH);
}
```

## 7. Loops

```cpp
for (int i = 0; i < 10; i++) {
  digitalWrite(13, HIGH);
  delay(200);
  digitalWrite(13, LOW);
  delay(200);
}
```

Used for:

- blinking patterns
- stepping motors
- repeated measurements

## 8. Analog Signals

### analogRead()

```cpp
int sensorValue = analogRead(A0);
```

On classic AVR boards such as the Uno and Nano, the default [10-bit ADC result](../concepts/digital_signal_processing.md#what-does-the-adc-actually-do) range is:[^arduino-analog-api]

```text
0–1023
```

### analogWrite() (PWM)

```cpp
analogWrite(9, 128);
```

On classic AVR boards, the default 8-bit PWM range is:[^arduino-analog-api]

```text
0–255
```

!!! note
    This is not true analog voltage — it’s **[PWM (pulse-width modulation)](../concepts/pwm.md)**.

## 9. Serial Communication

Used for debugging.

```cpp
Serial.begin(9600);
Serial.println(sensorValue);
```

!!! tip
    Serial Monitor lets you see values while the program runs.

## 10. Typical Arduino Workflow

1. Write sketch
2. Verify (compile)
3. Upload to board
4. Test hardware
5. Debug with Serial Monitor

For a terminal-based compile and upload workflow, see [Arduino CLI on Raspberry Pi](arduino_cli_on_rpi.md#2-organize-sketches-compile-upload).

!!! tip "Mental model"

    Arduino programming is mostly:

    ```text
    READ → DECIDE → ACT
    ```

    Example:

    ```text
    read sensor
    if condition true
    turn on motor
    ```

## Minimal Example Program

```cpp
int led = 13;

void setup() {
  pinMode(led, OUTPUT);
}

void loop() {
  digitalWrite(led, HIGH);
  delay(500);
  digitalWrite(led, LOW);
  delay(500);
}
```

[^arduino-analog-api]: [Arduino, *Arduino API: Analog I/O*](https://docs.arduino.cc/learn/programming/reference?queryID=430fb9c2a1d6bab554865451ec62ca1a).
