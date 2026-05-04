const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema({
    resumeText: {
        type: String,
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    matchScore: {
        type: Number,
        required: true
    },
    matchedSkills: {
        type: [String],
        default: []
    },
    missingSkills: {
        type: [String],
        default: []
    },
    suggestions: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Analysis", analysisSchema);
