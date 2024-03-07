//import required modules
const User = require("../models/user");
const bcrypt = require("bcrypt");

// module scaffolding
const userController = {};

// register new user
userController.registration = async (req, res) => {
  // validate user data
  const userName =
    req.body.userName && req.body.userName.trim().length >= 4
      ? req.body.userName
      : null;
  const password =
    req.body.password && req.body.password.trim().length >= 4
      ? req.body.password
      : null;
  const email = req.body.email ? req.body.email : null;

  try {
    if (userName && password && email) {
      // check if the user already exits
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({
          status: "failed",
          message: "User with this email already exists",
        });
      }

      // hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // create new user
      const newUser = new User({ userName, password: hashedPassword, email });
      // save the user to database
      await newUser.save();
      // exclude password from the response
      const userResponse = {
        id: newUser._id,
        userName,
        email,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      };
      res.status(201).json({
        status: "success",
        message: "User registered successfully",
        data: userResponse,
      });
    } else {
      res.status(400).json({
        status: "failed",
        message: "there is problem in your request",
        hints: `userName and password should be at least 4 characters and all the filed is required `,
      });
    }
  } catch (error) {
    console.log(`ERROR ON USER REGISTER :: ${error.message}`);
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = userController;
