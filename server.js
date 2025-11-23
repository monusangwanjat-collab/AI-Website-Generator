import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/generate", async (req, res) => {
  const { apiKey, prompt } = req.body;

  if (!apiKey) {
    return res.status(400).json({ error: "API key missing" });
  }
  if (!prompt) {
    return res.status(400).json({ error: "Prompt (website description) missing" });
  }

  try {
    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
      apiKey;

    const body = {
      contents: [
        {
          parts: [
            {
              text:
                "You are an expert web developer. Generate a COMPLETE single HTML file (HTML + CSS + optional JS) for this website description:\n\n" +
                prompt +
                "\n\nReturn ONLY the code."
            }
          ]
        }
      ]
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
      // Forward Gemini error clearly to the frontend
      return res.status(response.status).json({
        error: data.error?.message || "Gemini API error",
        raw: data
      });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Backend running → http://localhost:3000");
});

