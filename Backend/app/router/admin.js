const express = require("express");
const router = express.Router();
const adminController = require("./controllers/adminController");
const user_controller = require("./controllers/userController");

//create, find, update, delete
router.get("/", adminController.view);
router.post("/", adminController.search);

router.get("/adduser", adminController.adduser);
router.post("/adduser", user_controller.register);

//Router
router.get("", (req, res) => {
  res.render("home");
});

module.exports = router;
