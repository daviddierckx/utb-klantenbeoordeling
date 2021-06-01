const mysql = require("mysql");
const database = require("../../dao/database");

exports.view = (req, res) => {
  // User the connection
  database.con.query("SELECT * FROM User", (err, rows) => {
    if (!err) {
      res.render("home", { rows });
    } else {
      console.log(err);
    }
    console.log("The data from user table: \n", rows);
  });
};
