import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

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
    <div className="flex flex-col gap-2 p-4">
      <label htmlFor="chat-prompt" className="font-bold">
        Input chatGPT prompt(s):
      </label>
      <textarea
        id="chat-prompt"
        className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={input}
        onChange={handleChange}
      />
      <button
        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={handleClick}
      >
        Send
      </button>
      <div className="prose">
        <ReactMarkdown>{`${output}`}</ReactMarkdown>
      </div>
    </div>
  );
};

export default InputChatGPT;
