const userService = require("../services/user.service");

/* ===============================
   SIGNUP
================================ */
async function createUser(req, res) {
  const { name, email, password, role, phone, profile } = req.body;

  return !(name && email && password && role && phone && profile)
    ? res.status(400).json({
      status: false,
      msg: "All fields are mandatory (Name, Email, Password, Role, Phone, Profile Picture)",
      data: { name, email, role, phone, profile }
    })
    : userService.checkEmail(email)
      .then(existing =>
        existing.length
          ? res.status(409).json({
            status: false,
            msg: "User already exists",
            data: existing
          })
          : userService.createUser(req.body).then(result =>
            res.status(201).json({
              status: true,
              msg: "User created successfully",
              data: result
            })
          )
      )
      .catch(err =>
        res.status(500).json({
          status: false,
          msg: err.message
        })
      );
}

/* ===============================
   LOGIN
================================ */
async function authenticateUser(req, res) {
  const { email, password } = req.body;

  return !(email && password)
    ? res.status(400).json({
      status: false,
      msg: "Email and password are required"
    })
    : userService.authenticateUser(email, password)
      .then(result =>
        !result
          ? res.status(401).json({
            status: false,
            msg: "Invalid credentials"
          })
          : res.status(200).json({
            status: true,
            msg: "Login successful",
            data: {
              user: result.user,
              token: result.token
            }
          })
      )
      .catch(err =>
        res.status(500).json({
          status: false,
          msg: err.message
        })
      );
}

/* ===============================
   CHECK EMAIL
================================ */
async function checkEmail(req, res) {
  return userService
    .checkEmail(req.params.email)
    .then(result =>
      res.json({
        status: true,
        msg: "Email check completed",
        data: result
      })
    )
    .catch(err =>
      res.status(500).json({
        status: false,
        msg: err.message
      })
    );
}

/* ===============================
   GET USER BY ID
================================ */
async function getUserById(req, res) {
  return userService
    .getUserById(req.params.id)
    .then(result =>
      result.length
        ? res.status(200).json({
          status: true,
          msg: "User fetched successfully",
          data: result
        })
        : res.status(404).json({
          status: false,
          msg: "User not found"
        })
    )
    .catch(err =>
      res.status(500).json({
        status: false,
        msg: err.message
      })
    );
}

/* ===============================
   GET ALL USERS
================================ */
async function getAllUsers(req, res) {
  return userService
    .getAllUsers()
    .then(result =>
      result.length
        ? res.status(200).json({
          status: true,
          msg: "Users fetched successfully",
          data: result
        })
        : res.status(404).json({
          status: false,
          msg: "No users found"
        })
    )
    .catch(err =>
      res.status(500).json({
        status: false,
        msg: err.message
      })
    );
}

/* ===============================
   UPDATE USER
================================ */
async function updateUser(req, res) {
  const { name, email, role, phone, profile } = req.body;

  return !(name && email && role && phone && profile)
    ? res.status(400).json({
      status: false,
      msg: "All fields are mandatory"
    })
    : userService.updateUser(req.params.id, req.body)
      .then(result =>
        res.json({
          status: true,
          msg: "User updated successfully",
          data: result
        })
      )
      .catch(err =>
        res.status(500).json({
          status: false,
          msg: err.message
        })
      );
}

/* ===============================
   DELETE USER
================================ */
async function deleteUser(req, res) {
  return userService
    .deleteUser(req.params.id)
    .then(result =>
      result.affectedRows
        ? res.status(200).json({
          status: true,
          msg: "User deleted successfully",
          data: result
        })
        : res.status(404).json({
          status: false,
          msg: "User not found"
        })
    )
    .catch(err =>
      res.status(500).json({
        status: false,
        msg: err.message
      })
    );
}

/* ===============================
   GET USERS BY ROLE
================================ */
async function getUsersByRole(req, res) {
  return userService
    .getUsersByRole(req.params.role)
    .then(result =>
      result.length
        ? res.status(200).json({
          status: true,
          msg: "Users fetched successfully",
          data: result
        })
        : res.status(404).json({
          status: false,
          msg: "No users found for this role"
        })
    )
    .catch(err =>
      res.status(500).json({
        status: false,
        msg: err.message
      })
    );
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
