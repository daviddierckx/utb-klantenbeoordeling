const express = require("express");
const router = express.Router();
const logger = require("tracer").console();
const jwt = require("jsonwebtoken");
const config = require("./../config");
const forms_controller = require("./controllers/formsController");
const user_controller = require("./controllers/userController");


// User Authentication
router.use(function timeLog(req, res, next) {
  if (
    req._parsedUrl.pathname === "/info" ||
    req._parsedUrl.pathname === "/register" ||
    req._parsedUrl.pathname === "/login"
  ) {
    return next();
  }

  // If you want to skip out add this to your .env file: "SKIP_AUTH=0"
  if (process.env.SKIP_AUTH) {
    return next();
  }

  logger.log("User authentication started");
  const token = (req.header("authorization") ?? "").replace("Bearer ", "");

  jwt.verify(token, config.auth.secret, {}, function (err, decoded) {
    if (err)
      return res.status(401).send({success: false, error: "Unauthorized"});
    req.user_email = decoded.user_email;
    req.user_id = decoded.user_id;
    logger.log("User authorization success:", JSON.stringify(decoded));
    next();
  });
});

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
router.get('/manage/form/:formName/answers', forms_controller.get_all_form_answers);



module.exports = router
