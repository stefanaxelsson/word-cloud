const express = require("express");
const app = express();
const path = require("path");
const getWords = require("./getWords");

app.use(
  "/assets",
  express.static(path.resolve(__dirname, "../../public/assets"))
);

app.get("/words", (req, res) => {
  getWords(req.query.url)
    .then(words => res.json({ words }))
    .catch(error => res.status(400).json({ error }));
});

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../public/index.html"));
});

app.listen(3000);

console.log("Server listening on port 3000");
