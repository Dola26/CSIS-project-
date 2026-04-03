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

function getProgressColor(score) {
    if (score < 40) return "var(--red)";
    if (score <= 70) return "var(--yellow)";
    return "var(--green)";
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

function displayResults(data, resumeText) {
    matchScoreEl.textContent = `${data.matchScore}%`;

    progressBar.style.width = `${data.matchScore}%`;
    progressBar.style.backgroundColor = getProgressColor(data.matchScore);

    populateList(detectedSkillsEl, data.matchedSkills);
    populateList(missingSkillsEl, data.missingSkills);
    populateList(suggestionsEl, data.suggestions);

    highlightedResumeEl.innerHTML = highlightMatchedWords(resumeText, data.matchedSkills);

    resultsSection.classList.remove("hidden");
}

async function analyze() {
    const resumeText = resumeInput.value.trim();
    const jobText = jobInput.value.trim();

    errorMsg.classList.add("hidden");
    resultsSection.classList.add("hidden");

    if (!resumeText || !jobText) {
        errorMsg.textContent = "Please fill in both the resume and job description fields.";
        errorMsg.classList.remove("hidden");
        return;
    }

    analyzeBtn.textContent = "Analyzing...";
    analyzeBtn.disabled = true;

    try {
        const response = await fetch("/api/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                resume: resumeText,
                jobDescription: jobText
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Analysis failed");
        }

        displayResults(data, resumeText);
    } catch (error) {
        errorMsg.textContent = error.message;
        errorMsg.classList.remove("hidden");
    } finally {
        analyzeBtn.textContent = "Analyze Resume";
        analyzeBtn.disabled = false;
    }
}

analyzeBtn.addEventListener("click", analyze);
