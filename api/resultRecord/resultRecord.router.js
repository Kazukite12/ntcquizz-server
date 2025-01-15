const router = require("express").Router();
const {
    createRecord,
    getAllRecords,
    getRecordById,
    getUserResultsByGameId,
    updateRecord,
    deleteRecord,
} = require("./resultRecord.controller");

// Create a new result record
router.post("/", createRecord);

// Get all result records
router.get("/", getAllRecords);

// Get a result record by ID
router.get("/:id", getRecordById);

router.get("/game/:gameId",getUserResultsByGameId)

// Update a result record by ID
router.put("/:id", updateRecord);

// Delete a result record by ID
router.delete("/:id", deleteRecord);

module.exports = router;
