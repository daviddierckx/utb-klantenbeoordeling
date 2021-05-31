const logger = require('tracer').console()


exports.enter_form_answer = function (req, res) {
    logger.log("Received request to add a form answers");
    return res.status(500).send({"success": false, "error": "not implemented yet"});
};