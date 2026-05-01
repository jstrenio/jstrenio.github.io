export default async function handler(req, res) {
  const { question } = req.body;

  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You answer questions about this portfolio." },
        { role: "user", content: question }
      ]
    })
  });

  const data = await r.json();

  res.json({
    answer: data.choices?.[0]?.message?.content
  });
}
