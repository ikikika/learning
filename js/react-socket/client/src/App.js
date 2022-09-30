import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

const App = () => {
  const [inputData, setInputData] = useState("");
  const [messageReceived, setMssageReceived] = useState("");
  const [room, setRoom] = useState("");

  const onInputChangeHandler = (e) => {
    setInputData(e.target.value);
  };

  const onClickHandler = () => {
    socket.emit("event_name", { message: inputData, room });
  };

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };


  useEffect(() => {
    socket.on("broadcast_event_name", (data) => {
      setMssageReceived(data.message);
    });
  }, [socket]);

  return (
    <div className="App">
      <input
        placeholder="Room Number..."
        onChange={(event) => {
          setRoom(event.target.value);
        }}
      />
      <button onClick={joinRoom}> Join Room</button>
      <input
        placeholder="message"
        value={inputData}
        onChange={onInputChangeHandler}
      />
      <button onClick={onClickHandler}>Send message</button>
      <h1>{messageReceived}</h1>
    </div>
  );
};

export default App;
