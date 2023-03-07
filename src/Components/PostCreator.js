import React, { useState } from "react";
import { getDatabase, onChildAdded, push, ref, set } from "firebase/database";
import { database, storage } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form } from "react-bootstrap";
import { Outlet } from "react-router-dom";

export default function PostCreator(props) {
  const [input, setInput] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [fileInputFile, setFileInputFile] = useState(null);
  const [fileInputValue, setfileInputValue] = useState("");
  const [textInputValue, setTextInputValue] = useState("");

  const handleChange = (e) => {
    // To enable input to uptimestamp changes in real time
    let currTimestamp = new Date().toString().split(" G")[0];
    currTimestamp = currTimestamp.slice(0, -3);
    setInput(e.target.value);
    setTimestamp(currTimestamp);
  };

  const handleFileChange = (e) => {
    setFileInputFile(e.target.files[0]);
    setfileInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    // Creates a reference to the bucket and save to storage
    const imageRef = storageRef(
      storage,
      `${props.STORAGE_FILE_KEY}/${fileInputFile.name}`
    );

    uploadBytes(imageRef, fileInputFile).then((snapshot) => {
      console.log(snapshot);
      getDownloadURL(imageRef, fileInputFile).then((url) => {
        console.log("URL", url);

        writeData(url);
      });
    });
  };

  const writeData = (url) => {
    const messageListRef = ref(database, props.DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, {
      message: input,
      timestamp: timestamp,
      user: props.currentUser,
      url: url,
    });

    setInput("");
    setTimestamp("");
    setFileInputFile("");
    setfileInputValue("");
    setTextInputValue("");
  };

  const disableInput = input.length <= 1 || fileInputFile == null;

  return (
    // <div className="flex-container">
    <div>
      <Form.Group>
        <Form.Control
          type="file"
          value={fileInputValue}
          onChange={handleFileChange}
        ></Form.Control>
        <Form.Control
          type="text"
          name="input"
          placeholder="Send Post"
          value={input}
          onChange={handleChange}
        />
      </Form.Group>
      <Button disabled={disableInput} variant="success" onClick={handleSubmit}>
        Send
      </Button>
      <Outlet />
    </div>
  );
}
