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
      return res.status(200).json({
        status: "success",
        todo: todo,
      });
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

//update or edit todo

todoController.updateTodo = async (req, res) => {
  //validation
  const title = req.body.title ? req.body.title : undefined;
  const description = req.body.description ? req.body.description : undefined;
  const completed =
    typeof req.body.completed === "boolean" ? req.body.completed : undefined;
  const todoId =
    req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)
      ? req.params.id
      : null;

  // extract userId for request header
  const { userId } = req;

  if (todoId) {
    //     find the todo associated with todoId and userId
    const todo = await Todo.findOne({
      $and: [{ _id: todoId }, { userId: userId }],
    });

    //     check if todo not found
    if (!todo) {
      return res.status(404).json({
        status: "failed",
        message: `  No todo found associated with user:${userId} and todo:${todoId}`,
      });
    }

    // new todo
    const newTodo = {
      title: title ? title : todo.title,
      description: description ? description : todo.description,
      completed: typeof completed === "boolean" ? completed : todo.completed,
    };

    // update todo
    todo.set(newTodo);

    //   check any data modified
    const isAnyDataUpdated = todo.isModified();

    //     save data if only modified
    if (isAnyDataUpdated) {
      await todo.save();
      return res
        .status(201)
        .json({ status: "success", message: "Todo Updated successfully" });
    }

    res.status(200).json({ status: "success", message: "No Data Updated" });
  } else {
    res.status(403).json({
      status: "failed",
      message: "Invalid token id",
    });
  }
};

// delete single todo item
todoController.deleteSingleTodo = async (req, res) => {
  // validation
  const todoId =
    req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)
      ? req.params.id
      : null;

  // extract userId from request header
  const { userId } = req;

  if (todoId) {
    try {
      // delete or remove todo associated with todoId and userId
      const todo = await Todo.deleteOne({
        $and: [{ userId: userId }, { _id: todoId }],
      });

      //     check if not deleted
      if (todo.deletedCount === 0) {
        return res.status(200).json({
          status: "success",
          message: `No todo found with todoId ${todoId}`,
        });
      }

      res.status(200).json({
        status: "success",
        message: "Todo deleted Successfully ",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: `Internal server error : ${error.message}`,
      });
    }
  } else {
    res.status(404).json({
      status: "failed",
      message: "Invalid Todo Id",
    });
  }
};

// update todo status is completed or not
todoController.updateTodoStatus = async (req, res) => {
  // validation
  const todoId =
    req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)
      ? req.params.id
      : null;

  const completed =
    (req.params.complete &&
      req.params.complete.trim().length !== 0 &&
      req.params.complete.toLowerCase() === "true") ||
    req.params.complete.toLowerCase() === "false"
      ? JSON.parse(req.params.complete.toLowerCase())
      : undefined;

  // extract userId from request header
  const { userId } = req;

  if (todoId) {
    // find and update todo status associated with userId and todoId

    const todo = await Todo.findOne({
      $and: [{ _id: todoId }, { userId: userId }],
    });

    // check if todo not found
    if (!todo) {
      return res.status(404).json({
        status: "failed",
        message: `No todo found associated with user ${userId} and todo ${todoId}`,
      });
    }

    // new todo
    const newTodo = {
      title: todo.title,
      description: todo.description,
      completed: typeof completed === "boolean" ? completed : todo.completed,
    };

    //  update todo status
    todo.set(newTodo);

    // check status updated or not
    const isStatusUpdated = todo.isModified();

    // save todo only if status updated
    if (isStatusUpdated) {
      await todo.save();
      return res.status(200).json({
        status: "success",
        message: "Todo updated successfully",
        data: newTodo,
      });
    }

    res.status(200).json({
      status: "success",
      message: "No Data Updated",
    });
    try {
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: `Internal server error: ${error.message} `,
      });
    }
  } else {
    res.status(404).json({
      status: "failed",
      message: `No Todo found associated with  id ${todoId}`,
    });
  }
};

module.exports = todoController;
