---
title: GIF London 2026 link collection
tags:
  - demo
  - arduino
  - sensor
  - dino
---

# GIF London 2026 link collection

## How to set up the dino game on Chromebooks

https://gist.github.com/QuentinPM/f71f1c0ef7c863588f0d7ef882e24ba4

### Arduino sketches


#### Install Arduino IDE on Chromebooks

```bash
# Detect architecture and download the appropriate Arduino IDE
ARCH=$(dpkg --print-architecture)

case "$ARCH" in
    amd64)  PLATFORM="linux64" ;;
    arm64)  PLATFORM="linuxaarch64" ;;
    armhf)  PLATFORM="linuxarm" ;;
    i386)   PLATFORM="linux32" ;;
    *) echo "Unsupported architecture: $ARCH"; exit 1 ;;
esac

# Download, extract and install Arduino IDE 1.8.19
wget "https://downloads.arduino.cc/arduino-1.8.19-${PLATFORM}.tar.xz" -O arduino-1.8.19.tar.xz &&
tar -xf arduino-1.8.19.tar.xz &&
cd arduino-1.8.19 &&
sudo ./install.sh
```



#### Analog sensor

```C
const int magneticSensor = 2;
int previousState = HIGH;

void setup() {
  pinMode(magneticSensor, INPUT);
  Serial.begin(9600);
}

void loop() {
  int sensorState = digitalRead(magneticSensor);

  Serial.println(sensorState);

  if (sensorState == HIGH && previousState == LOW) {
    Serial.println("JUMP");
  }

  previousState = sensorState;
  delay(100);
}
```

#### Digital sensor

```C
const int magneticSensor = 2;
int previousState = LOW;

void setup() {
  pinMode(magneticSensor, INPUT);
  Serial.begin(9600);
}

void loop() {
  int sensorState = digitalRead(magneticSensor);

  Serial.println(sensorState);

  if (sensorState == HIGH && previousState == LOW) {
    Serial.println("JUMP");
  }

  previousState = sensorState;
  delay(20);
}
```

### Java script for browser

```JavaScript
const connectButton = document.createElement("button");
connectButton.textContent = "CONNECT LIGHT SENSOR";

Object.assign(connectButton.style, {
  position: "fixed",
  top: "15px",
  left: "15px",
  zIndex: "99999",
  padding: "15px",
  background: "#267a45",
  color: "white",
  cursor: "pointer"
});

document.body.appendChild(connectButton);

function jump() {
  for (const type of ["keydown", "keyup"]) {
    const event = new KeyboardEvent(type, {
      key: " ",
      code: "Space",
      bubbles: true
    });

    Object.defineProperty(event, "keyCode", { value: 32 });
    Object.defineProperty(event, "which", { value: 32 });

    document.dispatchEvent(event);
  }
}

connectButton.onclick = async () => {
  try {
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });

    connectButton.textContent = "SENSOR CONNECTED";
    connectButton.style.background = "#2563eb";

    const reader = port.readable
      .pipeThrough(new TextDecoderStream())
      .getReader();

    let buffer = "";
    let lastJump = 0;

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += value;
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop();

      for (const line of lines) {
        if (
          line.trim() === "JUMP" &&
          Date.now() - lastJump > 600
        ) {
          jump();
          lastJump = Date.now();
        }
      }
    }
  } catch (error) {
    console.error(error);
    connectButton.textContent = "CONNECTION FAILED";
  }
};
```

## EMG setup guide

https://gist.github.com/QuentinPM/bdf9b2271bf1596035579ca0a4a1901d#3-python-controller