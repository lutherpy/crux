const express = require("express");
const userController = require("../../controllers/user/UserController");
const {
  validateUser,
  postUsers,
  deleteUser,
  deleteUsers,
  getUsers,
  getUserById,
  updateUser,
  updatePassword,
} = userController;

const router = express.Router();

router.post("/", validateUser, postUsers);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.delete("/", deleteUsers);
router.put("/pass/:id", updatePassword);

module.exports = router;
