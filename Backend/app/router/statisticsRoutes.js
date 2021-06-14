const express = require("express");
const router = express.Router();
const logger = require("tracer").console();
const statistics_controller = require('./controllers/statisticsController')

// middleware logger
router.use(function timeLog(req, res, next) {
    logger.log(req.originalUrl, 'Time:', Date.now(), 'data:', JSON.stringify(req.body), 'query:', JSON.stringify(req.query), 'params:', JSON.stringify(req.params))
    next();
});

// testing routes. Change these to something more functional down the line
router.get('/feedback/statistics/radio', statistics_controller.getCountRadioButtonAnswers)

module.exports = router
