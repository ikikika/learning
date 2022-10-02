import React, { useState, useEffect } from "react";
import io from "socket.io-client";

import "./App.css";

const styles = {
  box: {
    display: "flex",
    alignSelf: "center",
    width: 500,
    height: 500,
    border: "1px solid #000",
    position: "relative",
  },
  controls: {
    display: "flex",
    alignSelf: "center",
    position: "relative",
    width: 200,
    height: 150,
  },
  up: {
    position: "absolute",
    left: 0,
    right: 0,
    margin: "auto",
    height: 50,
  },
  left: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    margin: "auto",
    height: 50,
  },
  right: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    margin: "auto",
    height: 50,
  },
  down: {
    position: "absolute",
    left: 0,
    right: 0,
    margin: "auto",
    bottom: 0,
    height: 50,
  },
  item: {
    width: 50,
    height: 50,
    position: "absolute",
  },
};

const movementStep = 50;

const socket = io.connect(process.env.REACT_APP_WS_URL);

const App = () => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [players, setPlayers] = useState({});
  const [socketId, setSocketId] = useState();

  useEffect(() => {
    socket.emit("event_new_player");
  }, []);

  useEffect(() => {
    socket.emit("event_offset", offset);
  }, [offset]);

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
    });

    socket.on("broadcast_players", (players) => {
      // console.log(players);
      setPlayers(Object.entries(players));
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const moveDown = () => {
    let newY = offset.y + movementStep;
    if (newY > 450) {
      newY = 450;
    }
    setOffset({ ...offset, y: newY });
  };
  const moveRight = () => {
    let newX = offset.x + movementStep;
    if (newX > 450) {
      newX = 450;
    }
    setOffset({ ...offset, x: newX });
  };
  const moveLeft = () => {
    let newX = offset.x - movementStep;
    if (newX < 0) {
      newX = 0;
    }
    setOffset({ ...offset, x: newX });
  };
  const moveUp = () => {
    let newY = offset.y - movementStep;
    if (newY < 0) {
      newY = 0;
    }
    setOffset({ ...offset, y: newY });
  };

  return (
    <div className="App">
      {socketId}
      <div style={styles.box}>
        {players.length > 0 &&
          players.map((player) => (
            <div
              key={player[0]}
              id={player[0]}
              className={player[0] === socketId ? "thisPlayer" : "otherPlayer"}
              style={{
                ...styles.item,
                ...{ left: player[1].x, top: player[1].y },
              }}
            />
          ))}
      </div>
      <div style={styles.controls}>
        <button style={styles.up} onClick={moveUp}>
          Up
        </button>
        <button style={styles.left} onClick={moveLeft}>
          Left
        </button>
        <button style={styles.right} onClick={moveRight}>
          Right
        </button>
        <button style={styles.down} onClick={moveDown}>
          Down
        </button>
      </div>
    </div>
  );
};

export default App;
