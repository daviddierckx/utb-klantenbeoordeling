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

//Find by Search
exports.search = (req, res) => {
  let searchTerm = req.body.search;
  database.con.query(
    "SELECT * FROM User WHERE name LIKE ?",
    ["%" + searchTerm + "%"],
    (err, rows) => {
      if (!err) {
        res.render("home", { rows });
      } else {
        console.log(err);
      }
      console.log("The search data from user table: \n", rows);
    }
  );
};

//Add new user
exports.adduser = (req, res) => {
  res.render("add-user", { layout: false });
};

//delete user
exports.delete = (req, res) => {
  console.log(req.params.id);

  // User the connection
  database.con.query(
    "DELETE FROM User WHERE id = ?",
    [req.params.id],
    (err, rows) => {
      if (!err) {
        res.redirect("/admin");
      } else {
        console.log(err);
      }
      console.log("The data from user table: \n", rows);
    }
  );
};
