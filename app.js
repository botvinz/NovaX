const API = "http://localhost:8000";
const chatBox = document.getElementById("chatBox");
const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");

// Cek koneksi ke NovaX API
async function checkStatus() {
  try {
    const res = await fetch(`${API}/history`);
    if (res.ok) {
      statusDot.className = "dot online";
      statusText.textContent = "NOVAX ONLINE";
    }
  } catch {
    statusDot.className = "dot offline";
    statusText.textContent = "API OFFLINE — jalanin novax.py dulu";
  }
}

checkStatus();
setInterval(checkStatus, 5000);

// Append pesan ke chatbox
function appendMsg(role, content) {
  const wrap = document.createElement("div");
  wrap.className = `msg ${role === "user" ? "user-msg" : "novax-msg"}`;

  const tag = document.createElement("div");
  tag.className = "msg-tag";
  tag.textContent = role === "user" ? "LU" : "NOVAX";

  const body = document.createElement("div");
  body.className = "msg-content";
  body.textContent = content;

  wrap.appendChild(tag);
  wrap.appendChild(body);
  chatBox.appendChild(wrap);
  chatBox.scrollTop = chatBox.scrollHeight;

  return wrap;
}

// Thinking indicator
function showThinking() {
  const wrap = document.createElement("div");
  wrap.className = "msg thinking-msg";
  wrap.id = "thinkingIndicator";

  const tag = document.createElement("div");
  tag.className = "msg-tag";
  tag.textContent = "NOVAX";

  const body = document.createElement("div");
  body.className = "msg-content";
  body.textContent = "memproses...";

  wrap.appendChild(tag);
  wrap.appendChild(body);
  chatBox.appendChild(wrap);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeThinking() {
  const el = document.getElementById("thinkingIndicator");
  if (el) el.remove();
}

// Kirim pesan
async function sendMessage() {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (!text) return;

  appendMsg("user", text);
  input.value = "";
  showThinking();

  try {
    const res = await fetch(`${API}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, reset: false })
    });

    const data = await res.json();
    removeThinking();
    appendMsg("novax", data.reply);

  } catch {
    removeThinking();
    appendMsg("novax", "❌ Koneksi ke NovaX gagal. Pastiin server jalan di localhost:8000");
  }
}

// Reset chat
async function resetChat() {
  try {
    await fetch(`${API}/reset`);
  } catch {}

  chatBox.innerHTML = "";
  appendMsg("novax", "Memory direset. Mulai dari awal. Tanya apa aja.");
}

// Enter to send, Shift+Enter new line
function handleKey(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}
