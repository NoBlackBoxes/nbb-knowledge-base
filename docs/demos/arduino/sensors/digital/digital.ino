const int PIN = 2;
int previousState;

void setup() {
  Serial.begin(9600);
  pinMode(PIN, INPUT);
  previousState = digitalRead(PIN);
}

void loop() {
  int state = digitalRead(PIN);
  if (state == HIGH && previousState == LOW) {
    Serial.println("JUMP");
  }
  previousState = state;
  delay(20);
}
