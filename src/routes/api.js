// import required modules
const express = require("express");
const userController = require("../controllers/user");
const todoController = require("../controllers/todo");
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
// PUT: UPDATE USER PROFILE
router.put(
  "/user/profile/edit",
  jwtValidation,
  userController.updateUserProfile
);
// POST: CREATE NEW TODO
router.post("/todo/create/new", jwtValidation, todoController.createTodo);

module.exports = router;
