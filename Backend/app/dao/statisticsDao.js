const database = require("./database");
const logger = require("tracer").console();

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
      sql: `SELECT Q.questionTitle, AVG(A.answer) AS 'Averages'
            FROM Question AS Q
              JOIN Answer AS A ON A.questionId = Q.id
            WHERE Q.questionType = 'rating'
            GROUP BY Q.id;`,
      timeout: 3000,
    };
    database.con.query(query, (err, results) => {
      if (results == 0) {
        logger.log("No data");
        callback("No data", undefined);
      } else if (err) {
        logger.log("An error occured");
        callback(err, undefined);
      }
      callback(undefined, results);
    });
  },

  getAverageRatingsFromSpecificYear(year, callback) {
    const query = {
      sql: `SELECT Question.questionTitle, AVG(Answer.answer) AS 'Averages'
            FROM Question
            JOIN Question ON Answer.questionId = Question.id
            WHERE Answer.entryId IN (
            	SELECT Answer.entryId
            	FROM Answer
                JOIN Question ON Answer.questionId = Question.id
            	WHERE Question.questionType = "date"
            	AND YEAR(Answer.answer) = ?
            	GROUP BY Answer.entryId
            )
            AND Question.questionType = "rating"
            GROUP BY Answer.questionId;`,
      values: year,
      timeout: 3000
    };
    database.con.query(query, (err, results) => {
      if (results == 0) {
        logger.log("No data from that year");
        callback("No data from that year", undefined);
      } else if (err) {
        logger.log("An error occured");
        callback(err, undefined);
      }
      callback(undefined, results);
    });
  },

  getCountOfRadioButtons(callback) {
    logger.log("Executing query");
    const query = {
      sql: `SELECT Q.questionTitle

                  ,      sum(CASE
                            when A.answer = 'positief' then 1
                            else 0
                         end)                                                      as 'AmountPositive'
                  /*,     (SELECT COUNT(A.answer) FROM Answer AS A WHERE A.answer = 'positief' and A.questionId = Q.id ) AS AantalPositief_old  */
                  ,      sum(CASE
                            when A.answer = 'neutraal' then 1
                            else 0
                         end)                                                      as 'AmountNeutral'
                  /* ,     (SELECT COUNT(A.answer) FROM Answer AS A WHERE A.answer = 'neutraal' and A.questionId = Q.id ) AS AantalNeutraal_old */
                  ,      sum(CASE
                            when A.answer = 'negatief' then 1
                            else 0
                         end)                                                      as 'AmountNegative'
                  /*,     (SELECT COUNT(A.answer) FROM Answer AS A WHERE A.answer = 'negatief' and A.questionId = Q.id ) AS Old_AantalNegatief */
                  FROM   Question AS Q JOIN Answer AS A ON A.questionId = Q.id
                  WHERE  Q.questionType = 'radio'
                  AND    Q.questionTitle <> 'Product groep'
                  GROUP  BY Q.id;`,
      timeout: 3000,
    };
    database.con.query(query, (err, results) => {
      if (results == 0) {
        logger.log("No data");
        callback("No data", undefined);
      } else if (err) {
        logger.log("An error occured");
        callback(err, undefined);
      }
      logger.log("OK. Returning results");
      // logger.log(results)
      callback(undefined, results);
    });
  },

  getCountOfRadioButtonsFromSpecificYear(year, callback) {
    logger.log("Executing query");
    const query = {
      sql: `SELECT Q.questionTitle

            ,      sum(CASE
                      when A.answer = 'positief' then 1
                      else 0
                   end)                                                      as 'AmountPositive'
            /*,     (SELECT COUNT(A.answer) FROM Answer AS A WHERE A.answer = 'positief' and A.questionId = Q.id ) AS AantalPositief_old  */
            ,      sum(CASE
                      when A.answer = 'neutraal' then 1
                      else 0
                  end)                                                      as 'AmountNeutral'
            /* ,     (SELECT COUNT(A.answer) FROM Answer AS A WHERE A.answer = 'neutraal' and A.questionId = Q.id ) AS AantalNeutraal_old */
            ,      sum(CASE
                      when A.answer = 'negatief' then 1
                      else 0
                   end)                                                      as 'AmountNegative'
            /*,     (SELECT COUNT(A.answer) FROM Answer AS A WHERE A.answer = 'negatief' and A.questionId = Q.id ) AS Old_AantalNegatief */
            FROM   Question AS Q JOIN Answer AS A ON A.questionId = Q.id
            WHERE A.entryId IN (
           	SELECT   Answer.entryId
            	FROM     Answer
                JOIN   Question ON Answer.questionId = Question.id
            	WHERE    Question.questionType = "date"
            	AND      YEAR(Answer.answer) = ?
            	GROUP BY Answer.entryId
            )
            AND    Q.questionType = 'radio'
            AND    Q.questionTitle <> 'Product groep'
            GROUP  BY Q.id;`,
      timeout: 3000,
    };
    database.con.query(query, (err, results) => {
      if (results == 0) {
        logger.log("No data");
        callback("No data", undefined);
      } else if (err) {
        logger.log("An error occured");
        callback(err, undefined);
      }
      logger.log("OK. Returning results");
      // logger.log(results)
      callback(undefined, results);
    });
  },
};
