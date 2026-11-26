function jump() {
  for (const type of ["keydown", "keyup"]) {
    const event = new KeyboardEvent(type, {
      key: " ",
      code: "Space",
      bubbles: true,
      cancelable: true
    });

    window.dispatchEvent(event);
  }
}

const socket = new WebSocket("ws://127.0.0.1:8765");

socket.onopen = () => console.log("EMG CONNECTED");

socket.onmessage = (event) => {
  if (event.data === "JUMP") {
    console.log("MUSCLE CONTRACTION → JUMP");
    jump();
  }
};

socket.onerror = (error) => console.error("EMG WebSocket error", error);
socket.onclose = () => console.log("EMG DISCONNECTED");
