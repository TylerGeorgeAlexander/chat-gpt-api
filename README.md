# GPT-3.5-Turbo App
This app is designed to take input from users and display GPT-3.5-generated messages. It has a server-client architecture using React on the front-end and Node.js with Express on the back-end.

## Installation
To use this app, you will need to have Node.js and npm installed on your computer. Once you have those, follow these steps:

- Clone this repository to your local machine.
- Open a terminal and navigate to the root directory of the app.
- CD into the server and client folders
- Run the command npm install to install all of the app's dependencies.
- Create a `.env` file inside of your server folder:

  - Populate your API_KEY=
  - with https://platform.openai.com/account/api-keys

- Once the dependencies are installed, run the command npm start in the root folder to run both the server and client concurrently.

### Open a web browser and navigate to http://localhost:3000 to use the app.
## Usage
Using the app is straightforward. Simply type your message into the input field and press the "Generate" button. The app will then send your input to the server, which will use GPT-3.5 to generate a response. The response will be displayed on the screen below the input field.

## Technologies Used
The front-end of the app is built using React, while the back-end is built using Node.js with Express. The app uses the GPT-3.5 API to generate responses to user input.

## Contributing
If you would like to contribute to this app, please fork the repository and submit a pull request with your changes.

## License
This app is licensed under the MIT license.
