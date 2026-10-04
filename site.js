(function () {
  var root = document.documentElement;

  // Theme toggle (remembers choice; follows system setting by default)
  document.getElementById("theme").addEventListener("click", function () {
    var dark = root.getAttribute("data-theme") === "dark" ||
      (!root.getAttribute("data-theme") && matchMedia("(prefers-color-scheme: dark)").matches);
    var next = dark ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  // Mobile menu
  var menu = document.getElementById("menu"), links = document.getElementById("links");
  menu.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    menu.setAttribute("aria-expanded", open);
  });
  links.addEventListener("click", function () { links.classList.remove("open"); menu.setAttribute("aria-expanded", false); });

  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  // "Ask about my experience" (home page only)
  var q = document.getElementById("q"), out = document.getElementById("out"), send = document.getElementById("send");
  if (!q) return;
  async function ask() {
    var question = q.value.trim();
    if (!question) { out.textContent = "Enter a question first."; return; }
    send.disabled = true; out.textContent = "Thinking...";
    try {
      var res = await fetch("https://jstrenio-github-io.vercel.app/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question })
      });
      var data = await res.json();
      out.textContent = data.answer || "No response received. Try rephrasing your question.";
    } catch (e) {
      out.textContent = "Couldn\u2019t reach the assistant. Try again in a moment.";
    }
    send.disabled = false;
  }
  send.addEventListener("click", ask);
  q.addEventListener("keydown", function (e) { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") ask(); });
})();
