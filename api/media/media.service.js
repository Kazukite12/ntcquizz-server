const pool = require("../../config/database");
const fs = require('fs');
const path = require('path');

module.exports = {

    createMedia: (data, callBack) => {
        pool.query(
            `INSERT INTO Media (type, stored_name, user_id) VALUES (?, ?, ?)`,
            [data.type, data.stored_name, data.user_id],
            (error, result) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, { id: result.insertId });
            }
        );
    },
    
    getMediaById: (id, callBack) => {
        pool.query(
            `SELECT * FROM Media WHERE id = ?`,
            [id],
            (error, results) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        );
    },

    getMediaByUserId: (user_id, callBack) => {
        pool.query(
            `SELECT * FROM Media WHERE user_id = ?`,
            [user_id],
            (error, results) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        );
    },
    
   updateMedia: (id, data, callBack) => {
        pool.query(
            `UPDATE Media SET type = ?, stored_name = ?, user_id = ? WHERE id = ?`,
            [data.type, data.storedName, data.userId, id],
            (error, result) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result.affectedRows > 0);
            }
        );
    },
    
    deleteMedia: (id, callBack) => {
        pool.query(
            `DELETE FROM Media WHERE id = ?`,
            [id],
            (error, result) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result.affectedRows > 0);
            }
        );
    },

    deleteMediaByStoredName: (storedName, callBack) => {
        // Query to get the media details
        storedName = decodeURIComponent(storedName)
        pool.query(
            `SELECT id, stored_name FROM Media WHERE stored_name = ?`,
            [storedName],
            (error, results) => {
                if (error) {
                    return callBack(error);
                }

                if (results.length === 0) {
                    return callBack(new Error("Media not found"));
                }

                const media = results[0];

                if (media.type == 'Video') {
                           // Delete the database entry
                           pool.query(
                            `DELETE FROM Media WHERE id = ?`,
                            [media.id],
                            (dbErr) => {
                                if (dbErr) {
                                    return callBack(dbErr);
                                }
    
                                callBack(null, { message: 'Media deleted successfully' });
                            }
                        );

                        return
                }

                const filePath = path.join(__dirname, '../../uploads', media.stored_name);

                // Delete the file
                fs.unlink(filePath, (fileErr) => {
                    if (fileErr && fileErr.code !== 'ENOENT') {
                        return callBack(fileErr);
                    }

                    // Delete the database entry
                    pool.query(
                        `DELETE FROM Media WHERE id = ?`,
                        [media.id],
                        (dbErr) => {
                            if (dbErr) {
                                return callBack(dbErr);
                            }

                            callBack(null, { message: 'Media deleted successfully' });
                        }
                    );
                });
            }
        );
    },
}