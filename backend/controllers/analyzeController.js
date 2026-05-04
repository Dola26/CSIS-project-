const Analysis = require("../models/Analysis");
const { analyze } = require("../utils/analyzer");

exports.getAnalyses = async (req, res) => {
    try {
        const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
        const analyses = await Analysis.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        res.status(200).json({ analyses });
    } catch (error) {
        console.error("Fetch analyses error:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.deleteAnalysis = async (req, res) => {
    try {
        if (!req.params.id.match(/^[a-f\d]{24}$/i)) {
            return res.status(400).json({ error: "Invalid ID" });
        }
        const deleted = await Analysis.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: "Analysis not found" });
        }
        res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        console.error("Delete analysis error:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.analyzeResume = async (req, res) => {
    try {
        const { resume, jobDescription } = req.body;

        if (!resume || !jobDescription) {
            return res.status(400).json({ error: "Both resume and job description are required" });
        }

        if (resume.trim().length === 0 || jobDescription.trim().length === 0) {
            return res.status(400).json({ error: "Resume and job description cannot be empty" });
        }

        const result = analyze(resume, jobDescription);

        const analysis = new Analysis({
            resumeText: resume,
            jobDescription: jobDescription,
            matchScore: result.matchScore,
            matchedSkills: result.matchedSkills,
            missingSkills: result.missingSkills,
            suggestions: result.suggestions
        });

        await analysis.save();

        res.status(200).json({
            matchScore: result.matchScore,
            matchedSkills: result.matchedSkills,
            missingSkills: result.missingSkills,
            suggestions: result.suggestions,
            createdAt: analysis.createdAt
        });
    } catch (error) {
        console.error("Analysis error:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
