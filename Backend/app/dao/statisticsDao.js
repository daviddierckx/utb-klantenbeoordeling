const database = require('./database')
const logger = require('tracer').console()

// maar twee radiobutton vragen
// Hoe staat u tegenover het bestellen in de UTB webshop?
// Hoe waardeert u UTB ten opzichte van andere merken?

module.exports = {
    // placeholder
    // callback to controller
    // controller returns data to frontend
    // callback(err, undefined)
    // callback(undefined, result)
    getAveragesFromRating(callback) {
        const query = {
            // sql: "SELECT Q.questionTitle, AVG(A.answer) FROM Question AS Q JOIN Answer AS A ON A.questionId = Q.id WHERE Q.questionType = 'rating' GROUP BY Q.id;",
            sql: `SELECT Q.questionTitle, AVG(A.answer)
                  FROM Question AS Q
                    JOIN Answer AS A ON A.questionId = Q.id
                  WHERE Q.questionType = 'rating'
                  GROUP BY Q.id;`,
            timeout: 3000
        }
        database.con.query(query, (err, results) => {
            if (result.length == 0) {
                logger.log("No data")
                callback("No data", undefined)
            } else if (err) {
                logger.log("An error occured")
                callback(err, undefined)
            }
            callback(undefined, results)
        })
    },

    getCountOfRadioButtons(callback) {
        const query = {
            // sql: "SELECT Q.questionTitle, (SELECT COUNT(A.answer) FROM Answer AS A WHERE A.answer = 'positief') AS AantalPositief, (SELECT COUNT(A.answer) FROM Answer AS A WHERE A.answer = 'neutraal') AS AantalNeutraal, (SELECT COUNT(A.answer) FROM Answer AS A WHERE A.answer = 'negatief') AS AantalNegatief FROM Question AS Q JOIN Answer AS A ON A.questionId = Q.id WHERE Q.questionType = 'radio' AND Q.questionTitle <> 'Product groep' GROUP BY Q.id;",
            sql: `SELECT Q.questionTitle

                  ,      sum(CASE
                            when A.answer = 'positief' then 1
                            else 0
                         end)                                                      as AantalPositief
                  /*,     (SELECT COUNT(A.answer) FROM Answer AS A WHERE A.answer = 'positief' and A.questionId = Q.id ) AS AantalPositief_old  */
                  ,      sum(CASE
                            when A.answer = 'neutraal' then 1
                            else 0
                         end)                                                      as AantalNeutraal
                  /* ,     (SELECT COUNT(A.answer) FROM Answer AS A WHERE A.answer = 'neutraal' and A.questionId = Q.id ) AS AantalNeutraal_old */
                  ,      sum(CASE
                            when A.answer = 'negatief' then 1
                            else 0
                         end)                                                      as AantalNegatief
                  /*,     (SELECT COUNT(A.answer) FROM Answer AS A WHERE A.answer = 'negatief' and A.questionId = Q.id ) AS Old_AantalNegatief */
                  FROM   Question AS Q JOIN Answer AS A ON A.questionId = Q.id
                  WHERE  Q.questionType = 'radio'
                  AND    Q.questionTitle <> 'Product groep'
                  GROUP  BY Q.id;`,
            timeout: 3000
        }
        database.con.query(query, (err, results) => {
            if (result.length == 0) {
                logger.log("No data")
                callback("No data", undefined)
            } else if (err) {
                logger.log("An error occured")
                callback(err, undefined)
            }
            callback(undefined, results)
        })
    },

    // nog aan te passen
    getRemarks(callback) {
        const query = {
            sql: `SELECT *
                  FROM Question
                    JOIN Answer ON Answer.questionId = Question.id
                  WHERE questionType = 'remarks'`,
            timeout: 3000
        }
        database.con.query(query, (err, results) => {
            if (result.length == 0) {
                logger.log("No data")
                callback("No data", undefined)
            } else if (err) {
                logger.log("An error occured")
                callback(err, undefined)
            }
            callback(undefined, results)
        })
    }
}
