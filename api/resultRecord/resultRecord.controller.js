const {
    createResultRecord,
    getResultRecords,
    getResultRecordById,
    updateResultRecord,
    deleteResultRecord,
    getUserResultsByGameId,
} = require("./resultRecord.service");

module.exports = {
    createRecord: (req, res) => {
        const body = req.body;
        createResultRecord(body, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Database connection error",
                });
            }
            return res.status(201).json({
                message: "Result record created successfully",
                data: results,
            });
        });
    },

    getAllRecords: (req, res) => {
        getResultRecords((err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Database connection error",
                });
            }
            return res.status(200).json({
                message: "Result records retrieved successfully",
                data: results,
            });
        });
    },

    getRecordById: (req, res) => {
        const id = req.params.id;
        getResultRecordById(id, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Database connection error",
                });
            }
            if (!results) {
                return res.status(404).json({
                    message: "Result record not found",
                });
            }
            return res.status(200).json({
                message: "Result record retrieved successfully",
                data: results,
            });
        });
    },

    getUserResultsByGameId: (req, res) => {
        const gameId = req.params.gameId;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        if (isNaN(gameId) || isNaN(page) || page < 1 || isNaN(pageSize) || pageSize < 1) {
        return res.status(400).json({ error: 'Invalid parameters' });
        }

       getUserResultsByGameId(gameId,page,pageSize, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Database connection error",
                });
            }
            if (!results) {
                return res.status(404).json({
                    message: "Result record not found",
                });
            }
            return res.status(200).json({
                message: "Result record retrieved successfully",
                data: results,
            });
        });
    },


    

    updateRecord: (req, res) => {
        const id = req.params.id;
        const body = req.body;
        updateResultRecord(id, body, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Database connection error",
                });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({
                    message: "Result record not found",
                });
            }
            return res.status(200).json({
                message: "Result record updated successfully",
            });
        });
    },

    deleteRecord: (req, res) => {
        const id = req.params.id;
        deleteResultRecord(id, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Database connection error",
                });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({
                    message: "Result record not found",
                });
            }
            return res.status(200).json({
                message: "Result record deleted successfully",
            });
        });
    },
};