const int JOY_X = A0;
const int JOY_Y = A1;

const int MOVE_THRESHOLD = 180;  // How far to push before it registers
const int CENTRE_THRESHOLD = 90; // How close to centre before another move

int centreX = 512;
int centreY = 512;
bool readyForMove = true;

void setup() {
  Serial.begin(9600);

  // Calibrate the joystick's resting position.
  long totalX = 0;
  long totalY = 0;

  for (int i = 0; i < 40; i++) {
    totalX += analogRead(JOY_X);
    totalY += analogRead(JOY_Y);
    delay(5);
  }

  centreX = totalX / 40;
  centreY = totalY / 40;
}

void loop() {
  int x = analogRead(JOY_X);
  int y = analogRead(JOY_Y);

  int dx = x - centreX;
  int dy = y - centreY;

  // Require the joystick to return to centre before another turn.
  if (!readyForMove) {
    if (abs(dx) < CENTRE_THRESHOLD && abs(dy) < CENTRE_THRESHOLD) {
      readyForMove = true;
    }
    delay(15);
    return;
  }

  // Send one direction for a deliberate joystick push.
  if (max(abs(dx), abs(dy)) > MOVE_THRESHOLD) {
    if (abs(dx) > abs(dy)) {
      Serial.println(dx > 0 ? "RIGHT" : "LEFT");
    } else {
      // If up and down are reversed on your joystick, swap these two labels.
      Serial.println(dy < 0 ? "DOWN" : "UP");
    }

    readyForMove = false;
  }

  delay(15);
}
