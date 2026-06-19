require("dotenv").config();
const db = require("./src/config/db");

async function syncSchema() {
    console.log("Starting Comprehensive Schema Synchronization...");
    const connection = await db.getConnection();

    try {
        // --- Helper: Check if column exists ---
        const columnExists = async (table, column) => {
            const [rows] = await connection.query(`SHOW COLUMNS FROM ${table} LIKE ?`, [column]);
            return rows.length > 0;
        };

        // 1. FIX USERS TABLE
        console.log("Checking 'users' table...");
        if (!(await columnExists('users', 'profile'))) {
            console.log("Adding 'profile' column to 'users' table...");
            await connection.query("ALTER TABLE users ADD COLUMN profile LONGTEXT AFTER phone");
            console.log("'profile' column added.");
        } else {
            console.log("'profile' column already exists in 'users'.");
        }

        if (!(await columnExists('users', 'last_seen'))) {
            console.log("Adding 'last_seen' column to 'users' table...");
            await connection.query("ALTER TABLE users ADD COLUMN last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER profile");
            console.log("'last_seen' column added.");
        }

        // 2. FIX COURSES TABLE
        console.log("Checking 'courses' table...");
        if (!(await columnExists('courses', 'name'))) {
            console.log("Adding 'name' column to 'courses' table...");
            await connection.query("ALTER TABLE courses ADD COLUMN name VARCHAR(255) AFTER id");
            await connection.query("UPDATE courses SET name = subject");
            console.log("'name' column added and synced with 'subject'.");
        }
        if (!(await columnExists('courses', 'content'))) {
            console.log("Adding 'content' column to 'courses' table...");
            await connection.query("ALTER TABLE courses ADD COLUMN content TEXT AFTER description");
            console.log("'content' column added.");
        }
        if (!(await columnExists('courses', 'price'))) {
            console.log("Adding 'price' column to 'courses' table...");
            await connection.query("ALTER TABLE courses ADD COLUMN price DECIMAL(10,2) AFTER fee");
            await connection.query("UPDATE courses SET price = fee");
            console.log("'price' column added and synced with 'fee'.");
        }

        // 3. TEACHER PROFILES TABLE
        console.log("Checking 'teacher_profiles' table...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS teacher_profiles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                qualification VARCHAR(255),
                experience_years INT,
                bio TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE (user_id),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        // Ensure unique constraint exists if table already existed
        try { await connection.query("ALTER TABLE teacher_profiles ADD UNIQUE (user_id)"); } catch (e) { }
        console.log("'teacher_profiles' table ready.");

        // 4. STUDENT PROFILES TABLE
        console.log("Checking 'student_profiles' table...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS student_profiles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                grade_level VARCHAR(50),
                subjects_of_interest TEXT,
                learning_goals TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE (user_id),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        // Ensure unique constraint exists if table already existed
        try { await connection.query("ALTER TABLE student_profiles ADD UNIQUE (user_id)"); } catch (e) { }
        console.log("'student_profiles' table ready.");

        // 5. COURSE REQUESTS TABLE
        console.log("Checking 'course_requests' table...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS course_requests (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT NOT NULL,
                course_id INT NOT NULL,
                status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
                request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
            )
        `);
        console.log("'course_requests' table ready.");

        // 6. ENROLLMENT REQUESTS TABLE (Alternative names check)
        console.log("Checking 'enrollment_requests' table...");
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
        console.log("'enrollment_requests' table checked/created.");

        // 7. FIX COURSE ENROLLMENTS
        console.log("Checking 'course_enrollments' table...");
        if (await columnExists('course_enrollments', 'enrolled_at') && !(await columnExists('course_enrollments', 'enrollment_date'))) {
            console.log("Renaming 'enrolled_at' to 'enrollment_date' in 'course_enrollments'...");
            await connection.query("ALTER TABLE course_enrollments CHANGE enrolled_at enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
            console.log("Column renamed.");
        }
        if (!(await columnExists('course_enrollments', 'teacher_id'))) {
            await connection.query("ALTER TABLE course_enrollments ADD COLUMN teacher_id INT");
            console.log("'teacher_id' added to 'course_enrollments'.");
        }
        if (!(await columnExists('course_enrollments', 'status'))) {
            await connection.query("ALTER TABLE course_enrollments ADD COLUMN status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved'");
            console.log("'status' added to 'course_enrollments'.");
        }
        if (!(await columnExists('course_enrollments', 'enrollment_date'))) {
            console.log("Adding 'enrollment_date' column to 'course_enrollments'...");
            await connection.query("ALTER TABLE course_enrollments ADD COLUMN enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
            console.log("'enrollment_date' added.");
        }

        // 8. MESSAGES TABLE
        console.log("Checking 'messages' table...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                sender_id INT NOT NULL,
                receiver_id INT NOT NULL,
                message TEXT NOT NULL,
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log("'messages' table ready.");

        console.log("\nSCHEMA SYNCHRONIZATION COMPLETED SUCCESSFULLY!");
        process.exit(0);
    } catch (err) {
        console.error("\nSCHEMA SYNCHRONIZATION FAILED:");
        console.error(err.message);
        process.exit(1);
    } finally {
        connection.release();
    }
}

syncSchema();
