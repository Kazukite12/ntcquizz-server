const pool = require("../../config/database");

module.exports = {
    createQuiz: (data, callBack) => {
        pool.query(
            `INSERT INTO Quizzez (creator_id, title, description) VALUES (?, ?, ?)`,
            [data.creatorId, data.title, data.description],
            (error, result) => {
                if (error) {
                    return callBack(error);
                }
                // Return the inserted row ID
                return callBack(null, { id: result.insertId });
            }
        );
    },

    getAllQuizzes: (callBack) => {
        pool.query(
            `SELECT * FROM Quizzez`,
            [],
            (error, result) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result);
            }
        );
    },

    getQuizById: (id, callBack) => {
        pool.query(
            `SELECT * FROM Quizzez WHERE id = ?`,
            [id],
            (error, result) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result);
            }
        );
    },

   
    getQuizByUserId: (user_id, callBack) => {
        pool.query(
            `SELECT * FROM Quizzez WHERE creator_id = ?`,
            [user_id],
            (error, result) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result);
            }
        );
    },

    updateQuiz: (data, callBack) => {
        pool.query(
            `UPDATE Quizzez SET title = ?, description = ? WHERE id = ?`,
            [data.title, data.description, data.id],
            (error, result) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result);
            }
        );
    },

    deleteQuiz: (id, callBack) => {
        pool.query(
            `DELETE FROM Quizzez WHERE id = ?`,
            [id],
            (error, result) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result);
            }
        );
    }
};