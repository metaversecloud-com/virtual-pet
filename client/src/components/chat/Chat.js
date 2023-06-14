import React, { useState } from "react";
import {
  InputGroup,
  InputGroupText,
  Input,
  ListGroup,
  ListGroupItem,
  Button,
} from "reactstrap";
import "./Chat.scss";

import axios from "axios";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const sendMessage = async (event) => {
    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    setMessages([...messages, { sender: "user", text: message }]);

    try {
      const response = await axios.post("backend/pet/chat", {
        text: message,
      });

      const dragonResponse = response.data.msg.content; // Corrigido aqui

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "dragon", text: dragonResponse },
      ]);
    } catch (error) {
      console.error("Error sending message to backend:", error);
    }

    setMessage("");
  };

  return (
    <div className="chat">
      <ListGroup className="message-list">
        {messages?.map((message, index) => (
          <ListGroupItem
            key={index}
            className={
              message.sender === "dragon" ? "dragon-message" : "user-message"
            }
          >
            {message.text}
          </ListGroupItem>
        ))}
      </ListGroup>
      <form onSubmit={sendMessage}>
        <InputGroup>
          <Input
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <Button color="primary" onClick={sendMessage}>
            Send
          </Button>
        </InputGroup>
      </form>
    </div>
  );
};

export default Chat;
