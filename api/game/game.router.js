const {
    createGame,
    getGameById,
    getGamesByQuizId,
    updateGame,
    deleteGame,
    getGameByPin,
    updateAssignModeGame,
    updateGameSetting
} = require("./game.controller");

const router = require("express").Router();

// Create a new game
router.post("/", createGame);

// Get a specific game by its ID
router.get("/:id", getGameById);

// Get all games for a specific quiz
router.get("/quiz/:quizId", getGamesByQuizId);

router.get("/pin/:gamePin", getGameByPin);

// Update a game by its ID
router.put("/:gamePin", updateGame);

router.put("/setting/:gamePin",updateGameSetting)

router.put("/assign/:gamePin",updateAssignModeGame)

// Delete a game by its ID
router.delete("/:id", deleteGame);

module.exports = router;
