const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getDirectory } = require("../controllers/adminController");
router.get("/students", authMiddleware, (req, res, next) => {
  if (!["admin", "faculty"].includes(req.user.Role)) return res.status(403).json({ message: "Faculty or Admin access required." });
  return getDirectory(req, res, next);
});
module.exports = router;
