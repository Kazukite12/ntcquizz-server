const {
    createAnswer,
    getAnswerById,
    getAnswerByQuestionId,
    updateAnswer,
    deleteAnswer
} = require("./answer.service");

module.exports = {
    createAnswer: (req, res) => {
        const body = req.body;
        createAnswer(body, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database connection error",
                });
            }
            return res.status(201).json({
                message: "Answer created successfully",
                data: results,
            });
        });
    },

    getAnswerById: (req, res) => {
        const id = req.params.id;
        getAnswerById(id, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database connection error",
                });
            }
            if (!results.length) {
                return res.status(404).json({
                    message: "Answer not found",
                });
            }
            return res.status(200).json({
                data: results[0],
            });
        });
    },

    getAnswerByQuestionId: (req, res) => {
        const questionId = req.params.questionId;
        getAnswerByQuestionId(questionId, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database connection error",
                });
            }
            if (!results.length) {
                return res.status(404).json({
                    message: "No Answers found for this quiz",
                });
            }
            return res.status(200).json({
                data: results,
            });
        });
    },

    updateAnswer: (req, res) => {
        const body = req.body;
        body.id = req.params.id; // Extract ID from URL parameters
        updateAnswer(body, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database connection error",
                });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({
                    message: "Answer not found",
                });
            }
            return res.status(200).json({
                message: "Answer updated successfully",
            });
        });
    },

    deleteAnswer: (req, res) => {
        const id = req.params.id;
        deleteAnswer(id, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database connection error",
                });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({
                    message: "Answer not found",
                });
            }
            return res.status(200).json({
                message: "Answer deleted successfully",
            });
        });
    }
};
