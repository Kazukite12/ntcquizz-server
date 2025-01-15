const pool = require("../config/database");

async function generateUniquePin() {
    const generatePin = () => Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit number

    let isUnique = false;
    let pin;

    while (!isUnique) {
        pin = generatePin();
        const [results] = await new Promise((resolve, reject) => {
            pool.query(
                `SELECT COUNT(*) AS count FROM Games WHERE game_pin = ?`,
                [pin],
                (error, results) => {
                    if (error) return reject(error);
                    resolve(results);
                }
            );
        });

        if (results.count === 0) {
            isUnique = true;
        }
    }

    return pin;
}

module.exports = { generateUniquePin };
