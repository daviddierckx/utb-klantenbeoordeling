const logger = require('tracer').console()
const mysql = require('mysql');
const config = require('./../config');


function reconnectToDatabase() {
    exports.con = mysql.createConnection({
        host: config.database.address,
        user: config.database.username,
        password: config.database.password,
        database: config.database.database
    });

    exports.con.connect(function (err) {
        if (err) {
            logger.error("Error while connection to database, retry in 2000ms:", err)
            setTimeout(reconnectToDatabase, 2000);
        }
        logger.log("Database connected with id:", exports.con.threadId);
    });

    exports.con.on('error', function(err) {
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            reconnectToDatabase();
        } else {
            logger.error("Error with database connection:", err)
            throw err;
        }
    });
}

reconnectToDatabase();