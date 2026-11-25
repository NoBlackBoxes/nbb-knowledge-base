(() => {
  document.getElementById("nano-snake-connect")?.remove();

  const button = document.createElement("button");
  button.id = "nano-snake-connect";
  button.textContent = "CONNECT JOYSTICK";

  Object.assign(button.style, {
    position: "fixed",
    top: "15px",
    left: "15px",
    zIndex: "999999",
    padding: "12px 16px",
    background: "#267a45",
    color: "white",
    border: "0",
    borderRadius: "6px",
    cursor: "pointer"
  });

  document.body.appendChild(button);

  const keys = {
    UP:    { key: "ArrowUp",    code: "ArrowUp",    keyCode: 38 },
    DOWN:  { key: "ArrowDown",  code: "ArrowDown",  keyCode: 40 },
    LEFT:  { key: "ArrowLeft",  code: "ArrowLeft",  keyCode: 37 },
    RIGHT: { key: "ArrowRight", code: "ArrowRight", keyCode: 39 }
  };

  function pressArrow(direction) {
    const k = keys[direction];
    if (!k) return;

    const target =
      document.querySelector("canvas") ||
      (document.activeElement !== document.body
        ? document.activeElement
        : document);

    for (const type of ["keydown", "keyup"]) {
      const event = new KeyboardEvent(type, {
        key: k.key,
        code: k.code,
        bubbles: true,
        cancelable: true
      });

      Object.defineProperty(event, "keyCode", { value: k.keyCode });
      Object.defineProperty(event, "which", { value: k.keyCode });
      target.dispatchEvent(event);
    }

    console.log("Joystick:", direction);
  }

  button.onclick = async () => {
    try {
      if (!("serial" in navigator)) {
        throw new Error("Web Serial is unavailable. Use Chrome or Edge on the game page.");
      }

      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });

      button.textContent = "JOYSTICK CONNECTED";
      button.style.background = "#2563eb";

      const decoder = new TextDecoderStream();
      const readableClosed = port.readable.pipeTo(decoder.writable);
      const reader = decoder.readable.getReader();

      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += value;
        const lines = buffer.split(/\r?\n/);
        buffer = lines.pop();

        for (const line of lines) {
          pressArrow(line.trim().toUpperCase());
        }
      }

      await readableClosed;
    } catch (error) {
      console.error(error);
      button.textContent = "CONNECTION FAILED — CHECK CONSOLE";
      button.style.background = "#b42318";
    }
  };
})();