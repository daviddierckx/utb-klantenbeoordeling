const database = require("./database");
const logger = require("tracer").console()

/*
Add form Format - http://localhost:3000/api/manage/form:
{
  "name": "utb-feedback-1",
  "title": "UTB Klantenfeedback",
  "subtitle": "Formulier klanttevredenheid UTB",
  "pages": [
    [
      {
        "type": "date",
        "label": "Datum",
        "isRequired": true
      },
      {
        "type": "small_text",
        "label": "Bedrijfsnaam",
        "isRequired": true
      },
      {
        "type": "small_text",
        "label": "Naam klant",
        "isRequired": true
      },
      {
        "type": "radio",
        "label": "Product groep",
        "options": ["Brandstoffen & Specials", "Smeermiddelen"],
        "isRequired": true
      }
    ],
    [
      {
        "type": "rating",
        "label": "Bereikbaarheid UTB?",
        "isRequired": true
      },
      {
        "type": "rating",
        "label": "Bezoekfrequentie UTB vertegenwoordiger?",
        "isRequired": true
      },
      {
        "type": "rating",
        "label": "Tevredenheid over de mogelijkheden en de wijze van bestellen?",
        "isRequired": true
      },
      {
        "type": "rating",
        "label": "Tevredenheid mbt de levertijden?",
        "isRequired": true
      }
    ],
    [
      {
        "type": "rating",
        "label": "Tevredenheid mbt de administratieve afhandeling?",
        "isRequired": true
      },
      {
        "type": "rating",
        "label": "Tevredenheid mbt de klachtenafhandeling?",
        "isRequired": true
      },
      {
        "type": "rating",
        "label": "Eindoordeel UTB organisatie ?",
        "isRequired": true
      }
    ],
    [
      {
        "type": "big_text",
        "label": "Overige opmerkingen",
        "isRequired": true
      }
    ],
    [
      {
        "type": "radio",
        "label": "Hoe staat u tegenover bestelen in de UTB webshop?",
        "options": ["Positief", "Neutraal", "Negatief"],
        "isRequired": true
      },
      {
        "type": "radio",
        "label": "Hoe waardeert u UTB ten opzichte van andere merken?",
        "options": ["Positief", "Neutraal", "Negatief"],
        "isRequired": true
      }
    ]
  ]
}



Add Answers format - http://localhost:3000/api/form/hatsaaa3:
{
    "answers": [
        {
            "questionId": 176,
            "answer": "bla bla bla"
        },
        {
            "questionId": 177,
            "answer": "asdfsadfasdfla"
        },
        {
            "questionId": 178,
            "answer": "Brandstoffen & specials"
        }
    ]
}
*/

exports.addFormAnswer = function (formName, answerData, callback) {
  database.con.query('SELECT * FROM Form WHERE name LIKE ?', [formName], function (error, results, fields) {
    if (error) return callback(error.sqlMessage, undefined);
    if (results.length === 0) {
      return callback("form-not-found", undefined);
    }
    const formId = results[0]['id'];

    database.con.query('SELECT MAX(entryId) as entryId FROM Answer WHERE formId LIKE ?', [formId], function (error, results, fields) {
      if (error) return callback(error.sqlMessage, undefined);
      if (results.length === 0) {
        return callback("form-not-found", undefined);
      }
      const entryId = results[0]['entryId'] + 1;
      const promises = [];
      // Insert all pages into the database
      for (const answer of answerData) {
        promises.push(addFormAnswer(formId, entryId, answer.questionId, answer.answer));
      }

      Promise.all(promises).then((pageRowResults) => {
        logger.log("Inserted answerId's:", JSON.stringify(pageRowResults))
        callback(undefined, entryId);

      }).catch((err) => {
        logger.log("Error while adding options to form:", err)
        callback(err, undefined);
      });
    });
  });
}

exports.getAllFormAnswers = function (formName, callback) {
  database.con.query('SELECT * FROM Form WHERE name LIKE ?', [formName], function (error, results, fields) {
    if (error) return callback(error.sqlMessage, undefined);
    if (results.length === 0) {
      return callback("form-not-found", undefined);
    }
    const formId = results[0]['id'];

    database.con.query('SELECT * FROM Answer WHERE formId LIKE ?', [formId], function (error, results, fields) {
      if (error) return callback(error.sqlMessage, undefined);
      if (results.length === 0) {
        return callback("form-not-found", undefined);
      }
      const answerData = {};
      for (const answer of results) {
        if (answerData[answer.entryId] === undefined) {
          answerData[answer.entryId] = {};
        }
        answerData[answer.entryId][answer.questionId] = {
          label: answer.questionLabel,
          answer: answer.answer,
        }
      }
      callback(undefined, answerData);
    });
  });
}

