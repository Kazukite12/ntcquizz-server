const pool = require("../../config/database");

module.exports = {
    createQuestion: (data, callBack) => {
        pool.query(
            `INSERT INTO Questions (quiz_id, question, point, time, background) VALUES (?, ?, ?, ?, ?)`,
            [data.quizId, data.question, data.point, data.time,data.background],
            (error, result) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, { id: result.insertId });
            }
        );
    },

    getQuestionsByQuizId: (quizId, callBack) => {
        pool.query(
            `SELECT * FROM Questions WHERE quiz_id = ?`,
            [quizId],
            (error, result) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result);
            }
        );
    },

    getQuestionById: (id, callBack) => {
        pool.query(
            `SELECT * FROM Questions WHERE id = ?`,
            [id],
            (error, result) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result);
            }
        );
    },

    updateQuestion: (data, callBack) => {
        pool.query(
            `
            UPDATE Questions
            SET 
                question = COALESCE(?, question), 
                point = COALESCE(?, point), 
                time = COALESCE(?, time),
                 background = COALESCE(?, background)
            WHERE id = ?
            `,
            [data.question, data.point, data.time, data.background, data.id],
            (error, result) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result);
            }
        );
    },

    deleteQuestion: (id, callBack) => {
        pool.query(
            `DELETE FROM Questions WHERE id = ?`,
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
