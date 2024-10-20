const Pool = require('pg').Pool
require('dotenv').config()

const pool = new Pool({
    user: process.env.DB_USERNAME || 'postgres.oybxpwsjoycqfdiwvyfq',
    password: process.env.PASSWORD || '9353152800@Chiu',
    host: process.env.HOST || 'aws-0-ap-south-1.pooler.supabase.com',
    port: process.env.DBPORT || '6543',
    database: process.env.DBNNAME || 'postgres',
})

module.exports = pool;