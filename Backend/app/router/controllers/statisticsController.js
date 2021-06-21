const logger = require("tracer").console();
const statistics_dao = require("../../dao/statisticsDao");

module.exports = {
  allData: (req, res) => {
    statistics_dao.getAveragesFromRating((err, results)) {
      console.log("Hello");
    };
  }
};
