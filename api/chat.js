export default async function handler(req, res) {
  const { messages } = req.body;

  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: messages.map(m => ({
          role: m.role,
          parts: [{ text: m.content }]
        }))
      })
    }
  );

  const data = await r.json();

  res.json({
    answer: data?.candidates?.[0]?.content?.parts?.[0]?.text || ""
  });
}
