/* ─── ESTADO GLOBAL ──────────────────────────────────────────────── */
/* Variables que mantienen el estado de la aplicación */
let session = null; // Sesión activa de Gemini Nano
let isReady = false; // Indica si la IA está lista para responder
let isThinking = false; // Indica si la IA está procesando una respuesta
let chatHistory = []; // Array de objetos { id, firstMsg } para el historial de chats

/* ─── REFERENCIAS AL DOM ────────────────────────────────────────────────── */
/* Elementos HTML principales referenciados para manipulación */
const chatArea    = document.querySelector("#chatArea"); // Área principal del chat
const messagesEl  = document.querySelector("#messages"); // Contenedor de mensajes
const emptyState  = document.querySelector("#emptyState"); // Pantalla de bienvenida
const userInput   = document.querySelector("#userInput"); // Campo de entrada de texto
const sendBtn     = document.querySelector("#sendBtn"); // Botón de envío
const statusDot   = document.querySelector("#statusDot"); // Indicador de estado de la IA
const themeToggle = document.querySelector("#themeToggle"); // Botón de cambio de tema
const newChatBtn  = document.querySelector("#newChatBtn"); // Botón de nueva conversación
const historyList = document.querySelector("#historyList"); // Lista del historial
const sidebarEl   = document.querySelector(".sidebar"); // Elemento de la barra lateral
const sidebarToggle = document.querySelector("#sidebarToggle"); // Botón toggle de sidebar
const toastEl     = document.querySelector("#toast"); // Elemento de notificación toast
const progressOverlay = document.querySelector("#progressOverlay"); // Overlay de progreso
const progressFill = document.querySelector("#progressFill"); // Barra de progreso
const progressText = document.querySelector("#progressText"); // Texto del progreso

/* ─── GESTIÓN DE TEMAS ──────────────────────────────────────────────── */
/* Funciones para manejar el cambio entre tema oscuro y claro */

/**
 * Obtiene el tema actual desde localStorage
 * @returns {string} Tema actual ('dark' o 'light')
 */
function getTheme() {
    return localStorage.getItem("theme") || "dark";
}

/**
 * Aplica el tema especificado al documento y actualiza el icono del botón
 * @param {string} theme - Tema a aplicar ('dark' o 'light')
 */
function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    themeToggle.querySelector(".theme-icon").textContent = theme === "dark" ? "☀" : "☾";
    localStorage.setItem("theme", theme);
}

/* Event listener para el botón de cambio de tema */
themeToggle.addEventListener("click", () => {
    const next = getTheme() === "dark" ? "light" : "dark";
    applyTheme(next);
});

/* Aplicar el tema guardado al cargar la página */
applyTheme(getTheme());

/* ─── TOGGLE DE BARRA LATERAL (MÓVIL) ────────────────────────────── */
/* Funcionalidad para mostrar/ocultar la sidebar en dispositivos móviles */

/* Event listener para el botón de toggle de sidebar */
sidebarToggle?.addEventListener("click", () => {
    const isOpen = sidebarEl.classList.toggle("open");
    sidebarToggle.setAttribute("aria-expanded", isOpen);
});

/* Cerrar sidebar al hacer clic fuera de ella en móviles */
document.addEventListener("click", (e) => {
    if (sidebarEl.classList.contains("open") &&
        !sidebarEl.contains(e.target) &&
        e.target !== sidebarToggle) {
        sidebarEl.classList.remove("open");
        sidebarToggle.setAttribute("aria-expanded", "false");
    }
});

/* ─── NOTIFICACIONES TOAST ──────────────────────────────────────────────── */
/* Sistema de notificaciones temporales */

/* Variable para controlar el temporizador del toast */
let toastTimer;

/**
 * Muestra una notificación toast con mensaje y duración opcional
 * @param {string} msg - Mensaje a mostrar
 * @param {number} duration - Duración en milisegundos (por defecto 3000)
 */
function showToast(msg, duration = 3000) {
    clearTimeout(toastTimer);
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), duration);
}

/* ─── BARRA DE PROGRESO ────────────────────────────────────────── */
/* Funciones para mostrar el progreso de descarga del modelo */

/**
 * Muestra el overlay de progreso con título y descripción
 * @param {string} title - Título del progreso
 * @param {string} desc - Descripción del progreso
 */
