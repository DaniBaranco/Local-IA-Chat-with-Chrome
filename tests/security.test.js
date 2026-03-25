/**
 * @jest-environment jsdom
 */

beforeEach(() => {
  document.body.innerHTML = `
    <div id="chatArea"></div>
    <div id="messages"></div>
    <div id="emptyState"></div>
    <textarea id="userInput"></textarea>
    <button id="sendBtn"></button>
    <div id="statusDot"></div>
    <button id="themeToggle"><span class="theme-icon"></span></button>
    <button id="newChatBtn"></button>
    <ul id="historyList"></ul>
    <aside class="sidebar"></aside>
    <div id="toast"></div>
  `;
  localStorage.clear();
});

test('para test de seguridad XSS, appendMessage nunca ejecuta HTML de input', () => {
  const app = require('../src/main.js');
  const payload = '<script>window.XSS=' + Math.random() + '</script>toto';

  const textEl = app.appendMessage('ai', payload);

  // El texto debe volver tal cual, pero sin interpretar HTML.
  expect(textEl.textContent).toBe(payload);
  expect(textEl.innerHTML).toContain('&lt;script&gt;');
  expect(window.XSS).toBeUndefined();
});
