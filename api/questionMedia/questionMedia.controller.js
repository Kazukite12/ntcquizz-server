const { createQuestionMedia, getMediaByQuestionId, deleteQuestionMedia } = require("./questionMedia.service");

module.exports = {
    // Create QuestionMedia
    createQuestionMedia: async (req, res) => {
        const body = req.body; // Expect body to have questionId and mediaId
        try {
            createQuestionMedia(body, (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Database connection error",
                    });
                }
                return res.status(201).json({
                    message: "Media associated with question successfully",
                    data: results,
                });
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal Server Error",
            });
        }
    },

    // Get Media By Question ID
    getMediaByQuestionId: async (req, res) => {
        const { questionId } = req.params;
        try {
            getMediaByQuestionId(questionId, (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Database connection error",
                    });
                }
                return res.status(200).json({
                    message: "Media retrieved for question successfully",
                    data: results,
                });
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal Server Error",
            });
        }
    },

    // Delete QuestionMedia
    deleteQuestionMedia: async (req, res) => {
        const { questionId, mediaId } = req.params;
        try {
            deleteQuestionMedia(questionId, mediaId, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Database connection error",
                    });
                }
                if (!result) {
                    return res.status(404).json({
                        message: "Association not found",
                    });
                }
                return res.status(200).json({
                    message: "Association deleted successfully",
                });
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal Server Error",
            });
        }
    },
};
