const logger = require("tracer").console();

exports.placeholder = function(req, res) {
  logger.log("Sending placeholder request");
  return res
    .status(500)
    .send({ success: false })
},

exports.enter_form_answer = function(req, res) {
  logger.log("Received request to add a form answers");
  return res
    .status(500)
    .send({ success: false, error: "not implemented yet" });
},

exports.return_customer_feedback_html = function(req, res, next) {
  logger.log("Returning customer feedback main page");
};
