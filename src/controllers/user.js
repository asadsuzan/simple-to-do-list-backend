//import required modules
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

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
      // check if the user already exists with the given userName or email
      const existingUser = await User.findOne({
        $or: [{ userName }, { email }],
      });

      if (existingUser) {
        return res.status(400).json({
          status: "failed",
          message: "User with this username or email already exists",
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

// login registered user
userController.login = async (req, res) => {
  // validate login credentials
  const email = req.body.email ? req.body.email : null;
  const password =
    req.body.password && req.body.password.trim().length >= 4
      ? req.body.password
      : null;

  try {
    if (email && password) {
      // find the user by email
      const user = await User.findOne({ email }).lean();
      // check if the user not exits
      if (!user) {
        return res.status(401).json({
          status: "failed",
          message: "Invalid email or password",
        });
      }

      //  compare the provided password with the  stored hashed password
      const isPasswordMatched = await bcrypt.compare(password, user.password);
      if (!isPasswordMatched) {
        return res.status(401).json({
          status: "failed",
          message: "Invalid email or password",
        });
      }

      // exclude password form the user object
      delete user.password;
      // generate a JWT token
      const token = jwt.sign(
        { userId: user._id, userEmail: user.email, userName: user.userName },
        "your-secret-key",
        {
          expiresIn: "1h", // Token expiration time (optional)
        }
      );

      res.status(200).json({
        status: "success",
        message: "Login successful",
        data: user,
        token: token,
      });
    } else {
      res.status(400).json({
        status: "failed",
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    console.log(`ERROR ON USER LOGIN :: ${error.message}`);

    res.status(500).json({ status: "error", message: error.message });
  }
};
module.exports = userController;

// read user profile
userController.readUserProfile = async (req, res) => {
  // extract userId form request object
  const { userId } = req;

  try {
    // find the user with userId
    const user = await User.findById(userId).lean();

    if (user) {
      // exclude password form the user object
      delete user.password;
      res.status(200).json({ status: "success", data: user });
    } else {
      res
        .status(404)
        .json({ status: "failed", message: "user profile not found" });
    }
  } catch (error) {
    console.log(`ERROR IN USER PROFILE READ :: ${error.message}`);

    res.status(500).json({ status: "error", message: error.message });
  }
};

userController.updateUserProfile = async (req, res) => {
  // extract userId form request header
  const { userId } = req;

  // extract update payload form request body
  const userName =
    req.body.userName && req.body.userName.trim().length >= 4
      ? req.body.userName
      : null;
  const password =
    req.body.password && req.body.password.trim().length >= 4
      ? req.body.password
      : null;

  try {
    // find the user with userId
    const user = await User.findById(userId);

    if (!user) {
      // Handle case where user doesn't exist
      return res
        .status(404)
        .json({ status: "failed", message: "User profile not found" });
    }

    // construct updated data
    const updatedData = {
      userName: userName ? userName : user.userName,
      password: password ? await bcrypt.hash(password, 10) : user.password, // hashed the password
    };

    // update user data
    user.set(updatedData);

    // Check if any data is modified after updating
    const isAnyDataModified = user.isModified();

    // save updated data only if any data is modified
    if (isAnyDataModified) {
      await user.save();
    }

    //  delete the password property from the user object in the response
    delete user._doc.password;

    // send appropriate response based on whether data is modified
    if (isAnyDataModified) {
      res
        .status(200)
        .json({ status: "success", message: "profile updated", data: user });
    } else {
      res.status(200).json({ status: "success", message: "No data updated" });
    }
  } catch (error) {
    console.log(`ERROR IN USER PROFILE UPDATE :: ${error.message}`);
    if (error.name === "MongoServerError" && error.code === 11000) {
      return res
        .status(500)
        .json({ status: "Duplicate key error", message: error.message });
    }

    res.status(500).json({ status: "error", message: error.message });
  }
};
