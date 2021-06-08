const database = require("./database");
const logger = require("tracer").console()

/*
Form Format:
{
    "name": "hatsaaa2",
    "title": "UTB Feedback2",
    "subtitle": "Formulier klanttevredenheid UTB voor ISO 9001",
    "pages": [
        [
            {
                "type": "small_text",
                "label": "Naam bedrijf"
            },
            {
                "type": "small_text",
                "label": "Naam klant"
            },
            {
                "type": "radio",
                "label": "Product groep",
                "options": ["Brandstoffen & specials", "Smeermiddelen"]
            }
        ],
        [
            {
                "type": "radio",
                "label": "Hoe staat u tegenover bestelen in de UTB webshop?",
                "options": ["Positief", "Neutraal", "Negatief"]
            },
            {
                "type": "radio",
                "label": "Waardering UTB/UNIL tov andere merken?",
                "options": ["Onderscheidend", "Gelijk", "Minder"]
            }
        ],
        [
            {
                "type": "rating",
                "label": "Bereikbaarheid UTB?"
            },
            {
                "type": "rating",
                "label": "Bezoekfrequentie van de UTB vertenwoordiger?"
            },
            {
                "type": "rating",
                "label": "Tevredenheid over de mogelijkheden en de wijze van bestellen?"
            },
            {
                "type": "rating",
                "label": "Tevredenheid mbt de levertijden?"
            },
            {
                "type": "rating",
                "label": "Tevredenheid mbt de administratieve afhandeling?"
            },
            {
                "type": "rating",
                "label": "Tevredenheid mbt de klachtenafhandeling?"
            },
            {
                "type": "rating",
                "label": "Eindoordeel UTB organisatie?"
            },
            {
                "type": "big_text",
                "label": "Opmerkingen?"
            }
        ]
    ]
}
*/

// Get main form
exports.getForm = function (formName, callback) {
  database.con.query('SELECT * FROM Form WHERE name LIKE ?', [formName], function (error, results, fields) {
    if (error) return callback(error.sqlMessage, undefined);
    if (results.length === 0) {
      return callback("form-not-found", undefined);
    }
    const formId = results[0]['id'];
    const formData = {
      'name': results[0]['name'],
      'title': results[0]['title'],
      'subtitle': results[0]['subtitle'],
      'pages': []
    };

    // Get all the questions from the database
    database.con.query('SELECT * FROM Question WHERE formId = ?', [formId], function (error, results, fields) {
      if (error) return callback(error.sqlMessage, undefined);
      if (results.length === 0) {
        return callback("questions-not-found", undefined);
      }
      const promises = [];
      for (const question of results) {
        if (formData.pages[question.pageIndex] === undefined) {
          formData.pages[question.pageIndex] = [];
        }
        formData.pages[question.pageIndex][question.questionIndex] = {
          "id": question.id,
          "type": question.questionType,
          "label": question.questionTitle,
          "isRequired": !!question.isRequired,
        }

        // If question is type radio request radio button values
        if (question.questionType === "radio") {
          promises.push(getFormQuestion(question.id));
        }
      }

      // If no radiobutton-values are selected return, else requestion radiobutton-values
      if (promises.length === 0) {
        return callback(undefined, formData);
      }
      Promise.all(promises).then((questionOptionsData) => {
        // Find the correct question which belongs to the radiobutton values
        for (const questionOptions of questionOptionsData) {
          for (const page of formData.pages) {
            for (const question of page) {
              if (question.id === questionOptions[0].questionId) {
                if (question.options === undefined) {
                  question.options = [];
                }
                for (const option of questionOptions) {
                  question.options.push(option.value);
                }
              }
            }
          }
        }
        // Return the generated formData
        return callback(undefined, formData);
      }).catch((err) => {
        logger.log("Error while requestion question options:", err)
        callback(err, undefined);
      });
    });
  });
}

// Insert form
exports.createForm = function (formData, callback) {
  database.con.query("INSERT INTO `Form` (`name`, `title`, `subtitle`) VALUES (?,?,?)",
    [formData.name, formData.title, formData.subtitle], function (error, results, fields) {
      if (error) return callback(error.sqlMessage, undefined);
      if (results.affectedRows === 0) return callback("no-rows-affected", undefined);
      const formId = results.insertId;
      const promises = [];
      // Insert all pages into the database
      for (const [pageIndex, page] of Object.entries(formData.pages)) {
        for (const [questionIndex, pageRow] of Object.entries(page)) {
          promises.push(addQuestionToForm(formId, pageIndex, questionIndex, pageRow.type, pageRow.label, pageRow.isRequired ?? true, pageRow));
        }
      }

      Promise.all(promises).then((pageRowResults) => {
        logger.log("Created pages:", JSON.stringify(pageRowResults))
        const pageRowPromises = [];
        // For each created question insert radiobutton values
        pageRowResults.forEach((pageRowResult) => {
          if (pageRowResult.source.type === "radio") {
            for (const radioOptions of pageRowResult.source.options) {
              pageRowPromises.push(addOptionToQuestion(pageRowResult.insertId, radioOptions));
            }
          }
        })

        // If no radiobutton-values are given return, else execute insertion promises
        if (pageRowPromises.length === 0) {
          return callback(undefined, formId);
        }
        Promise.all(pageRowPromises).then((pageOptionsPromises) => {
          logger.log("Add page options pages:", JSON.stringify(pageRowResults))
          // Return inserted formId
          return callback(undefined, formId);
        }).catch((err) => {
          logger.log("Error while adding options to form:", err)
          callback(err, undefined);
        });
      }).catch((err) => {
        logger.log("Error while creating form:", err)
        callback(err, undefined);
      });
    });
}

// Insert question into the database
function addQuestionToForm(formId, pageIndex, questionIndex, questionType, questionLabel, isRequired, source) {
  logger.log("Adding question:", formId, pageIndex, questionIndex, questionType, questionLabel, isRequired)
  return new Promise((resolve, reject) => {
    database.con.query("INSERT INTO `Question` (`formId`, `pageIndex`, `questionIndex`, `questionType`, `questionTitle`, `isRequired`) VALUES (?,?,?,?,?,?)",
      [formId, pageIndex, questionIndex, questionType, questionLabel, isRequired], function (error, results, fields) {
        if (error) return reject(error.sqlMessage);
        if (results.affectedRows === 0) return reject("no-rows-affected");
        resolve({insertId: results.insertId, source: source})
      });
  });
}

// Add radiobutton values to a question
function addOptionToQuestion(questionId, value) {
  logger.log("Adding option:", questionId, value)
  // Insert Radiobutton options into the database
  return new Promise((resolve, reject) => {
    database.con.query("INSERT INTO `QuestionOptions` (`questionId`, `value`) VALUES (?,?)",
      [questionId, value], function (error, results, fields) {
        if (error) return reject(error.sqlMessage);
        if (results.affectedRows === 0) return reject("no-rows-affected");
        resolve(results.insertId)
      });
  });
}

// Request radiobutton values
function getFormQuestion(questionId) {
  logger.log("requesting form questions:", questionId)
  // Insert Radiobutton options into the database
  return new Promise((resolve, reject) => {
    database.con.query("SELECT * FROM `QuestionOptions` WHERE `questionId` = ?",
      [questionId], function (error, results, fields) {
        if (error) return reject(error.sqlMessage);
        resolve(results)
      });
  });
}
