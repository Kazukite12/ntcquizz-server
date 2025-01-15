const pool = require("../../config/database");

module.exports = {
    createResultRecord: (data, callBack) => {
        pool.query(
            `INSERT INTO Result_record (player_id, question_id, answer_id, score) 
             VALUES (?, ?, ?, ?)`,
            [data.player_id, data.question_id, data.answer_id, data.score],
            (error, result) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, { id: result.insertId });
            }
        );
    },

    getResultRecords: (callBack) => {
        pool.query(
            `SELECT * FROM Result_record`,
            [],
            (error, results) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },

    getResultRecordById: (id, callBack) => {
        pool.query(
            `SELECT * FROM Result_record WHERE id = ?`,
            [id],
            (error, results) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        );
    },

  getUserResultsByGameId : (gameId, page, pageSize, callBack) => {
        const offset = (page - 1) * pageSize;
    
        // First, get the total count of players for this game
        pool.query(
            `SELECT COUNT(DISTINCT p.id) as total
             FROM Players p
             JOIN Games g ON p.game_id = g.id
             WHERE g.id = ?`,
            [gameId],
            (countError, countResults) => {
                if (countError) {
                    return callBack(countError);
                }
    
                const totalPlayers = countResults[0].total;
    
                // Then, get the paginated results
                pool.query(
                    `SELECT 
                        p.name AS player_name,
                        RANK() OVER (ORDER BY SUM(rr.score) DESC) AS ranking,
                        SUM(CASE WHEN a.is_correct = true THEN 1 ELSE 0 END) AS correct_answers,
                        (SELECT COUNT(*) FROM Questions q WHERE q.quiz_id = g.quiz_id) - 
                            COUNT(DISTINCT rr.question_id) AS not_answered,
                        COALESCE(SUM(rr.score), 0) AS total_score
                    FROM 
                        Players p
                    JOIN 
                        Games g ON p.game_id = g.id
                    LEFT JOIN 
                        Result_record rr ON p.id = rr.player_id
                    LEFT JOIN 
                        Answers a ON rr.answer_id = a.id
                    WHERE 
                        g.id = ?
                    GROUP BY 
                        p.id, p.name
                    ORDER BY 
                        total_score DESC, p.name
                    LIMIT ? OFFSET ?`,
                    [gameId, pageSize, offset],
                    (error, results) => {
                        if (error) {
                            return callBack(error);
                        }
                        return callBack(null, {
                            results,
                            pagination: {
                                currentPage: page,
                                pageSize,
                                totalPages: Math.ceil(totalPlayers / pageSize),
                                totalItems: totalPlayers
                            }
                        });
                    }
                );
            }
        );
    },

    updateResultRecord: (id, data, callBack) => {
        pool.query(
            `UPDATE Result_record SET player_id = ?, question_id = ?, answer_id = ?, is_correct = ?, score = ? 
             WHERE id = ?`,
            [data.player_id, data.question_id, data.answer_id, data.is_correct, data.score, id],
            (error, result) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result);
            }
        );
    },

    deleteResultRecord: (id, callBack) => {
        pool.query(
            `DELETE FROM Result_record WHERE id = ?`,
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