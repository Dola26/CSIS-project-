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
const savedBtn = document.getElementById("savedBtn");
const savedSection = document.getElementById("savedSection");
const savedList = document.getElementById("savedList");
const savedError = document.getElementById("savedError");
const refreshBtn = document.getElementById("refreshBtn");

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

function getScoreClass(score) {
    if (score < 40) return "score-low";
    if (score <= 70) return "score-mid";
    return "score-high";
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleString();
}

function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function renderSavedAnalyses(analyses) {
    savedList.innerHTML = "";

    if (analyses.length === 0) {
        savedList.innerHTML = "<p class='no-saved'>No saved analyses yet. Run your first analysis above!</p>";
        return;
    }

    analyses.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "saved-card";

        card.innerHTML = `
            <div class="saved-card-header" data-index="${index}">
                <div class="saved-card-left">
                    <span class="saved-score ${getScoreClass(item.matchScore)}">${item.matchScore}%</span>
                    <span class="saved-date">${formatDate(item.createdAt)}</span>
                </div>
                <div class="saved-card-actions">
                    <button class="delete-btn" data-id="${item._id}" title="Delete">✕</button>
                    <span class="saved-chevron">▼</span>
                </div>
            </div>
            <div class="saved-card-body hidden">
                <div class="saved-texts-row">
                    <div class="saved-text-group">
                        <p class="saved-label">Resume</p>
                        <div class="saved-text-box">${escapeHtml(item.resumeText)}</div>
                    </div>
                    <div class="saved-text-group">
                        <p class="saved-label">Job Description</p>
                        <div class="saved-text-box">${escapeHtml(item.jobDescription)}</div>
                    </div>
                </div>
                <div class="saved-skills-row">
                    <div class="saved-skills-group">
                        <p class="saved-label">Matched Skills</p>
                        <div class="saved-tags">
                            ${item.matchedSkills.length
                                ? item.matchedSkills.map(s => `<span class="tag tag-green">${s}</span>`).join("")
                                : "<span class='tag-none'>None</span>"}
                        </div>
                    </div>
                    <div class="saved-skills-group">
                        <p class="saved-label">Missing Skills</p>
                        <div class="saved-tags">
                            ${item.missingSkills.length
                                ? item.missingSkills.map(s => `<span class="tag tag-red">${s}</span>`).join("")
                                : "<span class='tag-none'>None</span>"}
                        </div>
                    </div>
                </div>
                <div class="saved-suggestions">
                    <p class="saved-label">Suggestions</p>
                    <ul>
                        ${item.suggestions.map(s => `<li>${s}</li>`).join("")}
                    </ul>
                </div>
            </div>
        `;

        const header = card.querySelector(".saved-card-header");
        const body = card.querySelector(".saved-card-body");
        const chevron = card.querySelector(".saved-chevron");
        const deleteBtn = card.querySelector(".delete-btn");

        header.addEventListener("click", (e) => {
            if (e.target.closest(".delete-btn")) return;
            body.classList.toggle("hidden");
            chevron.textContent = body.classList.contains("hidden") ? "▼" : "▲";
        });

        deleteBtn.addEventListener("click", async (e) => {
            e.stopPropagation();
            const id = deleteBtn.dataset.id;
            deleteBtn.textContent = "…";
            deleteBtn.disabled = true;
            try {
                const res = await fetch(`/api/analyses/${id}`, { method: "DELETE" });
                if (!res.ok) throw new Error("Delete failed");
                card.remove();
                if (savedList.children.length === 0) {
                    savedList.innerHTML = "<p class='no-saved'>No saved analyses yet. Run your first analysis above!</p>";
                }
            } catch {
                deleteBtn.textContent = "✕";
                deleteBtn.disabled = false;
            }
        });

        savedList.appendChild(card);
    });
}

async function loadSavedAnalyses() {
    savedError.classList.add("hidden");
    savedList.innerHTML = "<p class='loading-text'>Loading...</p>";

    try {
        const response = await fetch("/api/analyses");
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to load saved analyses");
        }

        renderSavedAnalyses(data.analyses);
    } catch (error) {
        savedError.textContent = error.message;
        savedError.classList.remove("hidden");
        savedList.innerHTML = "";
    }
}

savedBtn.addEventListener("click", () => {
    const isHidden = savedSection.classList.contains("hidden");
    savedSection.classList.toggle("hidden");
    savedBtn.textContent = isHidden ? "Hide Saved" : "Saved Analyses";
    if (isHidden) loadSavedAnalyses();
});

refreshBtn.addEventListener("click", loadSavedAnalyses);
