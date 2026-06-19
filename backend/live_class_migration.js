require("dotenv").config();
const db = require("./src/config/db");

async function migrate() {
    const connection = await db.getConnection();
    try {
        console.log("Creating live_classes table...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS live_classes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                teacher_id INT NOT NULL,
                course_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                meeting_link VARCHAR(500) NOT NULL,
                start_time DATETIME NOT NULL,
                status ENUM('scheduled', 'ongoing', 'completed') DEFAULT 'scheduled',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (teacher_id) REFERENCES users(id),
                FOREIGN KEY (course_id) REFERENCES courses(id)
            )
        `);
        console.log("live_classes table created successfully.");
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    } finally {
        connection.release();
    }
}

migrate();
