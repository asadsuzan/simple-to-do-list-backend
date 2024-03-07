const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // Additional fields for user profile if needed
  },
  { timestamps: true, versionKey: false }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
