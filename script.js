const SKILLS = ["java", "python", "javascript", "sql", "aws", "react", "node"];

const resumeInput = document.getElementById("resumeInput");
const jobInput = document.getElementById("jobInput");
const analyzeBtn = document.getElementById("analyzeBtn");
const errorMsg = document.getElementById("errorMsg");
const resultsSection = document.getElementById("resultsSection");
const matchScoreEl = document.getElementById("matchScore");
const progressBar = document.getElementById("progressBar");
const detectedSkillsEl = document.getElementById("detectedSkills");
const missingSkillsEl = document.getElementById("missingSkills");
const suggestionsEl = document.getElementById("suggestions");
const highlightedResumeEl = document.getElementById("highlightedResume");

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

function calculateMatchScore(matchedCount) {
    return Math.round((matchedCount / SKILLS.length) * 100);
}

function getProgressColor(score) {
    if (score < 40) return "var(--red)";
    if (score <= 70) return "var(--yellow)";
    return "var(--green)";
}

function generateSuggestions(matched, missing, score) {
    const suggestions = [];

    if (missing.length > 0) {
        suggestions.push(
            `Add the following skills to your resume: ${missing.join(", ")}`
        );
    }

    if (score < 40) {
        suggestions.push(
            "Your resume has low alignment with this job. Consider tailoring it more closely to the job description."
        );
    } else if (score < 70) {
        suggestions.push(
            "Good start! Add more relevant keywords from the job description to improve your match."
        );
    } else {
        suggestions.push(
            "Great match! Your resume aligns well with the job requirements."
        );
    }

    if (matched.length === 0) {
        suggestions.push(
            "No predefined skills were detected. Make sure to explicitly list your technical skills."
        );
    }

    suggestions.push(
        "Use quantifiable achievements (e.g., 'Improved performance by 30%') to strengthen your resume."
    );

    return suggestions;
}

function highlightMatchedWords(text, matchedSkills) {
    if (matchedSkills.length === 0) return text;

    let highlighted = text;
    matchedSkills.forEach((skill) => {
        const regex = new RegExp(`(${skill})`, "gi");
        highlighted = highlighted.replace(regex, "<mark>$1</mark>");
    });
    return highlighted;
}

function populateList(element, items) {
    element.innerHTML = "";
    if (items.length === 0) {
        const li = document.createElement("li");
        li.textContent = "None";
        element.appendChild(li);
        return;
    }
    items.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        element.appendChild(li);
    });
}

function displayResults(matched, missing, score, resumeText) {
    matchScoreEl.textContent = `${score}%`;

    progressBar.style.width = `${score}%`;
    progressBar.style.backgroundColor = getProgressColor(score);

    populateList(detectedSkillsEl, matched);
    populateList(missingSkillsEl, missing);

    const suggestions = generateSuggestions(matched, missing, score);
    populateList(suggestionsEl, suggestions);

    highlightedResumeEl.innerHTML = highlightMatchedWords(resumeText, matched);

    resultsSection.classList.remove("hidden");
}

function analyze() {
    const resumeText = resumeInput.value.trim();
    const jobText = jobInput.value.trim();

    errorMsg.classList.add("hidden");
    resultsSection.classList.add("hidden");

    if (!resumeText || !jobText) {
        errorMsg.textContent = "Please fill in both the resume and job description fields.";
        errorMsg.classList.remove("hidden");
        return;
    }

    const resumeWords = processText(resumeText);
    const matched = findMatchedSkills(resumeWords);
    const missing = SKILLS.filter((skill) => !matched.includes(skill));
    const score = calculateMatchScore(matched.length);

    displayResults(matched, missing, score, resumeText);
}

analyzeBtn.addEventListener("click", analyze);