function showProgress(title = "Descargando modelo de IA", desc = "Esto puede tomar unos minutos...") {
    document.querySelector("#progressTitle").textContent = title;
    document.querySelector("#progressDesc").textContent = desc;
    progressOverlay.classList.add("show");
    updateProgress(0);
}

/**
 * Oculta el overlay de progreso
 */
function hideProgress() {
    progressOverlay.classList.remove("show");
}

/**
 * Actualiza el porcentaje de progreso en la barra
 * @param {number} percent - Porcentaje de progreso (0-100)
 */
function updateProgress(percent) {
    const clamped = Math.max(0, Math.min(100, percent));
    progressFill.style.width = clamped + "%";
    progressText.textContent = clamped + "%";
    progressFill.setAttribute("aria-valuenow", clamped);
}

/* ─── INDICADOR DE ESTADO ─────────────────────────────────────────── */
/* Funciones para actualizar el punto indicador del estado de la IA */

/**
 * Establece el estado del indicador de puntos con clases y tooltip
 * @param {string} state - Estado ('ok', 'loading', 'error')
 * @param {string} tip - Texto del tooltip
 */
function setStatus(state, tip = "") {
    statusDot.className = "status-dot " + state;
    statusDot.title = tip;
}

/* ─── GESTIÓN DEL HISTORIAL ────────────────────────────────────────────── */
/* Funciones para manejar el historial de conversaciones */

/**
 * Añade una nueva entrada al historial de conversaciones
 * @param {string} text - Texto del primer mensaje de la conversación
 */
function addToHistory(text) {
    const id = Date.now(); // Usar timestamp como ID único
    const entry = { id, label: text.slice(0, 42) + (text.length > 42 ? "…" : "") };
    chatHistory.unshift(entry); // Añadir al inicio del array

    // Crear elemento de lista para la UI
    const li = document.createElement("li");
    li.className = "history-item active";
    li.textContent = entry.label;
    li.dataset.id = id;

    // Desactivar elementos anteriores y añadir el nuevo al inicio
    historyList.querySelectorAll(".history-item").forEach(i => i.classList.remove("active"));
    historyList.prepend(li);
}

    // deactivate previous
    historyList.querySelectorAll(".history-item").forEach(i => i.classList.remove("active"));
    historyList.prepend(li);
}

/* ─── GESTIÓN DE MENSAJES ───────────────────────────────────────────── */
/* Funciones para mostrar y gestionar los mensajes en el chat */

/**
 * Muestra u oculta el estado vacío (pantalla de bienvenida)
 * @param {boolean} visible - Si mostrar o no el estado vacío
 */
function showEmpty(visible) {
    emptyState.style.display = visible ? "block" : "none";
}

/**
 * Añade un mensaje al área de conversación
 * @param {string} role - Rol del mensaje ('user' o 'ai')
 * @param {string} text - Contenido del mensaje
 * @param {boolean} isError - Si el mensaje es un error
 * @returns {HTMLElement} Elemento del texto del mensaje para actualizaciones
 */
function appendMessage(role, text, isError = false) {
    showEmpty(false); // Ocultar estado vacío al añadir mensaje

    // Crear estructura del mensaje
    const wrap = document.createElement("div");
    wrap.className = "message " + role + (isError ? " error" : "");

    // Avatar del remitente
    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.textContent = role === "user" ? "Tú" : "✦";

    // Contenedor del contenido del mensaje
    const content = document.createElement("div");
    content.className = "message-content";

    // Etiqueta del rol
    const roleLabel = document.createElement("div");
    roleLabel.className = "message-role";
    roleLabel.textContent = role === "user" ? "Tú" : "Gemini Nano";

    // Texto del mensaje
    const textEl = document.createElement("div");
    textEl.className = "message-text";
    textEl.textContent = text;

    // Ensamblar la estructura
    content.append(roleLabel, textEl);
    wrap.append(avatar, content);
    messagesEl.append(wrap);
    scrollToBottom(); // Desplazar al final

    return textEl; // Retornar para posibles actualizaciones
}

/**
 * Añade un indicador de "escribiendo" mientras la IA responde
 * @returns {Object} Objeto con elementos wrap e indicator para control
 */
