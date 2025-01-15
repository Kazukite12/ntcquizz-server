const pool = require("../../config/database");

module.exports = {
    createAnswer: (data, callBack) => {
        pool.query(
            `INSERT INTO Answers (question_id, answer, is_correct, \`option\`) VALUES (?, ?, ?, ?)`,
            [data.questionId, data.answer,data.is_correct,data.option],
            (error, result) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, { id: result.insertId });
            }
        );
    },

    getAnswerById: (id, callBack) => {
        pool.query(
            `SELECT * FROM Answers WHERE id = ?`,
            [id],
            (error, result) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result);
            }
        );
    },

    getAnswerByQuestionId: (quizId, callBack) => {
        pool.query(
            `SELECT * FROM Answers WHERE question_id = ?`,
            [quizId],
            (error, result) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result);
            }
        );
    },

    updateAnswer: (data, callBack) => {
        pool.query(
           
           `UPDATE Answers
            SET 
                answer = COALESCE(?, answer), 
                is_correct = COALESCE(?, is_correct)
            WHERE id = ?`,
            [data.answer,data.is_correct,data.id],
            (error, result) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result);
            }
        );
    },

    updateAnswerByOption: (data, callBack) => {
        pool.query(
            `UPDATE Answers SET answer = ? WHERE id = ?`,
            [data.answer, data.id],
            (error, result) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result);
            }
        );
    },

    deleteAnswer: (id, callBack) => {
        pool.query(
            `DELETE FROM Answers WHERE id = ?`,
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
