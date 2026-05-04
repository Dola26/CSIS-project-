const SKILLS = ["java", "python", "javascript", "sql", "aws", "react", "node"];

function processText(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter((word) => word.length > 0);
}

function findMatchedSkills(words) {
    return SKILLS.filter((skill) => words.includes(skill));
}

function calculateMatchScore(matchedCount, totalSkills) {
    return Math.round((matchedCount / totalSkills) * 100);
}

function generateSuggestions(matched, missing, score) {
    const suggestions = [];

    if (missing.length > 0) {
        suggestions.push(`Add the following skills to your resume: ${missing.join(", ")}`);
    }

    if (score < 40) {
        suggestions.push("Your resume has low alignment with this job. Consider tailoring it more closely to the job description.");
    } else if (score < 70) {
        suggestions.push("Good start! Add more relevant keywords from the job description to improve your match.");
    } else {
        suggestions.push("Great match! Your resume aligns well with the job requirements.");
    }

    if (matched.length === 0) {
        suggestions.push("No predefined skills were detected. Make sure to explicitly list your technical skills.");
    }

    suggestions.push("Use quantifiable achievements (e.g., 'Improved performance by 30%') to strengthen your resume.");

    return suggestions;
}

function analyze(resumeText, jobDescription) {
    const resumeWords = processText(resumeText);
    const jobWords = processText(jobDescription);

    const jobSkills = SKILLS.filter((skill) => jobWords.includes(skill));
    const matchedSkills = jobSkills.filter((skill) => resumeWords.includes(skill));
    const missingSkills = jobSkills.filter((skill) => !resumeWords.includes(skill));

    const matchScore = calculateMatchScore(matchedSkills.length, jobSkills.length || SKILLS.length);
    const suggestions = generateSuggestions(matchedSkills, missingSkills, matchScore);

    return {
        matchScore,
        matchedSkills,
        missingSkills,
        suggestions
    };
}

module.exports = { analyze };
