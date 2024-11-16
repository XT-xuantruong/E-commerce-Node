const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const hostname = process.env.HOSTNAME || "127.0.0.1";

app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
