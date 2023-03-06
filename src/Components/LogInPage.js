import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form } from "react-bootstrap";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";

export default function LogInPage(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = (e) => {
    const auth = getAuth();
    // console.log(auth);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // console.log(user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        // ..
      });
  };

  const handleSignIn = (e) => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...

        props.logIn();
        let userName = user.email.split("@")[0];
        props.logCurrentUser(userName);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
      });
  };

  const disableInput = email.length < 0 && password.length < 0;
  const disableLogOut = !props.userLoggedIn;

  return (
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
      <Button disabled={disableInput} variant="success" onClick={handleSignIn}>
        Sign In
      </Button>
    </div>
  );
}
