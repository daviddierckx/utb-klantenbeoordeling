const logger = require("tracer").console();
const statistics_dao = require("../../dao/statisticsDao");

const lastYear = new Date().getFullYear() - 1;
let averages;
let averagesYear;
let countButtons;
let countButtonsYear;

module.exports = {
  allData: (req, res) => {
    const errorHandler = () => {
      res.render("statistics", {
        alert: "Oeps, er is iets misgegaan",
        layout: false
      });
      return res.status(500);
    };

    statistics_dao.getAveragesFromRating((err, results) => {
      if (err) {
        logger.log("Error when getting data:", err);
        return errorHandler();
      }
      averages = results;
    });

    statistics_dao.getAverageRatingsFromSpecificYear(lastYear, (err, results) => {
      if (err) {
        logger.log("Error when getting data:", err);
        return errorHandler();
      }
      averagesYear = results;
    });

    statistics_dao.getCountOfRadioButtons((err, results) => {
      if (err) {
        logger.log("Error when getting data:", err);
        return errorHandler();
      }
      countButtons = results;
    });

    statistics_dao.getCountOfRadioButtonsFromSpecificYear(lastYear, (err, results) => {
      if (err) {
        logger.log("Error when getting data:", err);
        return errorHandler();
      }
      countButtonsYear = results;
    });

    // logger.log(averagesYear);

    res.render("statistics", {
      averages,
      averagesYear,
      countButtons,
      countButtonsYear,
      layout: false
    });
  }
};
