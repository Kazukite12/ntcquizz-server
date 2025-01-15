const {
    createQuestion,
    getQuestionsByQuizId,
    getQuestionById,
    updateQuestion,
    deleteQuestion
} = require("./question.service");

const {createAnswer,updateAnswer,getAnswerByQuestionId} = require('../answer/answer.service')
const {getMediaByQuestionId} = require('../questionMedia/questionMedia.service')

module.exports = {
    createQuestion: (req, res) => {
        const body = req.body;

        // Validate if answers are provided and is an array
        if (!body.answers || !Array.isArray(body.answers) || body.answers.length === 0) {
            return res.status(400).json({
                message: "Answers are required and must be provided as an array.",
            });
        }

        // Call the createQuestion service
        createQuestion(body, (err, questionResults) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Failed to create question",
                });
            }

            // Question was created successfully
            const questionId = questionResults.id; // Get the newly created question ID

            // Insert answers into the database
            const answerPromises = body.answers.map((answer) =>
                new Promise((resolve, reject) => {
                    createAnswer(
                        {
                            questionId,
                            answer: answer.answer,
                            is_correct: answer.is_correct,
                            option: answer.option,
                        },
                        (err, result) => {
                            if (err) {
                                return reject(err);
                            }
                            resolve(result);
                        }
                    );
                })
            );

            // Wait for all answers to be created
            Promise.all(answerPromises)
                .then((answerResults) => {
                    return res.status(201).json({
                        message: "Question and answers created successfully",
                        question: {
                            id: questionId,
                            ...body,
                            answers: answerResults,
                        },
                    });
                })
                .catch((error) => {
                    console.log(error);
                    return res.status(500).json({
                        message: "Failed to create answers",
                    });
                });
        });
    },


    getQuestionsByQuizId: (req, res) => {
        const quizId = req.params.quizId;
    
        // Fetch questions by quiz ID
        getQuestionsByQuizId(quizId, async (err, questions) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database connection error",
                });
            }
            if (!questions.length) {
                // Return 200 OK with an empty array if no questions are found
                return res.status(200).json({
                    data: [],
                    message: "No questions found",
                });
            }
    
            try {
                // Fetch answers and media for each question
                const questionsWithDetails = await Promise.all(
                    questions.map((question) => {
                        return new Promise((resolve, reject) => {
                            // Fetch answers for the question
                            getAnswerByQuestionId(question.id, (err, answers) => {
                                if (err) {
                                    return reject(err);
                                }
    
                                // Fetch media for the question
                                getMediaByQuestionId(question.id, (err, media) => {
                                    if (err) {
                                        return reject(err);
                                    }
    
                                    // Combine question with its answers and media
                                    resolve({
                                        ...question,
                                        answers,
                                        media: media || [], // If no media, set an empty array
                                    });
                                });
                            });
                        });
                    })
                );
    
                // Send the response
                return res.status(200).json({
                    data: questionsWithDetails,
                });
            } catch (error) {
                console.log(error);
                return res.status(500).json({
                    message: "Failed to fetch details for questions",
                });
            }
        });
    },
    

    getQuestionById: (req, res) => {
        const id = req.params.id;
        getQuestionById(id, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database connection error",
                });
            }
            if (!results.length) {
                return res.status(404).json({
                    message: "Question not found",
                });
            }
            return res.status(200).json({
                data: results[0],
            });
        });
    },

    updateQuestion: (req, res) => {
        const body = req.body; // Extract all data from the request body
    
        // First, update the question
        updateQuestion(body, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Error updating question",
                });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({
                    message: "Question not found",
                });
            }
    
            // If the question is updated, now update the answers
            if (body.answers && Array.isArray(body.answers)) {
                // Loop through the answers and update each one
                const answerPromises = body.answers.map((answer) => {
                    return new Promise((resolve, reject) => {
                        updateAnswer(answer, (err, result) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(result);
                            }
                        });
                    });
                });
    
                // Wait for all answers to be updated
                Promise.all(answerPromises)
                    .then(() => {
                        return res.status(200).json({
                            message: "Question and answers updated successfully",
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                        return res.status(500).json({
                            message: "Error updating answers",
                        });
                    });
            } else {
                return res.status(400).json({
                    message: "No answers data provided",
                });
            }
        });
    },

    deleteQuestion: (req, res) => {
        const id = req.params.id;
        deleteQuestion(id, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database connection error",
                });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({
                    message: "Question not found",
                });
            }
            return res.status(200).json({
                message: "Question deleted successfully",
            });
        });
    }
};
