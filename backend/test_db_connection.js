const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: 'Shreevathsa',
    password: "9353152800@Chiu",
    host: process.env.HOST,
    port: process.env.DBPORT,
    database: 'zenflow',
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
