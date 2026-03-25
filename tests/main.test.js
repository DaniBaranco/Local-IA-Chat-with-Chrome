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

  // Ensure no theme in localStorage when tests start
  localStorage.clear();
});

describe('UI helpers', () => {
  let app;

  beforeEach(() => {
    jest.resetModules();
    app = require('../main.js');
  });

  afterEach(() => {
    app = null;
  });

  test('getTheme returns dark by default', () => {
    expect(app.getTheme()).toBe('dark');
  });

  test('applyTheme sets attribute and localStorage', () => {
    app.applyTheme('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
  });

  test('addToHistory adds item and marks active', () => {
    app.addToHistory('Prueba de historial');
    const item = document.querySelector('.history-item');
    expect(item).not.toBeNull();
    expect(item.textContent).toContain('Prueba de historial');
    expect(item.classList.contains('active')).toBe(true);
  });

  test('showEmpty hides and shows el', () => {
    app.showEmpty(true);
    expect(document.getElementById('emptyState').style.display).toBe('block');
    app.showEmpty(false);
    expect(document.getElementById('emptyState').style.display).toBe('none');
  });

  test('appendMessage escapes user content (no XSS)', () => {
    const malicious = '<img src=x onerror=alert(1)>Hola</img>';
    const textEl = app.appendMessage('user', malicious);
    expect(textEl.textContent).toBe(malicious);
    expect(textEl.innerHTML).toBe('&lt;img src=x onerror=alert(1)&gt;Hola&lt;/img&gt;');
  });
});
