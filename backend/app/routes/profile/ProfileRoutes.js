const express = require("express");
const profileController = require("../../controllers/profile/ProfileController");
const {
  validateProfile,
  postProfiles,
  deleteProfile,
  deleteProfiles,
  getProfiles,
  getProfileById,
  updateProfile,
} = profileController;

const router = express.Router();

router.post("/", validateProfile, postProfiles);
router.get("/", getProfiles);
router.get("/:id", getProfileById);
router.put("/:id", updateProfile);
router.delete("/:id", deleteProfile);
router.delete("/", deleteProfiles);

module.exports = router;