function appendTyping() {
    showEmpty(false); // Ocultar estado vacío

    // Crear estructura del mensaje de typing
    const wrap = document.createElement("div");
    wrap.className = "message ai";
    wrap.id = "typingMsg";

    // Avatar de la IA
    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.textContent = "✦";

    // Contenedor del contenido
    const content = document.createElement("div");
    content.className = "message-content";

    // Etiqueta del rol
    const roleLabel = document.createElement("div");
    roleLabel.className = "message-role";
    roleLabel.textContent = "Gemini Nano";

    // Indicador de typing (puntos animados)
    const indicator = document.createElement("div");
    indicator.className = "typing-indicator";
    indicator.innerHTML = "<span></span><span></span><span></span>";

    // Ensamblar y añadir al DOM
    content.append(roleLabel, indicator);
    wrap.append(avatar, content);
    messagesEl.append(wrap);
    scrollToBottom(); // Desplazar al final

    return { wrap, indicator };
}

/**
 * Desplaza el área de chat hasta el final para mostrar mensajes nuevos
 */
function scrollToBottom() {
    if (chatArea && typeof chatArea.scrollTo === 'function') {
        chatArea.scrollTo({ top: chatArea.scrollHeight, behavior: "smooth" });
    } else if (chatArea) {
        chatArea.scrollTop = chatArea.scrollHeight;
    }
}

/* ─── ENVÍO DE MENSAJES ───────────────────────────────────────────────── */
/* Función principal para enviar mensajes y obtener respuestas de la IA */

/**
 * Envía un mensaje del usuario y obtiene respuesta de la IA
 * @param {string} text - Texto del mensaje a enviar
 */
async function sendMessage(text) {
    if (!text || isThinking || !isReady) return; // Validaciones previas

    isThinking = true; // Bloquear nuevos envíos
    sendBtn.disabled = true; // Deshabilitar botón
    userInput.value = ""; // Limpiar input
    autoResize(); // Ajustar tamaño del textarea

    // Si es el primer mensaje, añadir al historial
    if (messagesEl.children.length === 0) {
        addToHistory(text);
    }

    // Mostrar mensaje del usuario
    appendMessage("user", text);

    // Mostrar indicador de typing
    const { wrap: typingWrap, indicator } = appendTyping();

    try {
        // Enviar mensaje a la IA y obtener respuesta
        const result = await session.prompt(text);

        // Reemplazar typing con respuesta real
        typingWrap.remove();
        appendMessage("ai", result);

    } catch (err) {
        // Manejar errores
        typingWrap.remove();
        appendMessage("ai", "Lo siento, no pude generar una respuesta. Inténtalo de nuevo.", true);
        console.error(err);
    } finally {
        // Limpiar estado
        isThinking = false;
        const isDisabled = userInput.value.trim() === "" || !isReady || isThinking;
        sendBtn.disabled = isDisabled;
        sendBtn.setAttribute("aria-disabled", isDisabled);
        userInput.focus(); // Enfocar input para siguiente mensaje
    }
}

/* ─── AUTO-RESIZE DEL INPUT ──────────────────────────────────── */
/* Funciones para ajustar automáticamente el tamaño del textarea */

/**
 * Ajusta la altura del textarea según su contenido
 */
function autoResize() {
    userInput.style.height = "auto"; // Resetear altura
    userInput.style.height = Math.min(userInput.scrollHeight, 160) + "px"; // Ajustar con límite máximo
}

/* Event listener para input: ajustar tamaño y estado del botón */
userInput.addEventListener("input", () => {
    autoResize();
    const isDisabled = userInput.value.trim() === "" || !isReady || isThinking;
    sendBtn.disabled = isDisabled;
    sendBtn.setAttribute("aria-disabled", isDisabled);
});

/* Event listener para tecla Enter: enviar mensaje */
userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        const text = userInput.value.trim();
        if (text) sendMessage(text);
    }
});

/* Event listener para clic en botón enviar */
sendBtn.addEventListener("click", () => {
    const text = userInput.value.trim();
    if (text) sendMessage(text);
});

/* ─── SUGERENCIAS ────────────────────────────────────────── */
/* Manejo de los botones de preguntas sugeridas */

/* Añadir event listeners a todos los botones de sugerencias */
document.querySelectorAll(".suggestion-chip").forEach(btn => {
    btn.addEventListener("click", () => {
        const q = btn.dataset.q; // Obtener pregunta del atributo data-q
        sendMessage(q); // Enviar la pregunta sugerida
    });
});

