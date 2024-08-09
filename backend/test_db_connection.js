const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USERNAME,
    host: process.env.HOST,
    database: process.env.DBNAME,
    password: process.env.PASSWORD,
    port: process.env.DBPORT,
});

(async () => {
    try {
        console.log('Connecting to the database...');
        const res = await pool.query('SELECT NOW()');
        console.log('Database connection successful:', res.rows[0]);

    } catch (err) {
        console.error('Error connecting to the database:', err);
    } finally {
        pool.end();
    }
})();
