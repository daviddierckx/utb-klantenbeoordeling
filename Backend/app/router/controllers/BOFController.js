const request_utils = require('./../../utils/requestUtils');
const forms_dao = require("../../dao/formsDao");
const logger = require("tracer").console();

exports.view = (req, res) => {
  forms_dao.getForm("utb-feedback-1", (err2, res2) => {
    if (err2) {
      logger.log("Error in receiving form:", err2);
      return res.status(400).send({"success": false, "error": err2});
    }
    logger.log("Got form data", JSON.stringify(res2));
    res.render("beoordelingsformulier", { layout: false, data: res2});
  });
};

exports.viewForm = (req, res) => {
  logger.log("Received request to add a form answers");
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
    res.render("beoordelingsformulier", { layout: false, data: res2});
  });
};

exports.submit = function(req, res) {
  logger.log("Received submission, redirecting...");
  res.render("succes", { layout:false });
};

exports.submitForm = function(req, res) {
  logger.log("Received request to add a form answers");
  let check = request_utils.verifyParam(req, res, 'formName', 'string');
  if (typeof req.body.answers === "string"){
    req.body.answers = JSON.parse(req.body.answers);
  }
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
    logger.log("Got adding form answer data", JSON.stringify(res2));
    res.render("succes", { layout:false });
  });
};

exports.updateForm = function(req, res) {
  logger.log("Received request to update a form");
  let check = request_utils.verifyParam(req, res, 'formName', 'string');
  if (typeof req.body.data === "string"){
    req.body.data = JSON.parse(req.body.data);
  }
  check = check && request_utils.verifyBody(req, res, 'data', 'object');
  if (!check) {
    logger.log("Request cancelled because of an invalid param");
    return;
  }

  forms_dao.updateForm(req.params.formName, req.body.data, (err2, res2) => {
    if (err2) {
      logger.log("Error in updating form:", err2);
      return res.status(400).send({"success": false, "error": err2});
    }
    logger.log("Form updated with formId", res2);
    res.redirect("/admin/forms");
    return res.status(201).send({"success": true, "id": res2, "name": req.body.name});
  });
};

exports.manageGetForms = function(req, res) {
  forms_dao.getAllForms("utb-feedback-1", (err2, res2) => {
    if (err2) {
      logger.log("Error in receiving form:", err2);
      return res.status(400).send({"success": false, "error": err2});
    }
    logger.log("Got all forms data", JSON.stringify(res2));
    res.render("manageForms", { layout: false, data: res2});
  });
};
