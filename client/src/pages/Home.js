import React from 'react';
import heroImage from '../logo.svg'; // Update this path to where your hero image is stored

const Home = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-cover bg-center h-96 flex items-center justify-center" style={{ backgroundImage: `url(${heroImage})` }}>
        <h1 className="text-4xl text-white font-bold">Welcome to Chat GPT API Generator</h1>
      </div>
      <div className="max-w-3xl mx-auto p-8">
        <h2 className="text-2xl font-bold mb-4">What is Chat GPT API Generator?</h2>
        <p className="mb-4">
          Chat GPT API Generator is an innovative tool designed to enable developers to seamlessly integrate OpenAI's ChatGPT model into their applications. With a user-friendly interface, you can customize and generate the necessary API code for your project.
        </p>
        <h2 className="text-2xl font-bold mb-4">Features</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Customize ChatGPT options to suit your needs.</li>
          <li>Generate and copy API code snippets with a single click.</li>
          <li>Easily integrate ChatGPT into your applications.</li>
        </ul>
        <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
        <p className="mb-4">
          To get started, navigate to the Dashboard. There, you'll find various options to tailor ChatGPT to your project and generate the API code. Once you have customized the settings to your liking, click the 'Generate' button to obtain the code snippet. You can then easily integrate it into your application.
        </p>
      </div>
    </div>
  );
};

export default Home;
