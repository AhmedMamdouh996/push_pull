import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Widget, addResponseMessage } from "react-chat-widget";

import "react-chat-widget/lib/styles.css";
import logo from "./logo.svg";

const socket = io("localhost:3000");
export default function Socket() {
  const [room, setRoom] = useState("");

  const handleNewUserMessage = (newMessage) => {
    console.log(`New message incoming! ${newMessage}`);
    // Now send the message through the backend API
    socket.emit("message", newMessage);
  };

  useEffect(() => {
    socket.on("replyMessage", (data) => {
      addResponseMessage(data);
    });
  }, []);

  const messageMyRoom = (newMessage) => {
    socket.emit("messageRoom", [newMessage, room]);
  };
  const joinRoom = (e) => {
    e.preventDefault();
    socket.emit("joinRoom", room);
  };

  return (
    <div>
      {/* Broadcast Messenger */}
      {/* <div className="App">
        <Widget
          handleNewUserMessage={handleNewUserMessage}
          profileAvatar={logo}
          title="My new Broadcast Messenger"
          subtitle="Broadcast Messenger"
        />
      </div> */}

      {/* Room Messenger */}
      <div className="App">
        <form onSubmit={joinRoom}>
          <div className="mb-3 mt-5">
            <label htmlFor="room" className="form-label">
              Room
            </label>
            <input
              type="text"
              placeholder="write the room name You want to join"
              name="room"
              required
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="form-control"
              id="room"
            ></input>
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
        <h2>Your room</h2>
        <h3> {room}</h3>
        <Widget
          profileAvatar={logo}
          title="My new Room Messenger"
          subtitle="Room Messenger"
          handleNewUserMessage={messageMyRoom}
        />
      </div>
    </div>
  );
}
