const express = require("express");
const router = express.Router();
const userController = require("./controllers/userController");

//create, find, update, delete
router.get("/", userController.view);

//Router
router.get("", (req, res) => {
  res.render("login");
});

module.exports = router;