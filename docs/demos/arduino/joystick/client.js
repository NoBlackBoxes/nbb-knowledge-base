(() => {
  const input = document.getElementById("input-mode");
  const connect = document.getElementById("connect-joystick");
  const status = document.getElementById("input-status");
  const directions = {
    UP: [0, -1],
    DOWN: [0, 1],
    LEFT: [-1, 0],
    RIGHT: [1, 0],
  };
  let reader;
  const usingJoystick = () => input.value === "joystick";

  function updateInputMode() {
    connect.hidden = !usingJoystick();
    if (connect.hidden) {
      status.textContent = "";
      reader?.cancel().catch(error => console.error(error));
    }
  }
  input.addEventListener("change", updateInputMode);
  updateInputMode();

  connect.addEventListener("click", async () => {
    if (!navigator.serial) {
      status.textContent = "Joystick mode requires Web Serial. Try Chrome or Edge.";
      return;
    }

    connect.disabled = true;
    status.textContent = "Select the Arduino Nano's serial port.";
    let port;
    let opened = false;
    let message = "Joystick disconnected. Connect again.";
    try {
      port = await navigator.serial.requestPort();
      if (!usingJoystick()) return;
      await port.open({ baudRate: 9600 });
      opened = true;
      if (!usingJoystick()) return;

      reader = port.readable.getReader();
      status.textContent = "Joystick connected.";
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done || !usingJoystick()) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();

        for (const line of lines) {
          const direction = directions[line.trim().toUpperCase()];
          if (direction) steer(...direction);
        }
      }
    } catch (error) {
      if (!opened && error.name === "NotFoundError") {
        message = "No joystick selected.";
      } else {
        console.error(error);
        if (!opened) message = "Could not connect. Close the Serial Monitor and try again.";
      }
    } finally {
      reader?.releaseLock();
      reader = undefined;
      if (opened) await port.close().catch(error => console.error(error));
      connect.disabled = false;
      if (usingJoystick()) status.textContent = message;
    }
  });
})();
