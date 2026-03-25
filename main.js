/* ─── STATE ──────────────────────────────────────────────── */
let session = null;
let isReady = false;
let isThinking = false;
let chatHistory = []; // { id, firstMsg }

/* ─── DOM ────────────────────────────────────────────────── */
const chatArea    = document.querySelector("#chatArea");
const messagesEl  = document.querySelector("#messages");
const emptyState  = document.querySelector("#emptyState");
const userInput   = document.querySelector("#userInput");
const sendBtn     = document.querySelector("#sendBtn");
const statusDot   = document.querySelector("#statusDot");
const themeToggle = document.querySelector("#themeToggle");
const newChatBtn  = document.querySelector("#newChatBtn");
const historyList = document.querySelector("#historyList");
const sidebarEl   = document.querySelector(".sidebar");
const sidebarToggle = document.querySelector("#sidebarToggle");
const toastEl     = document.querySelector("#toast");

/* ─── THEME ──────────────────────────────────────────────── */
function getTheme() {
    return localStorage.getItem("theme") || "dark";
}

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    themeToggle.querySelector(".theme-icon").textContent = theme === "dark" ? "☀" : "☾";
    localStorage.setItem("theme", theme);
}

themeToggle.addEventListener("click", () => {
    const next = getTheme() === "dark" ? "light" : "dark";
    applyTheme(next);
});

applyTheme(getTheme());

/* ─── SIDEBAR TOGGLE (mobile) ────────────────────────────── */
sidebarToggle?.addEventListener("click", () => {
    sidebarEl.classList.toggle("open");
});

document.addEventListener("click", (e) => {
    if (sidebarEl.classList.contains("open") &&
        !sidebarEl.contains(e.target) &&
        e.target !== sidebarToggle) {
        sidebarEl.classList.remove("open");
    }
});

/* ─── TOAST ──────────────────────────────────────────────── */
let toastTimer;
function showToast(msg, duration = 3000) {
    clearTimeout(toastTimer);
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), duration);
}

/* ─── STATUS DOT ─────────────────────────────────────────── */
function setStatus(state, tip = "") {
    statusDot.className = "status-dot " + state;
    statusDot.title = tip;
}

/* ─── HISTORY ────────────────────────────────────────────── */
function addToHistory(text) {
    const id = Date.now();
    const entry = { id, label: text.slice(0, 42) + (text.length > 42 ? "…" : "") };
    chatHistory.unshift(entry);

    const li = document.createElement("li");
    li.className = "history-item active";
    li.textContent = entry.label;
    li.dataset.id = id;

    // deactivate previous
    historyList.querySelectorAll(".history-item").forEach(i => i.classList.remove("active"));
    historyList.prepend(li);
}

/* ─── MESSAGES ───────────────────────────────────────────── */
function showEmpty(visible) {
    emptyState.style.display = visible ? "block" : "none";
}

function appendMessage(role, text) {
    showEmpty(false);

    const wrap = document.createElement("div");
    wrap.className = "message " + role;

    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.textContent = role === "user" ? "Tú" : "✦";

    const content = document.createElement("div");
    content.className = "message-content";

    const roleLabel = document.createElement("div");
    roleLabel.className = "message-role";
    roleLabel.textContent = role === "user" ? "Tú" : "Gemini Nano";

    const textEl = document.createElement("div");
    textEl.className = "message-text";
    textEl.textContent = text;

    content.append(roleLabel, textEl);
    wrap.append(avatar, content);
    messagesEl.append(wrap);
    scrollToBottom();

    return textEl; // para poder actualizar el texto en streaming
}

function appendTyping() {
    showEmpty(false);

    const wrap = document.createElement("div");
    wrap.className = "message ai";
    wrap.id = "typingMsg";

    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.textContent = "✦";

    const content = document.createElement("div");
    content.className = "message-content";

    const roleLabel = document.createElement("div");
    roleLabel.className = "message-role";
    roleLabel.textContent = "Gemini Nano";

    const indicator = document.createElement("div");
    indicator.className = "typing-indicator";
    indicator.innerHTML = "<span></span><span></span><span></span>";

    content.append(roleLabel, indicator);
    wrap.append(avatar, content);
    messagesEl.append(wrap);
    scrollToBottom();

    return { wrap, indicator };
}

