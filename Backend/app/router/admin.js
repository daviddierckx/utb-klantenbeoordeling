const express = require("express");
const router = express.Router();
const adminController = require("./controllers/adminController");
const forms_controller = require("./controllers/formsController");
const user_controller = require("./controllers/userController");
const BOFController = require("./controllers/BOFController");

//create, find, update, delete
router.get("/", adminController.view);
router.post("/", adminController.search);

router.get("/adduser", adminController.adduser);
router.post("/adduser", user_controller.register);

router.get("/forms/manage", adminController.manageForms);

router.get("/edituser/:id", adminController.edituser);
router.post("/edituser/:id", user_controller.update);
router.get("/users/overview/:id", adminController.viewUser);

//Router
router.get("", (req, res) => {
  res.render("home");
});

router.get("/forms", BOFController.manageGetForms);
router.get("/forms/select", BOFController.selectFormAdmin);
router.post("/forms/update/:formName", BOFController.updateForm);
router.post("/forms/create/:formName", BOFController.createForm);
router.get("/forms/:formName", BOFController.viewFormAnswers);
router.post("/forms/:formName", BOFController.search);
router.get("/forms/:formName/:entryId", BOFController.viewSingle);

module.exports = router;
