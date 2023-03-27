import React, { useState } from "react";

const InputChatGPT = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  const handleClick = () => {
    const requestData = {
      input: input,
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
      <textarea value={input} onChange={handleChange} />
      <button onClick={handleClick}>Send</button>
      <div>{output}</div>
    </div>
  );
};

export default InputChatGPT;
