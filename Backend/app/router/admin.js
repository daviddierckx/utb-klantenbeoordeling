const express = require("express");
const router = express.Router();
const adminController = require("./controllers/adminController");

//create, find, update, delete
router.get("/", adminController.view);
router.post("/", adminController.search);
//Router
router.get("", (req, res) => {
  res.render("home");
});

module.exports = router;
