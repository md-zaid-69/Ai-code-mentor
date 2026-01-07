import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/review", async (req, res) => {
  try {
    const { code, language } = req.body;

    const prompt = `
You are a senior-level software engineer.

Review the following ${language} code and provide:

1️⃣ A clear code quality rating (Better, Good, Normal, or Bad).
2️⃣ A step-by-step explanation of what the code does.
3️⃣ Detailed improvements and best practices.
4️⃣ Any bugs or logical issues, if present.
5️⃣ Any syntax or runtime errors, if present.
6️⃣ Clear fixes and recommendations for each identified issue.

Analyze it like a professional code review. Also provide a better and efficient code suggestion with an example of the entered code and please donot make the code more complex keep it simple as and when necessary.
Code:
${code}
`;
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
        }),
      }
    );

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || "No response";

    res.json({ reply: text });

  } 
  catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, "0.0.0.0", () => {
  console.log("✅ Server running on port 5000 (forced bind)");
});
