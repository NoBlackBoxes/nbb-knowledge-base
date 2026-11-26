const int PIN = A0;
const int TRIGGER = 700; // Tune for the actual potentiometer
const int RESET = 600;   // Hysteresis: turn back to rearm
bool armed = true;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int value = analogRead(PIN);
  if (armed && value > TRIGGER) {
    Serial.println("JUMP");
    armed = false;
  } else if (!armed && value < RESET) {
    armed = true;
  }
  delay(20);
}
