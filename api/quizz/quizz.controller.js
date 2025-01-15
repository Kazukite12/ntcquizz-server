const {
    createQuiz,
    getAllQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz,
    getQuizByUserId
} = require("./quizz.service");

module.exports = {
    createQuiz: (req, res) => {
        const body = req.body;
        createQuiz(body, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database connection error",
                });
            }
            return res.status(201).json({
                message: "Quiz created successfully",
                data: results,
            });
        });
    },

    getAllQuizzes: (req, res) => {
        getAllQuizzes((err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database connection error",
                });
            }
            return res.status(200).json({
                data: results,
            });
        });
    },

    getQuizById: (req, res) => {
        const id = req.params.id;
        getQuizById(id, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database connection error",
                });
            }
            if (!results.length) {
                // Return 200 OK with an empty array if no quiz is found
                return res.status(200).json({
                    data: [],
                    message: "No quizzes found",
                });
            }
            return res.status(200).json({
                data: results[0],
            });
        });
    },

    getQuizByUserId: (req, res) => {
        const user_id = req.params.userId;
        getQuizByUserId(user_id, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database connection error",
                });
            }
            if (!results.length) {
                // Return 200 OK with an empty array if no quiz is found
                return res.status(200).json({
                    data: [],
                    message: "No quizzes found",
                });
            }
            return res.status(200).json({
                data: results,
            });
        });
    },
    
    

    updateQuiz: (req, res) => {
        const body = req.body;
        body.id = req.params.id; // Extract ID from URL parameters
        updateQuiz(body, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database connection error",
                });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({
                    message: "Quiz not found",
                });
            }
            return res.status(200).json({
                message: "Quiz updated successfully",
            });
        });
    },

    deleteQuiz: (req, res) => {
        const id = req.params.id;
        deleteQuiz(id, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database connection error",
                });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({
                    message: "Quiz not found",
                });
            }
            return res.status(200).json({
                message: "Quiz deleted successfully",
            });
        });
    }
};
