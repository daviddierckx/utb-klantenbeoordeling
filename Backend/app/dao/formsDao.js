const database = require("./database");
const logger = require('tracer').console()

/*
Form Format:
{
    name: "", // Display name for admins
    title: "UTB Feedback",
    subtitle: "Geef hier uw feedback over onze service",
    pages: [
        [ // Rows
            [ // Object
                type: "small_text",
                label: "Naam bedrijf'
            ],
            [
                type: "small_text",
                label: "Naam klant'
            ],
            [
                type: "radio",
                label: "Product groep',
                options: ["Brandstoffen & specials", "Smeermiddelen"]
            ],
        ],
        [
            [
                type: "radio",
                label: "Hoe staat u tegenover bestelen in de UTB webshop?',
                options: ["Positief", "Neutraal", "Negatief"]
            ],
            [
                type: "radio",
                label: "Waardering UTB/UNIL tov andere merken?',
                options: ["Onderscheidend", "Gelijk", "Minder"]
            ],
        ],
        [
            [
                type: "rating",
                label: "Bereikbaarheid UTB?'
            ],
            [
                type: "rating",
                label: "Bezoekfrequentie van de UTB vertenwoordiger?'
            ],
            [
                type: "rating",
                label: "Tevredenheid over de mogelijkheden en de wijze van bestellen?'
            ],
            [
                type: "rating",
                label: "Tevredenheid mbt de levertijden?'
            ],
            [
                type: "rating",
                label: "Tevredenheid mbt de administratieve afhandeling?'
            ],
            [
                type: "rating",
                label: "Tevredenheid mbt de klachtenafhandeling?'
            ],
            [
                type: "rating",
                label: "Eindoordeel UTB organisatie?'
            ],
            [
                type: "big_text",
                label: "Opmerkingen?'
            ],
        ]
    ]
}
*/

exports.createForm = function (formData, callback) {
    database.con.query('INSERT INTO `Form` (`name`, `title`, `subtitle`) VALUES (?,?,?)',
        [formData.name, formData.title, formData.subtitle], function (error, results, fields) {
            if (error) return callback(error.sqlMessage, undefined);
            if (results.affectedRows === 0) return callback("no-rows-affected", undefined);
            const formId = results.insertId;
            const promises = [];
            for (const page of formData.pages) {
                for (const pageRow of page) {
                    promises.push(addQuestionToForm(formId, pageRow.type, pageRow.label, pageRow.isRequired ?? false, pageRow));
                }
            }

            Promise.all(promises).then((pageRowResults) => {
                logger.log("Created pages:", pageRowResults)
                const pageRowPromises = [];
                pageRowResults.forEach((pageRowResult) => {
                    if (pageRowResult.source.type === "radio") {
                        for (const radioOptions of pageRowResult.source.options) {
                            pageRowPromises.push(addOptionToQuestion(pageRowResult.insertId, radioOptions));
                        }
                    }
                })
                if(pageRowPromises.length === 0){
                    return callback(undefined, formId);
                }
                Promise.all(pageRowPromises).then((pageOptionsPromises) => {
                    logger.log("Add page options pages:", pageRowResults)
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

function addQuestionToForm(formId, questionType, questionLabel, isRequired, source) {
    return new Promise((resolve, reject) => {
        database.con.query('INSERT INTO `Question` (`formId`, `questionType`, `questionTitle`, `isRequired`) VALUES (?,?,?,?)',
            [formId, questionType, questionLabel, isRequired], function (error, results, fields) {
                if (error) return null;
                if (results.affectedRows === 0) return reject("no-rows-affected");
                resolve({insertId: results.insertId, source: source})
            });
    });
}

function addOptionToQuestion(questionId, value) {
    return new Promise((resolve, reject) => {
        database.con.query('INSERT INTO `QuestionOptions` (`QuestionID`, `Value`) VALUES (?,?)',
            [questionId, value], function (error, results, fields) {
                if (error) return null;
                if (results.affectedRows === 0) return reject("no-rows-affected");
                resolve({insertId: results.insertId})
            });
    });
}
