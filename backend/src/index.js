// index.js
const dotenv = require("dotenv");
dotenv.config({ path: '../.env' });

const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routers");
const bodyParser = require("body-parser");

const app = express();

console.log('Environment variables:', {
  PORT: process.env.PORT,
  HOSTNAME: process.env.HOSTNAME,
  MONGODB_URL: process.env.MONGODB_URL
});

const port = process.env.PORT 
const hostname = process.env.HOSTNAME
const mongoUrl = process.env.MONGODB_URL 

// Support JSON
app.use(bodyParser.json());

// Support Form Data
app.use(bodyParser.urlencoded({ extended: true }));

// // Hoặc sử dụng formidable nếu cần xử lý file upload
// app.use(formidable());
routes(app);


mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to MongoDB");
  
    app.listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
    });
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB:", err.message);
    process.exit(1);  
  });