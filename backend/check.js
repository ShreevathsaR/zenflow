const { Client } = require('pg');

const client = new Client({
    user: process.env.DB_USERNAME || 'postgres.oybxpwsjoycqfdiwvyfq',
    password: process.env.PASSWORD || '9353152800@Chiu',
    host: process.env.HOST || 'aws-0-ap-south-1.pooler.supabase.com',
    port: process.env.DBPORT || '6543',
    database: process.env.DBNNAME || 'postgres',
});


client.connect(err => {
    if (err) {
        console.error('connection error', err.stack);
    } else {
        console.log('connected');
    }
    client.end();
});