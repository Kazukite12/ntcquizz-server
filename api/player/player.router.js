const {createPlayer,getPlayerById} = require("./player.controller")


const router = require("express").Router();

// Create a new game
router.post("/", createPlayer);

// Get a specific game by its ID
router.get("/:id", getPlayerById);

module.exports = router;