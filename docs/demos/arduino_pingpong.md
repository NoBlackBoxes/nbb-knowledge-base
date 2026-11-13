---
title: Arduino Ping-Pong
tags:
  - arduino
  - demo
author: viktor
---

# Arduino Ping-Pong

!!! note
    This is a baseline setup based on Digital Art and Technology's original two-player Arduino Pong guide.[^original-guide] Course-specific modifications can be added later.

The Arduino acts as a controller: two potentiometers control the paddles, while the game runs on a computer in Processing.

## What you need

- Arduino and USB cable
- breadboard
- two dial potentiometers
- jumper wires
- [Arduino IDE](https://www.arduino.cc/en/software)
- [Processing](https://processing.org/download)
- Minim audio library for Processing

Download `TennisGame.zip` from the original guide before starting.[^original-guide]

## 1. Connect power to the breadboard

Connect the Arduino pins to the breadboard power rails:

- `5V` to the positive rail
- `GND` to the ground rail

## 2. Wire the potentiometers

For each potentiometer:

1. Connect one outer pin to the positive rail.
2. Connect the other outer pin to the ground rail.
3. Connect the middle pin to an Arduino analogue input:
    - first potentiometer: `A1`
    - second potentiometer: `A0`

## 3. Upload the controller sketch

Create a new sketch in the Arduino IDE and paste in the controller code:

```cpp
void setup()
{
  pinMode(0,INPUT);
  pinMode(1,INPUT);
  Serial.begin(9600);
}

void loop()
{
  int left = analogRead(0);
  int right = analogRead(1);
  Serial.print(left);
  Serial.print(" ");
  Serial.print(right);
  Serial.print("\n");
  delay(25);
}
```

This is the `TennisController.ino` sketch supplied with the original guide.[^original-guide]

1. Select the correct board and serial port.
2. Upload the sketch to the Arduino.
3. Make a note of the selected serial port; the Processing game needs the same value.

See [Arduino Programming](../practical/arduino_programming.md) if you need a refresher on sketches and analogue input.

## 4. Test the controls

Open the Arduino IDE's Serial Monitor. It should display a stream of number pairs. Turn each potentiometer and confirm that the corresponding values change.

Close the Serial Monitor before continuing so that Processing can use the serial port.

## 5. Configure and run the game

The game uses the Minim audio library. If it is not already installed:

1. In Processing, select **Sketch → Import Library → Manage Libraries**. In some versions, the final menu item is called **Add Library**.[^processing-libraries]
2. Search for `Minim`.
3. Select Minim and click **Install**.

Without this library, Processing reports an error for the following import:

```java
import ddf.minim.*;
```

Once Minim is installed:

1. Extract `TennisGame.zip`.
2. Open the Tennis project in Processing.
3. Find the line beginning with `String arduino =`.
4. Replace its value with the Arduino's serial port, for example:

    ```java
    String arduino = "/dev/ttyUSB0";
    ```

    On Windows, the value will normally look like `COM1` instead.

5. Run the Processing sketch.
6. Turn the two potentiometers and confirm that they control the two paddles.

## Troubleshooting

- **No changing values in Serial Monitor:** check the potentiometer power connections and confirm that their middle pins connect to `A0` and `A1`.
- **Processing cannot open the serial port:** close the Arduino Serial Monitor and check that the port in `String arduino` exactly matches the port selected in the Arduino IDE.
- **A paddle moves in the opposite direction:** swap that potentiometer's two outer connections.

[^original-guide]: Digital Art and Technology, [*Getting Started With Arduino—Two Player Arduino Pong*](https://www.instructables.com/Getting-Started-With-Arduino-Two-Player-Arduino-Po/), Instructables, 2016.
[^processing-libraries]: Processing Foundation, [*Environment: Adding Libraries, Tools, and Modes*](https://processing.org/environment/#adding-libraries-tools-and-modes).
