const db = require("../config/db");

// CREATE TEACHER PROFILE
async function createTeacherProfile(profile) {
  const { user_id, qualification, experience_years, bio } = profile;

  const [result] = await db.query(
    "INSERT INTO teacher_profiles (user_id, qualification, experience_years, bio) VALUES (?, ?, ?, ?)",
    [user_id, qualification, experience_years, bio]
  );
  return result;
}

// GET TEACHER PROFILE BY USER ID
async function getTeacherProfileByUserId(userId) {
  const [result] = await db.query(
    "SELECT u.id as user_id, tp.id as id, u.name, u.email, u.phone, u.profile, tp.qualification, tp.experience_years, tp.bio FROM users u LEFT JOIN teacher_profiles tp ON u.id = tp.user_id WHERE u.id = ?",
    [userId]
  );
  return result;
}

// GET TEACHER PROFILE BY ID
async function getTeacherProfileById(profileId) {
  const [result] = await db.query(
    "SELECT tp.*, u.name, u.email, u.phone, u.profile FROM teacher_profiles tp JOIN users u ON tp.user_id = u.id WHERE tp.id = ?",
    [profileId]
  );
  return result;
}

// GET ALL TEACHER PROFILES
async function getAllTeacherProfiles() {
  const [result] = await db.query(
    "SELECT tp.*, u.name, u.email, u.phone, u.profile FROM teacher_profiles tp JOIN users u ON tp.user_id = u.id WHERE u.role = 'teacher'"
  );
  return result;
}

// UPDATE TEACHER PROFILE
async function updateTeacherProfile(userId, data) {
  const { name, phone, profile, qualification, experience_years, bio } = data;

  // 1. Update users table (name, phone, profile/image)
  if (name || phone || profile) {
    let userQuery = "UPDATE users SET ";
    let userParams = [];
    if (name) { userQuery += "name=?, "; userParams.push(name); }
    if (phone) { userQuery += "phone=?, "; userParams.push(phone); }
    if (profile) { userQuery += "profile=?, "; userParams.push(profile); }

    // Remove trailing comma and space
    userQuery = userQuery.slice(0, -2);
    userQuery += " WHERE id=?";
    userParams.push(userId);

    await db.query(userQuery, userParams);
  }

  // 2. Update teacher_profiles table
  if (qualification || experience_years || bio) {
    await db.query(
      `INSERT INTO teacher_profiles (user_id, qualification, experience_years, bio)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       qualification = VALUES(qualification),
       experience_years = VALUES(experience_years),
       bio = VALUES(bio)`,
      [userId, qualification || null, experience_years || null, bio || null]
    );
  }

  return { status: true };
}

// DELETE TEACHER PROFILE
async function deleteTeacherProfile(userId) {
  const [result] = await db.query(
    "DELETE FROM teacher_profiles WHERE user_id = ?",
    [userId]
  );
  return result;
}

module.exports = {
  createTeacherProfile,
  getTeacherProfileByUserId,
  getTeacherProfileById,
  getAllTeacherProfiles,
  updateTeacherProfile,
  deleteTeacherProfile
};