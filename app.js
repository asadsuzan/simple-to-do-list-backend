// import required modules
const express = require("express");
const router = require("./src/routes/api");
const config = require("./src/config/config");
const mongoose = require("mongoose");

// crate express app
const app = express();

// Connect to the MongoDB database using the configuration
const mongoURI = `mongodb://localhost:27017/todolist`;
const options = {};
mongoose.connect(mongoURI, options);

//Check if the mongoose connection is successful
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDb connection error:"));
db.once("open", () => console.log("MongoDb Connected"));

// Middleware to parse json request\
app.use(express.json());

// api routes
app.use("/api/v1", router);

module.exports = app;
