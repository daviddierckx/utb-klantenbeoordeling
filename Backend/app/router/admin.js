const express = require("express");
const router = express.Router();
const adminController = require("./controllers/adminController");

//create, find, update, delete
router.get("/", adminController.view);

//Router
router.get("", (req, res) => {
  res.render("home");
});

// routes uit het routes document op de drive
// geen idee wat de routes hierboven precies betekenen
// - sylvester

// must haves
router.get('/admin/console', method);
router.post('/login', method);
router.get('/admin/feedback/overview', method);
router.delete('/admin/feedback/:feedbackId', method);
router.put('/admin/feedback/:feedbackId', method);
router.get('/admin/users/overview', method);
router.post('/admin/users', method);
router.delete('/admin/users/:userId', method);
router.put('/admin/users/:userId', method);
// should haves
router.post('/admin/feedback/:formId', method);
router.delete('/admin/feedback/:formId', method);
router.put('/admin/feedback/:formId', method);
router.get('/feedback/overview/:date', method);
router.get('/feedback/overview/:rating', method);
router.get('/admin/admin/feedback/:formId', method);
// could haves
router.get('/feedback/overview/:orderNr', method);
router.delete('/complaints/:complaintNr', method);

module.exports = router;
