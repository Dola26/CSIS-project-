const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const analyzeRoutes = require("./routes/analyze");

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

app.use("/api", analyzeRoutes);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
