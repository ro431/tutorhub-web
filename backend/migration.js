require("dotenv").config();
const db = require("./src/config/db");

async function migrate() {
    const connection = await db.getConnection();
    try {
        console.log("Starting migration...");

        // 1. Fix courses table
        console.log("Updating courses table...");
        await connection.query("ALTER TABLE courses ADD COLUMN IF NOT EXISTS name VARCHAR(255)");
        await connection.query("ALTER TABLE courses ADD COLUMN IF NOT EXISTS content TEXT");
        await connection.query("ALTER TABLE courses ADD COLUMN IF NOT EXISTS price DECIMAL(10,2)");

        // Sync data if columns were just added
        await connection.query("UPDATE courses SET name = subject WHERE name IS NULL OR name = ''");
        await connection.query("UPDATE courses SET price = fee WHERE (price IS NULL OR price = 0) AND fee > 0");
        console.log("Courses table updated.");

        // 2. Create enrollment_requests
        console.log("Creating enrollment_requests table...");
        await connection.query(`
      CREATE TABLE IF NOT EXISTS enrollment_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        course_id INT NOT NULL,
        teacher_id INT NOT NULL,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES users(id),
        FOREIGN KEY (course_id) REFERENCES courses(id),
        FOREIGN KEY (teacher_id) REFERENCES users(id)
      )
    `);
        console.log("enrollment_requests table ready.");

        // 3. Fix course_enrollments
        console.log("Updating course_enrollments table...");
        try {
            await connection.query("ALTER TABLE course_enrollments ADD COLUMN IF NOT EXISTS teacher_id INT");
            await connection.query("ALTER TABLE course_enrollments ADD COLUMN IF NOT EXISTS status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved'");
        } catch (e) { console.log("Some columns in course_enrollments might already exist."); }
        console.log("course_enrollments table updated.");

        console.log("MIGRATION COMPLETED SUCCESSFULLY!");
        process.exit(0);
    } catch (err) {
        console.error("MIGRATION FAILED:", err);
        process.exit(1);
    } finally {
        connection.release();
    }
}

migrate();
