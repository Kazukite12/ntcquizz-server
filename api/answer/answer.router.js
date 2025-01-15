const {
    createAnswer,
    getAnswerById,
    getAnswerByQuestionId,
    updateAnswer,
    deleteAnswer
} = require("./answer.controller");

const router = require("express").Router();

// Create a new answer
router.post("/", createAnswer);

// Get a specific answer by its ID
router.get("/:id", getAnswerById);

// Get all answer for a specific quiz
router.get("/question/:questionId", getAnswerByQuestionId);

// Update a game by its ID
router.put("/:id", updateAnswer);

// Delete a game by its ID
router.delete("/:id", deleteAnswer);

module.exports = router;
