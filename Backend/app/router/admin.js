const express = require("express");
const router = express.Router();
const adminController = require("./controllers/adminController");
const forms_controller = require("./controllers/formsController");
const user_controller = require("./controllers/userController");

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

// routes uit het routes document op de drive
// geen idee wat de routes hierboven precies betekenen
// - sylvester

// must haves
router.get("/console", forms_controller.placeholder); //staat nu op /admin maar is af
router.post("/login", forms_controller.placeholder); //done
router.get("/feedback/overview", forms_controller.placeholder);
router.delete("/feedback/:feedbackId", forms_controller.placeholder);
router.put("/feedback/:feedbackId", forms_controller.placeholder);
router.post("/users", forms_controller.placeholder);
//delete a user
router.get("/users/:id", adminController.delete);//done
router.put("/users/:userId", forms_controller.placeholder);
// should haves
router.post("/feedback/:formId", forms_controller.placeholder);
router.delete("/feedback/:formId", forms_controller.placeholder);
router.put("/feedback/:formId", forms_controller.placeholder);
router.get("/feedback/overview/:date", forms_controller.placeholder);
router.get("/feedback/overview/:rating", forms_controller.placeholder);
router.get("/feedback/:formId", forms_controller.placeholder);
// could haves
router.get("/feedback/overview/:orderNr", forms_controller.placeholder);
router.delete("/complaints/:complaintNr", forms_controller.placeholder);

module.exports = router;
