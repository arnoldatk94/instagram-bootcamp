import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form } from "react-bootstrap";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

class LogInPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userEmail: "",
      userPassword: "",
    };
  }

  handleChange = (e) => {
    // To enable input to uptimestamp changes in real time
    let { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleSignUp = (e) => {
    const auth = getAuth();
    // console.log(auth);
    createUserWithEmailAndPassword(
      auth,
      this.state.userEmail,
      this.state.userPassword
    )
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

  handleSignIn = (e) => {
    const auth = getAuth();
    signInWithEmailAndPassword(
      auth,
      this.state.userEmail,
      this.state.userPassword
    )
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...

        this.props.logIn();
        let userName = user.email.split("@")[0];
        this.props.logCurrentUser(userName);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
      });
  };

  render() {
    const disableInput =
      this.state.userEmail.length < 0 && this.state.userPassword.length < 0;
    const disableLogOut = !this.props.userLoggedIn;

    // console.log(this.state);
    if (this.state.userLoggedIn) console.log(this.state.userLoggedIn);
    return (
      <div>
        <Form.Group>
          <Form.Label>Sign in to post!</Form.Label>
          <Form.Control
            type="text"
            name="userEmail"
            placeholder="email"
            value={this.state.userEmail}
            onChange={this.handleChange}
          />
          <Form.Control
            type="text"
            name="userPassword"
            placeholder="password"
            value={this.state.userPassword}
            onChange={this.handleChange}
          />
        </Form.Group>
        <Button
          disabled={disableInput}
          variant="info"
          onClick={this.handleSignUp}
        >
          Sign up
        </Button>
        <Button
          disabled={disableInput}
          variant="success"
          onClick={this.handleSignIn}
        >
          Sign In
        </Button>
      </div>
    );
  }
}

export default LogInPage;
