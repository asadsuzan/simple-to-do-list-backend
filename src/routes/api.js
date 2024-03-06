// import required modules
const express = require("express");
const router = express.Router();

// check server status route
router.get("/", (req, res) => res.json({ status: "UP" }));

module.exports = router;