function scrollToBottom() {
    if (chatArea && typeof chatArea.scrollTo === 'function') {
        chatArea.scrollTo({ top: chatArea.scrollHeight, behavior: "smooth" });
    } else if (chatArea) {
        chatArea.scrollTop = chatArea.scrollHeight;
    }
}

/* ─── SEND ───────────────────────────────────────────────── */
async function sendMessage(text) {
    if (!text || isThinking || !isReady) return;

    isThinking = true;
    sendBtn.disabled = true;
    userInput.value = "";
    autoResize();

    // Si es el primer mensaje de esta conversación, añadir al historial
    if (messagesEl.children.length === 0) {
        addToHistory(text);
    }

    appendMessage("user", text);

    const { wrap: typingWrap, indicator } = appendTyping();

    try {
        const result = await session.prompt(text);

        // Reemplazar typing por respuesta real
        typingWrap.remove();
        appendMessage("ai", result);

    } catch (err) {
        typingWrap.remove();
        appendMessage("ai", "Lo siento, no pude generar una respuesta. Inténtalo de nuevo.");
        console.error(err);
    } finally {
        isThinking = false;
        sendBtn.disabled = userInput.value.trim() === "";
        userInput.focus();
    }
}

/* ─── INPUT AUTO-RESIZE ──────────────────────────────────── */
function autoResize() {
    userInput.style.height = "auto";
    userInput.style.height = Math.min(userInput.scrollHeight, 160) + "px";
}

userInput.addEventListener("input", () => {
    autoResize();
    sendBtn.disabled = userInput.value.trim() === "" || !isReady || isThinking;
});

userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        const text = userInput.value.trim();
        if (text) sendMessage(text);
    }
});

sendBtn.addEventListener("click", () => {
    const text = userInput.value.trim();
    if (text) sendMessage(text);
});

/* ─── SUGGESTIONS ────────────────────────────────────────── */
document.querySelectorAll(".suggestion-chip").forEach(btn => {
    btn.addEventListener("click", () => {
        const q = btn.dataset.q;
        sendMessage(q);
    });
});

/* ─── NEW CHAT ───────────────────────────────────────────── */
newChatBtn.addEventListener("click", () => {
    messagesEl.innerHTML = "";
    showEmpty(true);
    userInput.value = "";
    sendBtn.disabled = true;
    userInput.focus();

    historyList.querySelectorAll(".history-item").forEach(i => i.classList.remove("active"));
    sidebarEl.classList.remove("open");
});

/* ─── INIT AI ────────────────────────────────────────────── */
async function init() {
    setStatus("loading", "Inicializando IA local…");
    showToast("⏳ Inicializando Gemini Nano…", 5000);

    try {
        if (!("LanguageModel" in self)) {
            setStatus("error", "API no disponible en este navegador");
            showToast("❌ Esta versión de Chrome no soporta la API de IA local");
            return;
        }

        const avail = await LanguageModel.availability();

        if (avail === "unavailable") {
            setStatus("error", "Gemini Nano no disponible");
            showToast("❌ Gemini Nano no está disponible en este dispositivo");
            return;
        }

        session = await LanguageModel.create({
            monitor(m) {
                m.addEventListener("downloadprogress", (e) => {
                    const pct = Math.round(e.loaded * 100);
                    showToast(`⬇️ Descargando modelo: ${pct}%`, 3000);
                    setStatus("loading", `Descargando: ${pct}%`);
                });
            }
        });

        isReady = true;
        setStatus("ok", "Gemini Nano listo");
        showToast("✦ Gemini Nano listo");

    } catch (err) {
        console.error(err);
        setStatus("error", "Error al inicializar");
        showToast("❌ Error al cargar la IA: " + (err?.message || err));
    }
}

// In test environments (Jest), bypass model init to avoid external API dependency.
if (!(typeof process !== "undefined" && process.env.JEST_WORKER_ID)) {
    init();
}

// Export helpers for unit testing
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        getTheme,
        applyTheme,
        addToHistory,
        appendMessage,
        appendTyping,
        showEmpty,
        setStatus,
        showToast,
        sendMessage,
        autoResize,
        init,
    };
}
