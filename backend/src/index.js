const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./routers");
const bodyParser = require("body-parser");

dotenv.config({ path: "src/.env" });

const app = express();
const port = process.env.PORT;
const hostname = process.env.HOSTNAME;

app.use(bodyParser.json());
routes(app);
mongoose
  .connect(`${process.env.MONGODB_URL}`)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
