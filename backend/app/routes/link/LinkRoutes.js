const express = require("express");
const linkController = require("../../controllers/link/LinkController");
const {
  validateLink,
  postLink,
  deleteLink,
  deleteLinks,
  getLinks,
  getLinkById,
  updateLink,
} = linkController;

const router = express.Router();

router.post("/", validateLink, postLink);
router.get("/", getLinks);
router.get("/:id", getLinkById);
router.put("/:id", updateLink);
router.delete("/:id", deleteLinks);
router.delete("/", deleteLink);

module.exports = router;