exports.getAllForms = function (callback) {
  database.con.query('SELECT name FROM Form', [], function (error, results, fields) {
    if (error) return callback(error.sqlMessage, undefined);
    if (results.length === 0) return callback("no-forms-found", undefined);

    const promises = [];
    for (const result of results) {
      promises.push(
        new Promise((resolve, reject) => {
          exports.getForm(result['name'], (err, res) => {
            if (err) return reject(err);
            resolve(res);
          });
        })
      );
    }

    Promise.all(promises).then((formsData) => {
      callback(undefined, formsData);
    }).catch((err) => {
      logger.log("Error while retrieving all forms:", err)
      callback(err, undefined);
    });
  })
}

//get answers from one entry
exports.getFormResult = function (formName, entryId, callback) {
  database.con.query('SELECT * FROM Form WHERE name LIKE ?', [formName], function (error, results, fields) {
    if (error) return callback(error.sqlMessage, undefined);
    if (results.length === 0) {
      return callback("form-not-found", undefined);
    }
    const formId = results[0]['id'];

    database.con.query('SELECT * FROM Answer WHERE formId LIKE ? AND entryId LIKE ?', [formId, entryId], function (error, results, fields) {
      if (error) return callback(error.sqlMessage, undefined);
      if (results.length === 0) {
        return callback("form-not-found", undefined);
      }
      const answerData = {};
      for (const answer of results) {
        if (answerData[answer.entryId] === undefined) {
          answerData[answer.entryId] = {};
        }
        answerData[answer.entryId][answer.questionId] = {
          label: answer.questionLabel,
          answer: answer.answer,
        }
      }
      return callback(undefined, answerData);
    });
  });
}

// Get form
exports.getForm = function (formName, callback) {
  database.con.query('SELECT * FROM Form WHERE name LIKE ?', [formName], function (error, results, fields) {
    if (error) return callback(error.sqlMessage, undefined);
    if (results.length === 0) {
      return callback("form-not-found", undefined);
    }
    const formId = results[0]['id'];
    const formData = {
      'id': formId,
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
              if (questionOptions[0] && question.id === questionOptions[0].questionId) {
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

exports.updateForm = function (formName, formData, callback) {
  database.con.query('SELECT * FROM Form WHERE name LIKE ?', [formName], function (error, results, fields) {
    if (error) return callback(error.sqlMessage, undefined);
    if (results.length === 0) {
      return callback("form-not-found", undefined);
    }
    const formId = results[0]['id'];

    database.con.query('UPDATE `Form` SET `name` = ?, `title` = ?, `subtitle` = ? WHERE id = ?',
      [formData.name, formData.title, formData.subtitle, formId], function (error, results, fields) {
        if (error) return callback(error.sqlMessage, undefined);
        const questionPromisses = [];
        for (const [pageIndex, page] of Object.entries(formData.pages)) {
          for (const [questionIndex, pageRow] of Object.entries(page)) {
            if (pageRow.id) {
              questionPromisses.push(updateFormQuestion(pageRow.id, formId, pageIndex, questionIndex, pageRow.type, pageRow.label, pageRow.isRequired ?? true, pageRow));
            } else {
              questionPromisses.push(addQuestionToForm(formId, pageIndex, questionIndex, pageRow.type, pageRow.label, pageRow.isRequired ?? true, pageRow));
            }
          }
        }

        if (questionPromisses.length === 0) {
          return callback(undefined, formData);
        }
        Promise.all(questionPromisses).then((questionOptionsData) => {
          return callback(undefined, formId);
        }).catch((err) => {
          logger.log("Error while requestion question options:", err)
          callback(err, undefined);
        });


      }
    );


  });
}

function updateFormQuestion(questionId, formId, pageIndex, questionIndex, questionType, questionLabel, isRequired, source) {
  logger.log("updating question:", formId, pageIndex, questionIndex, questionType, questionLabel, isRequired)
  return new Promise((resolve, reject) => {
    database.con.query('UPDATE `Question` SET `formId` = ?, `pageIndex` = ?, `questionIndex` = ?, `questionType` = ?, `questionTitle` = ?, `isRequired` = ? WHERE id = ?',
      [formId, pageIndex, questionIndex, questionType, questionLabel, isRequired, questionId], function (error, results, fields) {
        if (error) return reject(error.sqlMessage);
        if (results.affectedRows === 0) return reject("no-rows-affected");
        resolve({insertId: results.insertId, source: source})
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

// Add Answer
function addFormAnswer(formId, entryId, questionId, answer) {
  logger.log("Add answer to form:", formId, entryId, questionId, answer)
  return new Promise((resolve, reject) => {
    database.con.query("INSERT INTO `Answer` (`formId`, `entryId`, `questionId`, `questionLabel`, `answer`) VALUES (?,?,?,(SELECT questionTitle FROM Question WHERE id = ? LIMIT 1),?)",
      [formId, entryId, questionId, questionId, answer], function (error, results, fields) {
        if (error) return reject(error.sqlMessage);
        if (results.affectedRows === 0) return reject("no-rows-affected");
        resolve(results.insertId)
      });
  });
}
