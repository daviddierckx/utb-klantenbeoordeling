const logger = require('tracer').console()
const statistics_dao = require('../../dao/statisticsDao')

module.exports = {
    getAverageRatings = function(req, res) {
        statistics_dao.getAveragesFromRating((err, res) => {
            if (err) {
                logger.log("Error getting average ratings:", err)
                return res.status(400).send({
                    success: false,
                    error: err
                })
            }
            logger.log("Got average ratings", JSON.stringify(res))
            return res.status(200).send({
                success: true,
                data: res
            })
        })
    }
}
