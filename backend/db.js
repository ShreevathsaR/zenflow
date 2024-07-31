const Pool = require('pg').Pool
require('dotenv').config()

const pool = new Pool({
    user: 'Shreevathsa',
    password: '9353152800@Chiu',
    host: process.env.HOST,
    port: process.env.DBPORT,
    database: 'zenflow',
})

module.exports = pool;