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

    //Add answers to res2
    forms_dao.getAllFormAnswers(req.params.formName, (err3, res3) => {
      if (err3) {
        logger.log("Error in receiving answers:", err3);
        return res.status(400).send({"success": false, "error": err3});
      }
      logger.log("Got form answers", JSON.stringify(res3));
      res.render("beoordelingsoverzicht", {data: res2, data2: res3});
    })
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
