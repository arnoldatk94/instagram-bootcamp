import React from "react";

export default function Newsfeed(props) {
  let messageListItems = props.messages.map((message) => (
    <div className="container" key={message.key}>
      <div className="timestamp">
        From:{message.val.user} on {message.val.timestamp}
      </div>
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

  return <div>{messageListItems}</div>;
}
