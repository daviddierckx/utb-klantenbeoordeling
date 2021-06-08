const express = require("express");
const router = express.Router();
const adminController = require("./controllers/adminController");
const forms_controller = require('./controllers/formsController');
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

// routes uit het routes document op de drive
// geen idee wat de routes hierboven precies betekenen
// - sylvester

// must haves
router.get('/admin/console', forms_controller.placeholder);
router.post('/login', forms_controller.placeholder);
router.get('/admin/feedback/overview', forms_controller.placeholder);
router.delete('/admin/feedback/:feedbackId', forms_controller.placeholder);
router.put('/admin/feedback/:feedbackId', forms_controller.placeholder);
router.get('/admin/users/overview', forms_controller.placeholder);
router.post('/admin/users', forms_controller.placeholder);
router.delete('/admin/users/:userId', forms_controller.placeholder);
router.put('/admin/users/:userId', forms_controller.placeholder);
// should haves
router.post('/admin/feedback/:formId', forms_controller.placeholder);
router.delete('/admin/feedback/:formId', forms_controller.placeholder);
router.put('/admin/feedback/:formId', forms_controller.placeholder);
router.get('/feedback/overview/:date', forms_controller.placeholder);
router.get('/feedback/overview/:rating', forms_controller.placeholder);
router.get('/admin/admin/feedback/:formId', forms_controller.placeholder);
// could haves
router.get('/feedback/overview/:orderNr', forms_controller.placeholder);
router.delete('/complaints/:complaintNr', forms_controller.placeholder);

module.exports = router;
