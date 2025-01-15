const pool = require("../../config/database");
const bcrypt = require('bcrypt');

module.exports = {
  createUser: async (data, callBack) => {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const query = `INSERT INTO Users (username,email, password) VALUES (?, ?, ?)`;

      pool.query(query, [data.username,data.email, hashedPassword], (error, results) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      });
    } catch (err) {
      callBack(err);
    }
  },

  findUserByUsername: (username, callBack) => {
    const query = `SELECT * FROM Users WHERE username = ?`;

    pool.query(query, [username], (error, results) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results[0]); // Assuming usernames are unique
    });
  },

  findUserByEmail: (email, callBack) => {
    const query = `SELECT * FROM Users WHERE email = ?`;

    pool.query(query, [email], (error, results) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results[0]); // Assuming usernames are unique
    });
  },

  findUserById: (id, callBack) => {
    const query = `SELECT id, username FROM Users WHERE id = ?`;

    pool.query(query, [id], (error, results) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results[0]);
    });
  },
};
