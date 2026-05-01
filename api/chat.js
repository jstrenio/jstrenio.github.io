let history = [];

async function ask() {
  const q = document.getElementById("q").value;

  history.push({ role: "user", content: q });

  const res = await fetch("https://YOUR-VERCEL.vercel.app/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: history })
  });

  const data = await res.json();

  history.push({ role: "assistant", content: data.answer });

  document.getElementById("out").textContent = data.answer;
}
