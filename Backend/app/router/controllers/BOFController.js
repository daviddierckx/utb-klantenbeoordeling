const mysql = require("mysql");
const database = require("../../dao/database");
const forms_dao = require("../../dao/formsDao");
const logger = require("tracer").console();

exports.view = (req, res) => {
  forms_dao.getAllFormAnswers("hatsaaa2", (err2, res2) => {
    //change hatsaaa2 later to a profesional name
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
