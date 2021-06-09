const logger = require('tracer').console();
const request_utils = require('./../../utils/requestUtils');
const forms_dao = require('./../../dao/formsDao');

exports.placeholder = function (req, res) {
  logger.log("Sending placeholder request");
  return res.status(500).send({success: false})
}

exports.return_customer_feedback_html = function (req, res, next) {
  logger.log("Returning customer feedback main page");
}

exports.get_form = function (req, res) {
  logger.log("Received request for a form");
  let check = request_utils.verifyParam(req, res, 'formName', 'string');
  if (!check) {
    logger.log("Request cancelled because of an invalid param");
    return;
  }

  forms_dao.getForm(req.params.formName, (err2, res2) => {
    if (err2) {
      logger.log("Error in receiving form:", err2);
      return res.status(400).send({"success": false, "error": err2});
    }
    logger.log("Got form data", JSON.stringify(res2));
    return res.status(201).send({"success": true, "data": res2});
  });
};

exports.add_new_form = function (req, res) {
  logger.log("Received request to create a new form");
  let check = request_utils.verifyBody(req, res, 'name', 'string');
  check = check && request_utils.verifyBody(req, res, 'title', 'string');
  check = check && request_utils.verifyBody(req, res, 'subtitle', 'string');
  if (!check) {
    logger.log("Request cancelled because of an invalid param");
    return;
  }

  forms_dao.createForm(req.body, (err2, res2) => {
    if (err2) {
      logger.log("Error in creating form:", err2);
      return res.status(400).send({"success": false, "error": err2});
    }
    logger.log("Form created with formId", res2);
    return res.status(201).send({"success": true, "id": res2, "name": req.body.name});
  });
};

exports.enter_form_answer = function (req, res) {
  logger.log("Received request to add a form answers");
  let check = request_utils.verifyParam(req, res, 'formName', 'string');
  check = check && request_utils.verifyBody(req, res, 'answers', 'object');
  if (!check) {
    logger.log("Request cancelled because of an invalid param");
    return;
  }

  forms_dao.addFormAnswer(req.params.formName, req.body.answers, (err2, res2) => {
    if (err2) {
      logger.log("Error in adding form answers:", err2);
      return res.status(400).send({"success": false, "error": err2});
    }
    const formId = res2.id
    logger.log("Got form answer data", JSON.stringify(res2));
    return res.status(201).send({"success": true, "data": res2});
  });
};
