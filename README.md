# Genio Gemini Nano (Web)

Aplicación de chat local y offline (WebLLM) donde la IA se ejecuta en el equipo cliente.

## 🧠 Cómo funciona la app

1. El navegador carga `index.html` y `main.js`.
2. En `main.js`:
   - Inicializa estado y referencias DOM.
   - Gestiona el tema (alto/oscuro) con `localStorage`.
   - Atiende eventos:
     - `themeToggle`: cambia tema y guarda en localStorage.
     - `sidebarToggle`: oculta/abre el menú en móvil.
     - `sendBtn` + `Enter`: envía prompt al modelo.
     - `suggestion-chip`: envía preguntas sugeridas.
     - `newChatBtn`: limpia la sesión anterior y restablece estado.
3. `init()` lanza conexión con `LanguageModel` (API de WebLLM):
   - Verifica compatibilidad y disponibilidad.
   - Muestra el estado de descarga y listo.
   - Al estar `isReady`, habilita envío de mensajes.
4. `sendMessage(text)`:
   - Bloquea el botón para evitar reenvíos simultáneos (`isThinking`).
   - Agrega el mensaje del usuario al chat con `appendMessage('user', text)`.
   - Muestra indicador de escritura (`appendTyping`).
   - Llama `session.prompt(text)` y coloca la respuesta AI. 
   - En caso de error, muestra aviso friendly.
   - Mantiene historial local de conversación (`addToHistory`).

## 💬 Renderizado y seguridad de mensajes

- `appendMessage` crea elementos DOM y usa `textContent` para evitar inyección XSS.
- `messagesEl` se actualiza con mensajes `user` / `ai` y se hace scroll abajo con `scrollToBottom`.
- `appendTyping` añade un indicador visual de “AI escribiendo”.
- `showEmpty` muestra/oculta vista inicial.

## 📁 Estructura de archivos

- `index.html`: marcas principales, botones, contenedores y valores estáticos.
- `src/styles.css`: diseño responsivo, temas, componentes de chat.
- `src/main.js`: lógica completa de UI + lógica del flujo de IA.
- `tests/main.test.js`: pruebas de funciones y comportamiento.
- `tests/security.test.js`: prueba XSS de `appendMessage`.
- `package.json`: dependencias y scripts.
- `jest.config.js`: entorno y patrones de test.

## 🚀 Requisitos y ejecución

- **Navegador**: Chrome con soporte para Prompt API (experimental).
- **Desarrollo**: Si no hay soporte, usa modo mock automático.

### Ejecutar localmente

1. Inicia un servidor HTTP:
   ```bash
   python -m http.server 8000
   ```
2. Abre `http://localhost:8000` en el navegador.
3. La app detecta automáticamente si Gemini Nano está disponible; si no, activa modo desarrollo con respuestas simuladas.

### Tests

```bash
npm install
npm test
```

## 🧪 ¿Qué se prueba?

- `getTheme`/`applyTheme`: persistencia y aplicación de tema con `localStorage`.
- `addToHistory`: historial de conversaciones.
- `showEmpty`: control de estado de vista vacía.
- `appendMessage`: la entrada del usuario se maneja con `textContent`, no se renderea HTML (mitigación XSS).
- Prueba explícita de XSS: el texto con `<script>` no se ejecuta, se codifica.

## 🛡️ Seguridad

- No hay `eval`/`Function`/`document.write`.
- El contenido de usuario se renderiza con escape seguro en `appendMessage`.
- CSP recomendado: ajustar en producción añadiendo meta `Content-Security-Policy`.

## ⚙️ Notas de implementación

- `main.js` expone funciones para pruebas en Node (`module.exports`).
- `init()` se salta en `JEST_WORKER_ID` para evitar dependencia de `LanguageModel` en tests.


