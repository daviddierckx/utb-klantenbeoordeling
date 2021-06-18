const express = require("express");
const router = express.Router();
const userController = require("./controllers/userController");
const logger = require('tracer').console();

//create, find, update, delete
router.get("/", userController.view);

//Routers
router.get("", (req, res) => {
  res.render("login");
});
router.post("", userController.login);

module.exports = router;