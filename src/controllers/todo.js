// import required modules
const User = require("../models/user");
const Todo = require("../models/todo");
const mongoose = require("mongoose");

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
    try {
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
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  } else {
    res.status(400).json({
      status: "failed",
      message: "there iss problem in your request",
      hints: "title filed is required",
    });
  }
};

// read todo list
todoController.readTodoList = async (req, res) => {
  // extract userId from request header
  const { userId } = req;

  if (userId) {
    try {
      // find users todo list by userId extracted from req header
      const todoList = await Todo.find({ userId });

      res.status(200).json({
        status: "success",
        message: "All Todos",
        count: todoList ? todoList.length : null,
        data: todoList ? todoList : [],
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  } else {
    res.status(404).json({
      status: "failed",
      message: "Invalid user id",
    });
  }
};

// read single todo
todoController.readTodoById = async (req, res) => {
  // extract todo id form params
  const { id } = req.params;
  // extract user id form req header
  const { userId } = req;
  // validate id
  const todoId = id && mongoose.Types.ObjectId.isValid(id) ? id : null;

  if (todoId) {
    try {
      // find todo by todoId and userId
      const todo = await Todo.findOne({
        $and: [{ userId: userId }, { _id: todoId }],
      });

      // check if todo not exits
      if (!todo) {
        return res.status(404).json({
          status: "Not Found",
          message: `No Todo found associated with user:${userId} and todo:${todoId}`,
        });
      }
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  } else {
    res.status(404).json({
      status: "failed",
      message: "Invalid Todo id",
    });
  }
};

module.exports = todoController;
