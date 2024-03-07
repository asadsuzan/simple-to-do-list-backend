// import required modules
const express = require("express");
const userController = require("../controllers/user");
const jwtValidation = require("../middlewares/jwtValidation");

// create router
const router = express.Router();

// check server status route
router.get("/", (req, res) => res.json({ status: "UP" }));

//POST :register new user
router.post("/registration", userController.registration);
//POST : login registered user
router.post("/login", userController.login);

// GET: READ USER PROFILE
router.get("/user/profile/:id", jwtValidation, userController.readUserProfile);

module.exports = router;
