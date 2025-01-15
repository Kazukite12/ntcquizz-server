// //mysql 1 for producution 
// const {createPool} = require("mysql")

// const pool = createPool ({
//     port:process.env.DB_PORT,
//     host:process.env.DB_HOST,
//     user:process.env.DB_USER,
//     password:process.env.DB_PASSWORD,
//     database:process.env.MYSQL_DB
// })

// module.exports = pool


//mysql 2 for local development

const mysql = require('mysql2');


const pool = mysql.createConnection ({
    port:process.env.DB_PORT,
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.MYSQL_DB
})


module.exports = pool