const database = require('./database')
const logger = require('tracer').console()

module.exports = {
    // placeholder
    // callback to controller
    // controller returns data to frontend
    // callback(err, undefined)
    // callback(undefined, result)
    getAveragesFromRating = (callback) => {
        const query = {
            sql: "SELECT Q.questionTitle, AVG(A.answer) FROM Question AS Q JOIN Answer AS A ON A.questionId = Q.id WHERE Q.questionType = 'rating' GROUP BY Q.id",
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
    getRemarks = (callback) => {
        const query = {
            sql: "SELECT * FROM Question JOIN Answer ON Answer.questionId = Question.id WHERE questionType = 'remarks'",
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
