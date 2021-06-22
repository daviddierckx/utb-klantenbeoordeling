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
      sql: `SELECT Q.questionTitle, ROUND(AVG(A.answer), 2) AS 'Averages'
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
      sql: `SELECT Q.questionTitle, ROUND(AVG(A.answer), 2) AS 'Averages'
            FROM Question AS Q
            JOIN Answer AS A ON A.questionId = Q.id
            WHERE A.entryId IN (
            	SELECT An.entryId
            	FROM Answer AS An
                JOIN Question AS Qu ON An.questionId = Qu.id
            	WHERE Qu.questionType = "date"
            	AND YEAR(An.answer) = ?
            	GROUP BY An.entryId
            )
            AND Q.questionType = "rating"
            GROUP BY A.questionId;`,
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
                  ,      sum(CASE
                            when A.answer = 'neutraal' then 1
                            else 0
                         end)                                                      as 'AmountNeutral'
                  ,      sum(CASE
                            when A.answer = 'negatief' then 1
                            else 0
                         end)                                                      as 'AmountNegative'
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
            ,      sum(CASE
                      when A.answer = 'neutraal' then 1
                      else 0
                  end)                                                      as 'AmountNeutral'
            ,      sum(CASE
                      when A.answer = 'negatief' then 1
                      else 0
                   end)                                                      as 'AmountNegative'
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
