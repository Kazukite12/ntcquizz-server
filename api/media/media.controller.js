const { createMedia, getMediaById,getMediaByUserId, updateMedia, deleteMedia, deleteMediaByStoredName } = require("./media.service");


module.exports = {
    // Create Media
    createMedia: async (req, res) => {
        const body = req.body;
        try {
            createMedia(body, (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Database connection error",
                    });
                }
                return res.status(201).json({
                    message: "Media created successfully",
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

    // Get Media By ID
    getMediaById: async (req, res) => {
        const { id } = req.params;
        try {
            getMediaById(id, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Database connection error",
                    });
                }
                if (!result) {
                    return res.status(404).json({
                        message: "Media not found",
                    });
                }
                return res.status(200).json({
                    message: "Media retrieved successfully",
                    data: result,
                });
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal Server Error",
            });
        }
    },

    getMediaByUserId: async (req, res) => {
        const { user_id } = req.params;
        try {
            getMediaByUserId(user_id, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Database connection error",
                    });
                }
                if (!result) {
                    return res.status(404).json({
                        message: "Media not found",
                    });
                }
                return res.status(200).json({
                    message: "Media retrieved successfully",
                    data: result,
                });
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal Server Error",
            });
        }
    },

    // Update Media
    updateMedia: async (req, res) => {
        const { id } = req.params;
        const body = req.body;
        try {
            updateMedia(id, body, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Database connection error",
                    });
                }
                if (!result) {
                    return res.status(404).json({
                        message: "Media not found",
                    });
                }
                return res.status(200).json({
                    message: "Media updated successfully",
                });
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal Server Error",
            });
        }
    },

    // Delete Media
    deleteMedia: async (req, res) => {
        const { id } = req.params;
        try {
            deleteMedia(id, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Database connection error",
                    });
                }
                if (!result) {
                    return res.status(404).json({
                        message: "Media not found",
                    });
                }
                return res.status(200).json({
                    message: "Media deleted successfully",
                });
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal Server Error",
            });
        }
    },

    deleteMediaByStoredName: (req, res) => {
        const { storedName } = req.params;

        if (!storedName) {
            return res.status(400).json({ message: "Stored name is required" });
        }

        deleteMediaByStoredName(storedName, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Failed to delete media" });
            }

            return res.status(200).json(result);
        });
    },
};
