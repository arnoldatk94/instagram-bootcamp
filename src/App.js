import React from "react";
import { getDatabase, onChildAdded, push, ref, set } from "firebase/database";
import { database, storage } from "./firebase";
import {
  getDownloadURL,
  getStorage,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import logo from "./logo.png";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ListGroup, Button, Form, Container, Row } from "react-bootstrap";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
// Saving firebase folder for image storage
const STORAGE_FILE_KEY = "images";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
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

  componentDidMount() {
    const messagesRef = ref(database, DB_MESSAGES_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messages: [...state.messages, { key: data.key, val: data.val() }],
      }));
    });
  }

  handleFileChange = (e) =>
    this.setState({
      fileInputFile: e.target.files[0],
      fileInputValue: e.target.value,
    });

  handleSubmit = (e) => {
    // Creates a reference to the bucket and save to storage
    const imageRef = storageRef(
      storage,
      `${STORAGE_FILE_KEY}/${this.state.fileInputFile.name}`
    );

    // This block is completely redundant for storage
    // const newImageRef = push(imageRef);
    // set(newImageRef, {
    //   file: this.state.fileInputFile,
    // });

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
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, {
      message: this.state.input,
      timestamp: this.state.timestamp,
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
    // Convert messages in state to message JSX elements to render
    console.log(this.state.fileInputFile);
    let messageListItems = this.state.messages.map((message) => (
      <div className="container" key={message.key}>
        <div className="timestamp">{message.val.timestamp}</div>
        <div className="message">{message.val.message}.</div>
        <div className="picture">
          {message.val.url ? (
            <img src={message.val.url} alt={message.val.url} width="50%" />
          ) : (
            "No image"
          )}
        </div>
      </div>
    ));

    const disableInput =
      this.state.input.length <= 1 || this.state.fileInputFile == null;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
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
          </div>
          <ol>{messageListItems}</ol>
        </header>
      </div>
    );
  }
}

export default App;
