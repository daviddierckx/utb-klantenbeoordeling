const mysql = require("mysql");
const database = require("../../dao/database");

exports.view = (req, res) => {
  res.render("beoordelingsformulier", { layout: false });
};
