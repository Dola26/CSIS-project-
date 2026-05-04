# Resume Analyzer

A full-stack web application that analyzes a resume against a job description and surfaces actionable insights — match score, detected and missing skills, improvement suggestions, and keyword highlights.

---

## Features

- Match score calculation (percentage)
- Detected and missing skills identification
- Suggestions for improvement
- Highlighted keywords in resume text
- Animated progress bar with color coding
- Responsive design (mobile + desktop)
- Analysis results persisted to MongoDB

---

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | HTML5, CSS3, Vanilla JavaScript     |
| Backend  | Node.js, Express.js                 |
| Database | MongoDB (via Mongoose)              |

---

## Project Structure

```
CSIS_project/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection setup
│   ├── controllers/
│   │   └── analyzeController.js # Request handling logic
│   ├── models/
│   │   └── Analysis.js         # Mongoose schema for analysis results
│   ├── routes/
│   │   └── analyze.js          # API route definitions
│   ├── utils/
│   │   └── analyzer.js         # Core resume analysis logic
│   └── server.js               # Express app entry point
├── frontend/
│   ├── index.html              # Main UI
│   ├── style.css               # Styles and animations
│   └── script.js               # Frontend logic and API calls
├── package.json
└── README.md
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/) running locally on port `27017`, or a MongoDB Atlas connection string

---

## Initial Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd CSIS_project
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure the database**

   By default the app connects to `mongodb://localhost:27017/resume-analyzer`. To use a different database, set the `MONGODB_URI` environment variable:

   ```bash
   export MONGODB_URI="your-mongodb-connection-string"
   ```

---

## Running the Project

**Development mode** (auto-restarts on file changes):

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

The server starts on **http://localhost:3000** by default.  
Open that URL in your browser to use the application.

---

## API Endpoint

| Method | Path           | Description                        |
|--------|----------------|------------------------------------|
| POST   | `/api/analyze` | Analyze a resume against a job description |

**Request body:**

```json
{
  "resume": "your resume text here",
  "jobDescription": "job description text here"
}
```

---

## Skills Analyzed

Java, Python, JavaScript, SQL, AWS, React, Node.js
