const express = require("express");
const router = express.Router();
const mediaController = require("./media.controller");

// Create Media
router.post("/", mediaController.createMedia);

// Get Media By ID
router.get("/:id", mediaController.getMediaById);

// get Media By User_id
router.get("/:user_id", mediaController.getMediaByUserId);

// Update Media
router.put("/:id", mediaController.updateMedia);

// Delete Media
router.delete("/:id", mediaController.deleteMedia);

router.delete('/storedName/:storedName', mediaController.deleteMediaByStoredName);

module.exports = router;
