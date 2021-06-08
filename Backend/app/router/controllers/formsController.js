const logger = require('tracer').console();
const request_utils = require('./../../utils/requestUtils');
const forms_dao = require('./../../dao/formsDao');

exports.enter_form_answer = function (req, res) {
  logger.log("Received request to add a form answers");
  return res.status(500).send({"success": false, "error": "not implemented yet"});
};


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
    logger.log("Got form data", res2);
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
