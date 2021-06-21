const express = require("express");
const router = express.Router();
const forms_controller = require("./controllers/formsController");
const user_controller = require("./controllers/userController");

router.post("/register", user_controller.register);
router.post("/login", user_controller.login);

// Add router here
// must haves
router.post('/feedback/:formName', forms_controller.enter_form_answer);
router.get('/feedback', forms_controller.placeholder);
router.get('/complaints/overview', forms_controller.placeholder);
// should haves
router.get('/api/feedback/overview');
// could haves
router.get('/complaints/overview', forms_controller.placeholder);
router.post('/complaints', forms_controller.placeholder);
router.put('/complaints/:complaintNr', forms_controller.placeholder);
router.get('/complaints/:complaintNr', forms_controller.placeholder);

// Idk:
router.get('/form/:formName', forms_controller.get_form);
router.post('/form/:formName', forms_controller.enter_form_answer);
router.post('/manage/form', forms_controller.add_new_form);
router.get('/form/:formName', forms_controller.get_form);
router.get('/manage/form/:formName/answers', forms_controller.get_all_form_answers);

module.exports = router
