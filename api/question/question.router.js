const {
    createQuestion,
    getQuestionsByQuizId,
    getQuestionById,
    updateQuestion,
    deleteQuestion
} = require("./question.controller");

const router = require("express").Router();

// Create a new question
router.post("/", createQuestion);

// Get all questions for a specific quiz
router.get("/quiz/:quizId", getQuestionsByQuizId);

// Get a specific question by its ID
router.get("/:id", getQuestionById);

// Update a question by its ID
router.put("/", updateQuestion);

// Delete a question by its ID
router.delete("/:id", deleteQuestion);

module.exports = router;
