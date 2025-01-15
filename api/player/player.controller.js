const {createPlayer,getPlayerById} = require('./player.service')


module.exports = {
    createPlayer: async (req, res) => {
        const body = req.body;
        try {
            createPlayer(body, (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Database connection error",
                    });
                }
                return res.status(201).json({
                    message: "Game created successfully",
                    data: results,
                });
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Error",
            });
        }
    },
    getPlayerById: (req, res) => {
        const id = req.params.id;
        getPlayerById(id, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database connection error",
                });
            }
            if (!results.length) {
                return res.status(404).json({
                    message: "Game not found",
                });
            }
            return res.status(200).json({
                data: results[0],
            });
        });
    },
}