/* ─── NUEVA CONVERSACIÓN ───────────────────────────────────────────── */
/* Funcionalidad para iniciar una nueva conversación */

/* Event listener para el botón de nueva conversación */
newChatBtn.addEventListener("click", () => {
    messagesEl.innerHTML = ""; // Limpiar todos los mensajes
    showEmpty(true); // Mostrar estado vacío
    userInput.value = ""; // Limpiar input
    sendBtn.disabled = true; // Deshabilitar botón
    userInput.focus(); // Enfocar input

    // Desactivar elementos activos del historial
    historyList.querySelectorAll(".history-item").forEach(i => i.classList.remove("active"));
    sidebarEl.classList.remove("open"); // Cerrar sidebar si está abierta
});

/* ─── INICIALIZACIÓN DE LA IA ────────────────────────────────────────────── */
/* Función para inicializar Gemini Nano o modo mock para desarrollo */

/**
 * Inicializa la sesión de IA, descargando el modelo si es necesario
 */
async function init() {
    setStatus("loading", "Inicializando IA local…"); // Actualizar estado
    showToast("⏳ Inicializando Gemini Nano…", 5000); // Notificación

    try {
        // Verificar si LanguageModel API está disponible
        if (!("LanguageModel" in self)) {
            // Modo desarrollo: usar sesión mock para testing
            console.warn("LanguageModel no disponible. Usando modo mock para desarrollo.");
            session = {
                prompt: async (text) => {
                    // Simular delay de respuesta
                    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
                    // Respuestas mock basadas en el input
                    const responses = [
                        `Entiendo tu pregunta sobre "${text}". Como IA local, puedo procesar esto sin enviar datos.`,
                        `Sobre "${text}": Esta es una respuesta simulada. En producción, usaría Gemini Nano.`,
                        `Pregunta: "${text}". Respuesta: ¡Hola! Soy una IA local funcionando en modo desarrollo.`,
                        `Has preguntado: "${text}". Esto demuestra que el envío funciona correctamente.`,
                    ];
                    return responses[Math.floor(Math.random() * responses.length)];
                }
            };
            isReady = true;
            setStatus("ok", "Modo desarrollo listo");
            showToast("🔧 Modo desarrollo: IA mock activa");
            return;
        }

        // Verificar disponibilidad de Gemini Nano
        const avail = await LanguageModel.availability();

        if (avail === "unavailable") {
            setStatus("error", "Gemini Nano no disponible");
            showToast("❌ Gemini Nano no está disponible en este dispositivo");
            return;
        }

        // Mostrar progreso de descarga
        showProgress();

        // Crear sesión con monitor de progreso
        session = await LanguageModel.create({
            monitor(m) {
                m.addEventListener("downloadprogress", (e) => {
                    const pct = Math.round(e.loaded * 100);
                    updateProgress(pct);
                    setStatus("loading", `Descargando: ${pct}%`);
                });
            }
        });

        // Ocultar progreso y actualizar estado
        hideProgress();
        isReady = true;
        setStatus("ok", "Gemini Nano listo");
        showToast("✦ Gemini Nano listo");

    } catch (err) {
        // Manejar errores de inicialización
        hideProgress();
        console.error(err);
        setStatus("error", "Error al inicializar");
        showToast("❌ Error al cargar la IA: " + (err?.message || err));
    }
}

// Evitar inicialización en entornos de test (Jest)
if (!(typeof process !== "undefined" && process.env.JEST_WORKER_ID)) {
    init();
}

        session = await LanguageModel.create({
            monitor(m) {
                m.addEventListener("downloadprogress", (e) => {
                    const pct = Math.round(e.loaded * 100);
                    updateProgress(pct);
                    setStatus("loading", `Descargando: ${pct}%`);
                });
            }
        });

        hideProgress();
        isReady = true;
        setStatus("ok", "Gemini Nano listo");
        showToast("✦ Gemini Nano listo");

    } catch (err) {
        hideProgress();
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
// Exportar funciones auxiliares para pruebas unitarias
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
        showProgress,
        hideProgress,
        updateProgress,
        sendMessage,
        autoResize,
        init,
    };
}
