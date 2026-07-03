require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files
app.use(express.static(path.join(__dirname, "public")));

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
const uploadRoute = require("./routes/upload");
app.use("/upload", uploadRoute);

// Home Page
app.get("/", (req, res) => {
    res.render("index");
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});