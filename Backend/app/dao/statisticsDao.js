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
    getAveragesFromRating = (callback) => {
        const query = {
            sql: "SELECT Q.questionTitle, AVG(A.answer) FROM Question AS Q JOIN Answer AS A ON A.questionId = Q.id WHERE Q.questionType = 'rating' GROUP BY Q.id;",
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

    getCountOfRadioButtons = (callback) => {
        const query = {
            sql: "SELECT Q.questionTitle, (SELECT COUNT(A.answer) FROM Answer AS A WHERE A.answer = 'positief') AS AantalPositief, (SELECT COUNT(A.answer) FROM Answer AS A WHERE A.answer = 'neutraal') AS AantalNeutraal, (SELECT COUNT(A.answer) FROM Answer AS A WHERE A.answer = 'negatief') AS AantalNegatief FROM Question AS Q JOIN Answer AS A ON A.questionId = Q.id WHERE Q.questionType = 'radio' AND Q.questionTitle <> 'Product groep' GROUP BY Q.id;",
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
