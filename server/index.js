// TODO: MVC architecture

const express = require("express");
const { config } = require("dotenv");
const { Configuration, OpenAIApi } = require("openai");

config();
const cors = require("cors");
const app = express();

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.API_KEY,
  })
);

app.use(cors()); // This allows all origins to access your server

app.use(express.json());

app.post("/chat", async (req, res) => {
  const input = req.body.input;
  const result = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: input }],
  });
  const output = result.data.choices[0].message.content;
  res.json({ output });
});

const port = process.env.PORT || 2121;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
