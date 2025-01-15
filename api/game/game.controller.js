const {
    createGame,
    getGameById,
    getGamesByQuizId,
    getGameByPin,
    updateGame,
    deleteGame,
    updateAssignModeGame,
    updateGameSetting
} = require("./game.service");

const {generateUniquePin} = require("../../utils/pinGenerator");

module.exports = {
    createGame: async (req, res) => {
        const body = req.body;
        try {
            const gamePin = await generateUniquePin(); // Generate unique pin
            body.gamePin = gamePin; // Add the generated pin to the request body

            createGame(body, (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Database connection error",
                    });
                }
                return res.status(201).json({
                    message: "Game created successfully",
                    data: results,
                });
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Error generating unique pin",
            });
        }
    },
    getGameById: (req, res) => {
        const id = req.params.id;
        getGameById(id, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database connection error",
                });
            }
            if (!results.length) {
                return res.status(404).json({
                    message: "Game not found",
                });
            }
            return res.status(200).json({
                data: results[0],
            });
        });
    },


    getGamesByQuizId: (req, res) => {
        const quizId = req.params.quizId;
        getGamesByQuizId(quizId, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database connection error",
                });
            }
            if (!results.length) {
                return res.status(404).json({
                    message: "No games found for this quiz",
                });
            }
            return res.status(200).json({
                data: results,
            });
        });
    },

    getGameByPin: (req, res) => {
        const gamePin = req.params.gamePin;
        getGameByPin(gamePin, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database connection error",
                });
            }
            if (!results.length) {
                return res.status(404).json({
                    message: "No games found for this quiz",
                });
            }
            return res.status(200).json({
                data: results,
            });
        });
    },

    updateGame: (req, res) => {
        const body = req.body;
        body.game_pin = req.params.gamePin; // Extract ID from URL parameters
        updateGame(body, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database connection error",
                });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({
                    message: "Game not found",
                });
            }
            return res.status(200).json({
                message: "Game updated successfully",
            });
        });
    },

    updateGameSetting: (req, res) => {
        const body = req.body;
        body.game_pin = req.params.gamePin; // Extract ID from URL parameters
        updateGameSetting(body, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database connection error",
                });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({
                    message: "Game not found",
                });
            }
            return res.status(200).json({
                message: "Game updated successfully",
            });
        });
    },

    updateAssignModeGame: (req, res) => {
        const body = req.body;
        body.game_pin = req.params.gamePin; // Extract ID from URL parameters
        updateAssignModeGame(body, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database connection error",
                });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({
                    message: "Game not found",
                });
            }
            return res.status(200).json({
                message: "Game updated successfully",
            });
        });
    },


    deleteGame: (req, res) => {
        const id = req.params.id;
        deleteGame(id, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database connection error",
                });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({
                    message: "Game not found",
                });
            }
            return res.status(200).json({
                message: "Game deleted successfully",
            });
        });
    }
};
