const express = require('express');
const router = express.Router();
const logger = require('tracer').console()
const forms_controller = require('./controllers/formsController');
const user_controller = require('./controllers/userController');

// middleware logger
router.use(function timeLog(req, res, next) {
    logger.log(req.originalUrl, 'Time:', Date.now(), 'data:', JSON.stringify(req.body), 'query:', JSON.stringify(req.query), 'params:', JSON.stringify(req.params))
    next()
});

// User Authentication
router.use(function timeLog(req, res, next) {
    if (req._parsedUrl.pathname === "/info" || req._parsedUrl.pathname === "/register" || req._parsedUrl.pathname === "/login") {
        return next();
    }

    logger.log("User authentication started");
    const token = (req.header("authorization") ?? "").replace('Bearer ', '');
    console.log("token: ", token);

    jwt.verify(token, config.auth.secret, {}, function (err, decoded) {
        if (err) return res.status(401).send({"success": false, "error": "Unauthorized"});
        req.user_email = decoded.user_email;
        req.user_id = decoded.user_id;
        logger.log("User authorization success:", JSON.stringify(decoded));
        next();
    });
});

router.post('/register', user_controller.register);
router.post('/login', user_controller.login);

// Add router here
router.get('/:formId/addAnswer', forms_controller.enter_form_answer);


module.exports = router