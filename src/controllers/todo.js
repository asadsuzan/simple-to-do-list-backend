// import required modules
const User = require("../models/user");
const Todo = require("../models/todo");

const todoController = {};

// create todo
todoController.createTodo = async (req, res) => {
  // validate request body or todo data
  const title =
    req.body.title && req.body.title.trim().length > 0 ? req.body.title : null;
  const description =
    req.body.description && req.body.description.trim().length > 0
      ? req.body.description
      : "";

  // extract userId from request header
  const { userId } = req;

  if (title) {
    // find user by userId extracted from req header
    const user = await User.findById(userId);

    // check if user not exits
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "No user found",
      });
    }

    //  construct new todo
    const todo = new Todo({
      title: title,
      description: description,
      userId: userId,
    });

    // save the todo
    await todo.save();

    res.status(201).json({
      status: "success",
      message: "Todo added success",
      data: todo,
    });
  } else {
    res.status(400).json({
      status: "failed",
      message: "there iss problem in your request",
      hints: "title filed is required",
    });
  }
};

module.exports = todoController;
