require('dotenv').config();
const db = require('./src/config/db');

async function seedAdmin() {
    try {
        const email = 'admin@tutorhub.com';
        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);

        if (existing.length > 0) {
            console.log('ADMIN_ALREADY_EXISTS');
            process.exit(0);
        }

        const name = 'Admin User';
        const password = 'admin123';
        const role = 'admin';
        const phone = '0000000000';
        const profile = 'https://ui-avatars.com/api/?name=Admin+User';

        await db.query(
            'INSERT INTO users (name, email, password, role, phone, profile) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, password, role, phone, profile]
        );

        console.log('ADMIN_CREATED_SUCCESSFULLY');
        console.log('Email: admin@tutorhub.com');
        console.log('Password: admin123');
    } catch (error) {
        console.error('SEEDING_ERROR:', error);
    } finally {
        process.exit();
    }
}

seedAdmin();
