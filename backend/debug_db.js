require("dotenv").config();
const db = require("./src/config/db");
async function test() {
    try {
        const [courses] = await db.query("DESCRIBE courses");
        console.log("\n--- COURSES SCHEMA ---");
        console.log(JSON.stringify(courses, null, 2));

        const [enrollments] = await db.query("DESCRIBE enrollment_requests");
        console.log("\n--- ENROLLMENT_REQUESTS SCHEMA ---");
        console.log(JSON.stringify(enrollments, null, 2));

        process.exit(0);
    } catch (err) {
        console.error("DEBUG ERROR:", err);
        process.exit(1);
    }
}
test();
