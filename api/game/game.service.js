const pool = require("../../config/database");

module.exports = {
    createGame: (data, callBack) => {
        pool.query(
            `INSERT INTO Games (game_pin, quiz_id, question_data, mode,title, started_at, ended_at, slideBySlide, showCorrectAnswer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [data.gamePin, data.quizId, data.question_data,data.mode,data.title,data.started_at,data.ended_at,data.slideBySlide,data.showCorrectAnswer],
            (error, result) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result);
            }
        );
    },

    getGameById: (id, callBack) => {
        pool.query(
            `SELECT * FROM Games WHERE id = ?`,
            [id],
            (error, result) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result);
            }
        );
    },

    getGamesByQuizId: (quizId, callBack) => {
        pool.query(
            `SELECT * FROM Games WHERE quiz_id = ?`,
            [quizId],
            (error, result) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result);
            }
        );
    },

    getGameByPin: (pin, callBack)=> {
        pool.query(
            `SELECT * FROM Games WHERE game_pin = ?`,
            [pin],
            (error,result)=> {
                if(error) {
                    return callBack(error)
                }
                return callBack(null,result)
            }

        )
    },

    updateGame: (data, callBack) => {
        pool.query(
            `UPDATE Games SET started_at = ?, ended_at = ?, result = ? WHERE game_pin = ?`,
            [data.started_at, data.ended_at, data.result, data.game_pin],
            (error, result) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result);
            }
        );
    },

    updateGameSetting: (data, callBack) => {
        pool.query(
            `
            UPDATE Games 
            SET 
                started_at = COALESCE(?, started_at), 
                ended_at = COALESCE(?, ended_at), 
                slideBySlide = COALESCE(?, slideBySlide), 
                showCorrectAnswer = COALESCE(?, showCorrectAnswer) 
            WHERE game_pin = ?
            `,
            [
                data.started_at, 
                data.ended_at, 
                data.slideBySlide, 
                data.showCorrectAnswer, 
                data.game_pin
            ],
            (error, result) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result);
            }
        );
    },
    

    updateAssignModeGame: (data, callBack) => {
        try {
            // Fetch current result
            pool.query(
                `SELECT result FROM Games WHERE game_pin = ?;`,
                [data.game_pin],
                (fetchError, fetchResult) => {
                    if (fetchError) {
                        return callBack(fetchError);
                    }
    
                    let currentResult = JSON.parse(fetchResult[0]?.result || '[]');
                    currentResult.push(data.result);
    
                    // Update with the new JSON array
                    pool.query(
                        `UPDATE Games SET result = ? WHERE game_pin = ?;`,
                        [JSON.stringify(currentResult), data.game_pin],
                        (updateError, updateResult) => {
                            if (updateError) {
                                return callBack(updateError);
                            }
                            return callBack(null, updateResult);
                        }
                    );
                }
            );
        } catch (error) {
            return callBack(error);
        }
    },

    deleteGame: (id, callBack) => {
        pool.query(
            `DELETE FROM Games WHERE id = ?`,
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
