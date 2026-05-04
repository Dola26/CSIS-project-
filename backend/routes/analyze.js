const express = require("express");
const router = express.Router();
const { analyzeResume, getAnalyses, deleteAnalysis } = require("../controllers/analyzeController");

router.get("/analyses", getAnalyses);
router.post("/analyze", analyzeResume);
router.delete("/analyses/:id", deleteAnalysis);

module.exports = router;
