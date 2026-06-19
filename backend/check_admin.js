require('dotenv').config();
const db = require('./src/config/db');

async function checkAdmin() {
    try {
        const [rows] = await db.query('SELECT id, name, email, role FROM users WHERE email = ?', ['admin@tutorhub.com']);
        if (rows.length === 0) {
            console.log('ADMIN_NOT_FOUND');
        } else {
            console.log('ADMIN_FOUND:', JSON.stringify(rows[0]));
        }
    } catch (error) {
        console.error('DATABASE_ERROR:', error);
    } finally {
        process.exit();
    }
}

checkAdmin();
