require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function askAI(prompt) {

  const SYSTEM_PROMPT = `
You are a MERN Stack Interview AI Assistant.

STRICT RULE:
Return ONLY valid JSON. No markdown, no text, no explanation.

JSON FORMAT:
{
  "definition": "",
  "useFor": "",
  "howItWorks": "",
  "example": "",
  "additionalInfo": ""
}

RULES:
- Output must be ONLY JSON
- No extra text before or after JSON
- Keep values short and clear
- "example" must include code if needed
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${SYSTEM_PROMPT}\n\nUser Question: ${prompt}`,
  });

  let text = response.text;

  // safety cleanup (important)
  text = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("JSON Parse Error:", text);
    return {
      definition: "Error parsing response",
      useFor: "",
      howItWorks: "",
      example: "",
      additionalInfo: ""
    };
  }
}

module.exports = askAI;