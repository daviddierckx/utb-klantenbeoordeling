const users_dao = require("./../../dao/userDao");
const request_utils = require("./../../utils/requestUtils");
const logger = require("tracer").console();

exports.register = function (req, res) {
  logger.log("Received request to register user");
  let check = request_utils.verifyBody(req, res, "name", "string");
  check = check && request_utils.verifyBody(req, res, "isAdmin", "int");
  check = check && request_utils.verifyBody(req, res, "email", "email");
  check = check && request_utils.verifyBody(req, res, "password", "password");
  if (!check) {
    logger.log("Request cancelled because of an invalid param");
    return;
  }

  users_dao.add(
    {
      name: req.body.name,
      isAdmin: req.body.isAdmin,
      email: req.body.email,
      password: req.body.password,
    },
    (err2, res2) => {
      if (!err2) {
        logger.log("Error in register:", err2);
        return res.status(400).send({ success: false, error: err2 });
      }

      res.redirect("adduser");

      return res
        .status(201);
    }
  );
};

exports.login = function (req, res) {
    logger.log("Received request to log user in");
    let check = request_utils.verifyBody(req, res, 'email', 'email');
    check = check && request_utils.verifyBody(req, res, 'password', 'password');
    if (!check) {
        logger.log("Request cancelled because of an invalid param");
        return;
    }

    users_dao.login(req.body.email, req.body.password, (err2, res2) => {
        if (err2) {
            logger.log("Error in login:", err2);
            return res.status(400).send({"success": false, "error": err2});
        }
        logger.log("User logged in with token", res2);

        switch (res2.isAdmin) {
          case 0:
            //User is guest
              res.redirect("login")
            break;
          case 1:
            //User is employee
              res.redirect("admin")
            break;
          case 2:
            //User is admin
            res.redirect("admin")
            break;
        }

        return res.status(201).send({"success": true, "token": res2.token, "user_id": res2.user_id, "isAdmin": res2.isAdmin});
    })
};

const mysql = require("mysql");
const database = require("../../dao/database");

exports.view = (req, res) => {
  // User the connection
  database.con.query("SELECT * FROM User", (err, rows) => {
    if (!err) {
      res.render("login", { layout: false, rows });
    } else {
      console.log(err);
    }
    console.log("The data from user table: \n", rows);
  });
};
