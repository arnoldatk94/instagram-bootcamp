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
import { Button, Form } from "react-bootstrap";
import PostCreator from "./Components/PostCreator";
import Newsfeed from "./Components/NewsFeed";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import LogInPage from "./Components/LogInPage";

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
      userLoggedIn: false,
      currentUser: "",
      messages: [],
      input: "",
      timestamp: "",
      fileInputFile: null,
      fileInputValue: "",
      textInputValue: "",
    };
  }

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

  logIn = (e) => {
    this.setState({ userLoggedIn: true });
  };

  logOut = (e) => {
    this.setState({ userLoggedIn: false });
  };

  logCurrentUser = (user) => {
    this.setState({
      currentUser: user,
    });
  };

  render() {
    console.log("Current User: " + this.state.currentUser);
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {this.state.userLoggedIn ? (
            <div>
              <Button variant="outline-danger" onClick={this.logOut}>
                Log Out
              </Button>
              <PostCreator
                DB_MESSAGES_KEY={DB_MESSAGES_KEY}
                STORAGE_FILE_KEY={STORAGE_FILE_KEY}
                currentUser={this.state.currentUser}
              />
            </div>
          ) : (
            <LogInPage
              handleSignIn={this.handleSignIn}
              handleSignUp={this.handleSignUp}
              logIn={this.logIn}
              logCurrentUser={this.logCurrentUser}
            />
          )}

          {/* <div>{messageListItems}</div> */}
          <Newsfeed messages={this.state.messages} />
        </header>
      </div>
    );
  }
}

export default App;
