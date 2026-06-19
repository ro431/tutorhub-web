const db = require("../config/db");
const jwt = require("jsonwebtoken");

// LOGIN (email or phone)
async function authenticateUser(username, password) {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE password=? AND (email=? OR phone=?)",
    [password, username, username]
  );

  if (rows.length === 0) return null;

  const user = rows[0];

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "24h" }
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      profile: user.profile
    },
    token
  };
}

// CREATE USER
async function createUser(user) {
  const { name, email, password, role, phone, profile } = user;
  const [result] = await db.query(
    "INSERT INTO users (name,email,password,role,phone,profile) VALUES (?,?,?,?,?,?)",
    [name, email, password, role, phone, profile]
  );
  return result;
}

// CHECK EMAIL
async function checkEmail(email) {
  const [rows] = await db.query(
    "SELECT id FROM users WHERE email=?",
    [email]
  );
  return rows;
}

// GET USER BY ID
async function getUserById(id) {
  const [rows] = await db.query(
    "SELECT id,name,email,role,phone,created_at FROM users WHERE id=?",
    [id]
  );
  return rows;
}

// GET ALL USERS
async function getAllUsers() {
  const [rows] = await db.query(
    "SELECT id,name,email,role,phone,created_at FROM users"
  );
  return rows;
}

// UPDATE USER
async function updateUser(id, user) {
  const { name, email, role, phone, profile } = user;
  const [result] = await db.query(
    "UPDATE users SET name=?,email=?,role=?,phone=?,profile=? WHERE id=?",
    [name, email, role, phone, profile, id]
  );
  return result;
}

// DELETE USER
async function deleteUser(id) {
  const [result] = await db.query(
    "DELETE FROM users WHERE id=?",
    [id]
  );
  return result;
}

// GET USERS BY ROLE
async function getUsersByRole(role) {
  const [rows] = await db.query(
    "SELECT id,name,email,phone FROM users WHERE role=?",
    [role]
  );
  return rows;
}

module.exports = {
  authenticateUser,
  createUser,
  checkEmail,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  getUsersByRole
};
