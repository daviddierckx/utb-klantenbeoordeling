const request_utils = require("./../../utils/requestUtils");
const forms_dao = require("../../dao/formsDao");
const logger = require("tracer").console();
const database = require("../../dao/database");

exports.search = function (req, res, callback) {
  const formName = req.params.formName;

  database.con.query(
    "SELECT * FROM Form WHERE name LIKE ?",
    [formName],
    function (error, results, fields) {
      if (error) return callback(error.sqlMessage, undefined);
      if (results.length === 0) {
        return callback("form-not-found", undefined);
      }
      const formId = results[0]["id"];

      const searchTerm = req.body.search;
      const query = {
        sql: `SELECT *
              FROM Answer
              WHERE Answer.questionLabel = 'Bedrijfsnaam'
	              AND Answer.answer LIKE ?
                AND Answer.formId LIKE ?;`,
        values: ["%" + searchTerm + "%", formId],
        timeout: 3000,
      };
      database.con.query(query, (err, rows) => {
        if (!err) {
          res.render("beoordelingsoverzicht", { rows });
        } else {
          logger.log("The search data from answer table: \n", rows);
        }
      });
    }
  );
};

exports.view = (req, res) => {
  forms_dao.getForm("utb-feedback-1", (err2, res2) => {
    if (err2) {
      logger.log("Error in receiving form:", err2);
      return res.status(400).send({ success: false, error: err2 });
    }
    logger.log("Got form data", JSON.stringify(res2));
    res.render("beoordelingsformulier", { layout: false, data: res2 });
  });
};

exports.selectForm = (req, res) => {
  forms_dao.getAllForms((err2, res2) => {
    if (err2) {
      logger.log("Error in receiving all forms:", err2);
      return res.status(400).send({ success: false, error: err2 });
    }
    logger.log("Got all forms", JSON.stringify(res2));
    res.render("selectform", { layout: false, data: res2 });
  });
};

exports.selectFormAdmin = (req, res) => {
  forms_dao.getAllForms((err2, res2) => {
    if (err2) {
      logger.log("Error in receiving all forms:", err2);
      return res.status(400).send({ success: false, error: err2 });
    }
    logger.log("Got all forms", JSON.stringify(res2));
    res.render("selectformAdmin", { layout: false, data: res2 });
  });
};

exports.viewSingle = (req, res) => {
  forms_dao.getFormResult(
    req.params.formName,
    req.params.entryId,
    (err2, res2) => {
      if (err2) {
        logger.log("Error in receiving form:", err2);
        return res.status(400).send({ success: false, error: err2 });
      }
      logger.log("Got form data", JSON.stringify(res2));
      res.render("beoordelingsdetail", { data: res2 });
    }
  );
};

exports.viewFormAnswers = (req, res) => {
  logger.log("Received request to add a form answers");
  let check = request_utils.verifyParam(req, res, "formName", "string");
  if (!check) {
    logger.log("Request cancelled because of an invalid param");
    return;
  }

  forms_dao.getForm(req.params.formName, (err2, res2) => {
    if (err2) {
      logger.log("Error in receiving form:", err2);
      return res.status(400).send({ success: false, error: err2 });
    }
    logger.log("Got form data", JSON.stringify(res2));

    //Add answers to res2
    forms_dao.getAllFormAnswers(req.params.formName, (err3, res3) => {
      if (err3) {
        logger.log("Error in receiving answers:", err3);
        return res.status(400).send({ success: false, error: err3 });
      }
      logger.log("Got form answers", JSON.stringify(res3));
      res2.pages = [res2.pages[0]];
      let res3Rebuild = {};
      for (const [key, val] of Object.entries(res3)) {
        res3Rebuild[key] = {};
        res2.pages[0].forEach((question) => {
          res3Rebuild[key][question.id] = val[question.id];
        });
      }
      res.render("beoordelingsoverzicht", {
        formName: req.params.formName,
        formData: res2,
        data2: res3Rebuild,
      });
    });
  });
};

exports.viewForm = (req, res) => {
  logger.log("Received request to view a form");
  let check = request_utils.verifyParam(req, res, "formName", "string");
  if (!check) {
    logger.log("Request cancelled because of an invalid param");
    return;
  }

  forms_dao.getForm(req.params.formName, (err2, res2) => {
    if (err2) {
      logger.log("Error in receiving form:", err2);
      return res.status(400).send({ success: false, error: err2 });
    }
    logger.log("Got form data", JSON.stringify(res2));
    res.render("beoordelingsformulier", { layout: false, data: res2 });
  });
};

exports.submit = function (req, res) {
  logger.log("Received submission, redirecting...");
  res.render("succes", { layout: false });
};

exports.submitForm = function (req, res) {
  logger.log("Received request to add a form answers");
  let check = request_utils.verifyParam(req, res, "formName", "string");
  if (typeof req.body.answers === "string") {
    req.body.answers = JSON.parse(req.body.answers);
  }
  check = check && request_utils.verifyBody(req, res, "answers", "object");
  if (!check) {
    logger.log("Request cancelled because of an invalid param");
    return;
  }

  forms_dao.addFormAnswer(
    req.params.formName,
    req.body.answers,
    (err2, res2) => {
      if (err2) {
        logger.log("Error in adding form answers:", err2);
        return res.status(400).send({ success: false, error: err2 });
      }
      logger.log("Got adding form answer data", JSON.stringify(res2));
      res.render("succes", { layout: false });
    }
  );
};

exports.updateForm = function (req, res) {
  logger.log("Received request to update a form");
  let check = request_utils.verifyParam(req, res, "formName", "string");
  if (typeof req.body.data === "string") {
    req.body.data = JSON.parse(req.body.data);
  }
  check = check && request_utils.verifyBody(req, res, "data", "object");
  if (!check) {
    logger.log("Request cancelled because of an invalid param");
    return;
  }

  forms_dao.updateForm(req.params.formName, req.body.data, (err2, res2) => {
    if (err2) {
      logger.log("Error in updating form:", err2);
      return res.status(400).send({ success: false, error: err2 });
    }
    logger.log("Form updated with formId", res2);
    res.redirect("/admin/forms");
    return res
      .status(201)
      .send({ success: true, id: res2, name: req.body.name });
  });
};

exports.createForm = function (req, res) {
  logger.log("Received request to create a form");
  if (typeof req.body.data === "string") {
    req.body.data = JSON.parse(req.body.data);
  }
  let check = request_utils.verifyBody(req, res, "data", "object");
  if (!check) {
    logger.log("Request cancelled because of an invalid param");
    return;
  }

  forms_dao.createForm(req.body.data, (err2, res2) => {
    if (err2) {
      logger.log("Error in creating form:", err2);
      return res.status(400).send({ success: false, error: err2 });
    }
    logger.log("Form created with formId", res2);
    res.redirect("/admin/forms");
    return res
      .status(201)
      .send({ success: true, id: res2, name: req.body.name });
  });
};

exports.manageGetForms = function (req, res) {
  forms_dao.getAllForms((err2, res2) => {
    if (err2) {
      logger.log("Error in receiving form:", err2);
      return res.status(400).send({ success: false, error: err2 });
    }
    logger.log("Got all forms data", JSON.stringify(res2));
    res.render("manageForms", { layout: false, data: res2 });
  });
};
