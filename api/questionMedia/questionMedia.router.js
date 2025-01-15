const express = require("express");
const router = express.Router();
const questionMediaController = require("./questionMedia.controller");

// Create QuestionMedia
router.post("/", questionMediaController.createQuestionMedia);

// Get Media By Question ID
router.get("/:questionId", questionMediaController.getMediaByQuestionId);

// Delete QuestionMedia
router.delete("/:questionId/:mediaId", questionMediaController.deleteQuestionMedia);

module.exports = router;
