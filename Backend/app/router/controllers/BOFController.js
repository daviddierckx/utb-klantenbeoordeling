const mysql = require("mysql");
const database = require("../../dao/database");
const logger = require("tracer").console();

exports.view = (req, res) => {
  res.render("beoordelingsformulier", { layout: false });
},

exports.submit = function(req, res) {
  logger.log("Received submission, redirecting...");
  res.render("succes", { layout:false });
};
