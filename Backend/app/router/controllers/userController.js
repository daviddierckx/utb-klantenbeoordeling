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
    res.render("add-user", {
      alert: "Kan gebruiker niet toevoegen (vul alle velden met geldige data)",
      layout: false,
    });
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
      if (err2) {
        logger.log("Error in register:", err2);
        res.render("add-user", {
          alert: "Kan gebruiker niet toevoegen (e-mailadres al in gebruik) ",
          layout: false,
        });
        return res.status(400);
      }

      res.render("add-user", {
        alert: "Gebruiker succesvol toegevoegd",
        layout: false,
      });

      return res.status(201);
    }
  );
};

exports.login = function (req, res) {
  logger.log("Received request to log user in");
  const errorHandler = () => {
    res.render("login", {
      alert: "Oops, something wasn't right",
      layout: false,
    });
    return res.status(400);
  }
  let check = request_utils.verifyBody(req, res, "email", "email", errorHandler);
  check = check && request_utils.verifyBody(req, res, "password", "password", errorHandler);
  if (!check) {
    logger.log("Request cancelled because of an invalid param");
    return;
  }

  users_dao.login(req.body.email, req.body.password, (err2, res2) => {
    if (err2) {
      logger.log("Error in login:", err2);
      return errorHandler();
    }
    logger.log("User logged in with token", res2);

    switch (res2.isAdmin) {
      case 0:
        //User is guest
        res.redirect("beoordelingsformulier");
        console.log("beoordeling");
        break;
      case 1:
        //User is employee
        res.redirect("admin");
        break;
      case 2:
        //User is admin
        res.redirect("admin");
        break;
    }

    return res.status(201);
  });
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
  });
};

exports.update = function (req, res) {
  logger.log("Received request to update user");
  let check = request_utils.verifyBody(req, res, "name", "string");
  check = check && request_utils.verifyBody(req, res, "isAdmin", "int");
  check = check && request_utils.verifyBody(req, res, "email", "email");
  if (!check) {
    logger.log("Request cancelled because of an invalid param");
    return;
  }

  users_dao.update(
    {
      name: req.body.name,
      isAdmin: req.body.isAdmin,
      email: req.body.email,
      id: req.params.id
    },
    (err2, res2) => {
      if (err2) {
        logger.log("Error in register:", err2);
        return res.status(400).send({ success: false, error: err2 });
      }

      res.redirect("/admin");

      return res.status(201);
    }
  );
};
