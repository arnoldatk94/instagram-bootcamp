import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form } from "react-bootstrap";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import PostCreator from "./PostCreator";
import { auth } from "../firebase";

export default function LogInPage(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserLoggedIn(true);
        console.log("Logged in User");
        console.log(user);
        navigate("/newsfeed");
      } else {
        console.log("user not logged in");
      }
    });
  }, [auth]);

  const handleSignUp = (e) => {
    const auth = getAuth();
    // console.log(auth);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        alert("Congrats! Now please sign in!");
        // console.log(user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        if (errorCode === "auth/email-already-in-use")
          alert("You have already signed up before! Please sign in!");

        // ..
      });
  };

  const handleSignIn = (e) => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("Sign In function running");
        setUserLoggedIn(true);
        logIn();
        let userName = user.email.split("@")[0];
        props.logCurrentUser(userName);
        navigate("/newsfeed");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        if (errorCode === "auth/invalid-email")
          alert("Please sign up to use RocketChat!");
      });
  };

  const logIn = () => {
    signInWithEmailAndPassword(auth, email, password).then((user) => {
      console.log(user);
    });
  };

  const logOut = () => {
    signOut(auth).then(() => {
      setUserLoggedIn(false);
      setEmail("");
      navigate("/");
    });
  };

  const disableInput = email.length < 0 && password.length < 0;

  return (
    <div>
      {userLoggedIn ? (
        <div>
          <Button variant="outline-danger" onClick={logOut}>
            Log Out
          </Button>
          <PostCreator />
        </div>
      ) : (
        <div>
          <Form.Group>
            <Form.Label>Sign in to post!</Form.Label>
            <Form.Control
              type="text"
              name="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Form.Control
              type="text"
              name="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button disabled={disableInput} variant="info" onClick={handleSignUp}>
            Sign up
          </Button>
          <Button
            disabled={disableInput}
            variant="success"
            onClick={handleSignIn}
          >
            Sign In
          </Button>
        </div>
      )}
      <Outlet />
    </div>
  );
}
