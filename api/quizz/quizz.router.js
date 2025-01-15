const authMiddleware = require("../../middleware/auth.middleware");
const {
    createQuiz,
    getAllQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz,
    getQuizByUserId
} = require("./quizz.controller");

const router = require("express").Router();

// Create a new quiz
router.post("/", createQuiz);

router.get("/user/:userId",authMiddleware,getQuizByUserId)
// Get all quizzes
router.get("/", getAllQuizzes);

// Get a quiz by ID
router.get("/:id", getQuizById);

// Update a quiz by ID
router.put("/:id", updateQuiz);

// Delete a quiz by ID
router.delete("/:id", deleteQuiz);

module.exports = router;
