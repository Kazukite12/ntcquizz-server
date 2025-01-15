const pool = require("../../config/database");

module.exports = {
   createQuestionMedia :(data, callBack) => {
        pool.query(
            `INSERT INTO QuestionMedia (question_id, media_id) VALUES (?, ?)`,
            [data.question_id, data.media_id],
            (error, result) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, { id: result.insertId });
            }
        );
    },   
   getMediaByQuestionId :(questionId, callBack) => {
        pool.query(
            `SELECT Media.* 
             FROM Media 
             JOIN QuestionMedia ON Media.id = QuestionMedia.media_id 
             WHERE QuestionMedia.question_id = ?`,
            [questionId],
            (error, results) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },    
   deleteQuestionMedia : (questionId, mediaId, callBack) => {
        pool.query(
            `DELETE FROM QuestionMedia WHERE question_id = ? AND media_id = ?`,
            [questionId, mediaId],
            (error, result) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result.affectedRows > 0);
            }
        );
    },
}