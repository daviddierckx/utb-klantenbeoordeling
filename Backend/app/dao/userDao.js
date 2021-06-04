const database = require("./database");
const config = require("./../config");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

exports.add = function (data, callback) {
  jwt.sign(
    { data: data.email },
    config.auth.secret,
    { expiresIn: "1h" },
    (err, res) => {
      if (err) return callback("error-while-creating-token", undefined);
      const hashed = crypto
        .createHash("sha256")
        .update(data.password)
        .digest("base64");
      database.con.query(
        "INSERT INTO User (`email`, `name`, `password`, `isAdmin`) VALUES (?,?,?,?)",
        [data.email, data.name, hashed, data.isAdmin],
        function (error, results, fields) {
          if (error) return callback(error.sqlMessage, undefined);
          if (results.affectedRows === 0)
            return callback("user-already-exists", undefined);
          exports.generateNewToken(data.email, results.insertId, callback);
        }
      );
    }
  );
};

exports.login = function (email, password, callback) {
  const hashed = crypto.createHash("sha256").update(password).digest("base64");
  database.con.query(
    "SELECT * FROM user WHERE email = ? AND password = ?",
    [email, hashed],
    function (error, results, fields) {
      if (error) return callback(error.sqlMessage, undefined);
      if (results.length === 0) {
        return callback("user-login-failed", undefined);
      }
      exports.generateNewToken(
        results[0].email_address,
        results[0].id,
        callback
      );
    }
  );
};

exports.generateNewToken = function (email, user_id, callback) {
  jwt.sign(
    { user_email: email, user_id: user_id },
    config.auth.secret,
    { expiresIn: "1h" },
    (err, res) => {
      if (err) return callback("error-while-creating-token", undefined);
      database.con.query(
        "UPDATE `user` SET `token`=? WHERE email=? AND id=?",
        [res, email, user_id],
        function (error, results, fields) {
          if (error) return callback(error.sqlMessage, undefined);
          if (results.affectedRows === 0)
            return callback("failed to update token", undefined);
          callback(undefined, { token: res, user_id: user_id });
        }
      );
    }
  );
};

exports.get = function (id, callback) {
  database.con.query(
    "SELECT * FROM users WHERE user.id = ?",
    [id],
    function (error, results, fields) {
      if (error) return callback(error.sqlMessage, undefined);
      if (results.length === 0) {
        return callback("user-not-found", undefined);
      }
      callback(undefined, results[0]);
    }
  );
};
