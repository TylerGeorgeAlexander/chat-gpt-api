import React, { useState } from "react";

const InputChatGPT = () => {
  const [output, setOutput] = useState("");

  const handleClick = () => {
    const requestData = {
      input: "Hello, how are you?",
    };

    fetch("http://localhost:2121/chat", {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setOutput(data.output);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <button onClick={handleClick}>Click me</button>
      <div>{output}</div>
    </div>
  );
};

export default InputChatGPT;
