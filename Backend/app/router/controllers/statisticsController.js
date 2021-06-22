const logger = require("tracer").console();
const statistics_dao = require("../../dao/statisticsDao");

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

      res.render("statistics", {
        results,
        layout: false
      });
    });
  }
};
