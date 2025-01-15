const pool = require("../../config/database");

module.exports = {
    createPlayer: (data, callBack) => {
        pool.query(
            `INSERT INTO Players (name, score, game_id) VALUES (?, ?, ?)`,
            [data.name, data.score,data.game_id],
            (error, result) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, { id: result.insertId });
            }
        );
    },

    getPlayerById: (id, callBack) => {
        pool.query(
            `SELECT * FROM Players WHERE id = ?`,
            [id],
            (error, result) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result);
            }
        );
    },

};
