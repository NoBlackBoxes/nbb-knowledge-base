const connectButton = document.createElement("button");
connectButton.textContent = "CONNECT SENSOR";

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