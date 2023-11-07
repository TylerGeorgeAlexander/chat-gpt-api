# chat-gpt-api

[Live Demo](https://chat-gpt-api-generator-e42f3131abd6.herokuapp.com/)

![Chat GPT API Generator homepage](chat-gpt-api-generator-homepage.png)

## Node-Based Application with ChatGPT API

This Node.js application allows users to input text via the console and receive output generated by the ChatGPT API.

### Technologies Used

- Node.js
- Express.js
- MongoDB
- JSON Web Tokens (JWT) for authentication
- React.js for the front-end
- React Router for routing
- Tailwind CSS for styling
- OpenAI's GPT-3.5 model/engine for generating responses

### Installation

1. Clone this repository to your local machine.
2. Navigate to the directory containing the cloned repository using the terminal.
3. Run `npm install` to install the necessary dependencies.

### Configuration

To use this application, you need to set up the environment variables. Follow the steps below:

1. Create a file named `.env` in the root directory of the cloned repository.
2. Open the `.env` file in a text editor.
3. Add the following environment variables and their corresponding values:

   ```plaintext
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   API_KEY=your_openai_api_key
   ```

   - `MONGODB_URI`: Replace `your_mongodb_uri` with the URI of your MongoDB database. This URI is used to connect the server with the MongoDB database. Make sure you have a MongoDB database set up and replace `your_mongodb_uri` with the actual URI.
   - `JWT_SECRET`: Replace `your_jwt_secret` with a secret key of your choice. This secret key is used for JSON Web Token (JWT) authentication. Choose a strong secret key to ensure security.
   - `API_KEY`: Replace `your_openai_api_key` with your API key obtained from the OpenAI website. This API key is used to authenticate and access the ChatGPT API.

   Make sure to remove the `your_` prefix and replace it with the actual values.

4. Save the `.env` file.

### Usage

1. In the terminal, navigate to the directory containing the cloned repository.
2. Run `npm run dev` to start the application.
3. Enter your input text into the console and press Enter.
4. Wait for the application to generate output using the ChatGPT API.
5. The output will be displayed in the console.

### Notes

- This application is for demonstration purposes only and is not intended for production use.
- The ChatGPT API is a paid service. Be sure to check the pricing and billing information on the OpenAI website before using this application.
- The GPT-3.5 model/engine from OpenAI is used for generating responses. It is a state-of-the-art language model capable of generating human-like text based on the provided prompts.

### Contributing

If you would like to contribute to this project, please:

1. Fork the repository.
2. Create a branch for your changes.
3. Make your changes and commit them with a clear message.
4. Push your changes to your forked repository.
5. Submit a pull request with a detailed explanation of the changes you made and why they are important.

### License

This project is licensed under the MIT license.

Make sure to follow these instructions to set up the environment variables properly before running the application.