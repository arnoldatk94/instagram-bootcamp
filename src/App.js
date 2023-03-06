import React, { useEffect, useState } from "react";
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

export default function App(props) {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [fileInputFile, setFileInputFile] = useState(null);
  const [fileInputValue, setfileInputValue] = useState("");
  const [textInputValue, setTextInputValue] = useState("");

  useEffect(() => {
    const messagesRef = ref(database, DB_MESSAGES_KEY);
    onChildAdded(messagesRef, (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { key: data.key, val: data.val() },
      ]);
    });
  }, []); // make sure this only runs once

  const logIn = (e) => {
    setUserLoggedIn(true);
  };

  const logOut = (e) => {
    setUserLoggedIn(false);
  };

  const logCurrentUser = (user) => {
    setCurrentUser(user);
  };

  console.log(messages);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {userLoggedIn ? (
          <div>
            <Button variant="outline-danger" onClick={logOut}>
              Log Out
            </Button>
            <PostCreator
              DB_MESSAGES_KEY={DB_MESSAGES_KEY}
              STORAGE_FILE_KEY={STORAGE_FILE_KEY}
              currentUser={currentUser}
            />
          </div>
        ) : (
          <LogInPage logIn={logIn} logCurrentUser={logCurrentUser} />
        )}

        <Newsfeed messages={messages} />
      </header>
    </div>
  );
}
