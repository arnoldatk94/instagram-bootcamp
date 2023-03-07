import React from "react";
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

class PostCreator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      input: "",
      timestamp: "",
      fileInputFile: null,
      fileInputValue: "",
      textInputValue: "",
    };
  }

  handleChange = (e) => {
    // To enable input to uptimestamp changes in real time
    let { name, value } = e.target;
    let currTimestamp = new Date().toString().split(" G")[0];
    currTimestamp = currTimestamp.slice(0, -3);
    this.setState({
      [name]: value,
      timestamp: currTimestamp,
    });
  };

  handleFileChange = (e) =>
    this.setState({
      fileInputFile: e.target.files[0],
      fileInputValue: e.target.value,
    });

  handleSubmit = (e) => {
    // Creates a reference to the bucket and save to storage
    const imageRef = storageRef(
      storage,
      `${this.props.STORAGE_FILE_KEY}/${this.state.fileInputFile.name}`
    );

    uploadBytes(imageRef, this.state.fileInputFile).then((snapshot) => {
      console.log(snapshot);
      console.log(this.state);
      getDownloadURL(imageRef, this.state.fileInputFile).then((url) => {
        console.log("URL", url);

        this.writeData(url);
      });
    });
  };

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  writeData = (url) => {
    const messageListRef = ref(database, this.props.DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, {
      message: this.state.input,
      timestamp: this.state.timestamp,
      user: this.props.currentUser,
      url: url,
    });
    this.setState({
      input: "",
      timestamp: "",
      fileInputFile: null,
      fileInputValue: "",
      textInputValue: "",
    });
  };

  render() {
    const disableInput =
      this.state.input.length <= 1 || this.state.fileInputFile == null;
    return (
      <div className="flex-container">
        <Form.Group>
          <Form.Control
            type="file"
            value={this.state.fileInputValue}
            onChange={this.handleFileChange}
          ></Form.Control>
          <Form.Control
            type="text"
            name="input"
            placeholder="Send Post"
            value={this.state.input}
            onChange={this.handleChange}
          />
        </Form.Group>
        <Button
          disabled={disableInput}
          variant="success"
          onClick={this.handleSubmit}
        >
          Send
        </Button>
        <Outlet />
      </div>
    );
  }
}

export default PostCreator;
