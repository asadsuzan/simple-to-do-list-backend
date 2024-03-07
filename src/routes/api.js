// import required modules
const express = require("express");
const userController = require("../controllers/user");

// create router
const router = express.Router();

// check server status route
router.get("/", (req, res) => res.json({ status: "UP" }));

//POST :register new user
router.post("/registration", userController.registration);

module.exports = router;
