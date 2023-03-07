import React, { useEffect, useState } from "react";
import { getDatabase, onChildAdded, push, ref, set } from "firebase/database";
import { database, storage } from "./firebase";
import logo from "./logo.png";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form } from "react-bootstrap";
import PostCreator from "./Components/PostCreator";
import Newsfeed from "./Components/NewsFeed";
import LogInPage from "./Components/LogInPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
// Saving firebase folder for image storage
const STORAGE_FILE_KEY = "images";

export default function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [messages, setMessages] = useState([]);

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

  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <img src={logo} className="App-logo" alt="logo" />
          <Routes>
            {userLoggedIn ? (
              <div>
                <Button variant="outline-danger" onClick={logOut}>
                  Log Out
                </Button>
                <Route
                  path="PostCreator"
                  element={
                    <PostCreator
                      DB_MESSAGES_KEY={DB_MESSAGES_KEY}
                      STORAGE_FILE_KEY={STORAGE_FILE_KEY}
                      currentUser={currentUser}
                    />
                  }
                />
              </div>
            ) : (
              <Route
                path="logIn"
                element={
                  <LogInPage logIn={logIn} logCurrentUser={logCurrentUser} />
                }
              />
            )}
            <Route path="Newsfeed" element={<Newsfeed messages={messages} />} />
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}
