import React, { useEffect, useState } from "react";
import { getDatabase, onChildAdded, push, ref, set } from "firebase/database";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { database, storage, auth } from "./firebase";
import logo from "./logo.png";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Newsfeed from "./Components/NewsFeed";
import LogInPage from "./Components/LogInPage";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import ErrorPage from "./Components/ErrorPage";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
// Saving firebase folder for image storage
const STORAGE_FILE_KEY = "images";

export default function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    console.log("User Signed in? " + userLoggedIn);
    const messagesRef = ref(database, DB_MESSAGES_KEY);
    onChildAdded(messagesRef, (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { key: data.key, val: data.val() },
      ]);
    });
  }, []); // make sure this only runs once

  const logCurrentUser = (user) => {
    setCurrentUser(user);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={<LogInPage logCurrentUser={logCurrentUser} />}
            >
              <Route
                path="newsfeed"
                element={<Newsfeed messages={messages} />}
              />
            </Route>

            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </BrowserRouter>

        {/* {userLoggedIn ? (
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
        <Newsfeed messages={messages} /> */}
      </header>
    </div>
  );
}
