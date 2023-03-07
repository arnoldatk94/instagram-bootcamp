// Extracted from App.js and placed into PostCreator.js

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

// NewsFeed stuff:

// Convert messages in state to message JSX elements to render
// console.log(this.state.fileInputFile);
// let messageListItems = this.state.messages.map((message) => (
//   <div className="container" key={message.key}>
//     <div className="timestamp">{message.val.timestamp}</div>
//     <div className="message">{message.val.message}.</div>
//     <div className="picture">
//       {message.val.url ? (
//         <img src={message.val.url} alt={message.val.url} width="50%" />
//       ) : (
//         "No image"
//       )}
//     </div>
//   </div>
// ));
