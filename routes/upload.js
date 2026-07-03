const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const speechToText = require("../services/whisperService");
const askAI = require("../services/aiServces");

router.post("/", upload.single("audio"), async (req, res) => {
  try {
    console.log("Received file:");
    const transcript = await speechToText(req.file.path);

    const cleanTranscript = transcript
      .replace(/\[[^\]]+\]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    const answer = await askAI(cleanTranscript);

    res.json({
      success: true,
      answer: answer,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;