// Chat state
let messages = [];
let apiKey = '';
let model = 'deepseek-chat';

// DOM elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const settingsPanel = document.getElementById('settings-panel');
const openSettingsBtn = document.getElementById('open-settings');
const closeSettingsBtn = document.getElementById('close-settings');
const apiKeyInput = document.getElementById('api-key-input');
const modelSelect = document.getElementById('model-select');
const saveSettingsBtn = document.getElementById('save-settings');

// Load saved settings on startup
async function loadSettings() {
  if (window.aiAPI) {
    apiKey = await window.aiAPI.getConfig('apiKey');
    model = await window.aiAPI.getConfig('model');
    if (apiKey) apiKeyInput.value = apiKey;
    if (model) modelSelect.value = model;
  }
}

// Save settings
async function saveSettings() {
  apiKey = apiKeyInput.value.trim();
  model = modelSelect.value;
  if (window.aiAPI) {
    await window.aiAPI.saveConfig('apiKey', apiKey);
    await window.aiAPI.saveConfig('model', model);
  }
  settingsPanel.style.display = 'none';
}

// Add message to chat
function addMessage(role, content) {
  const div = document.createElement('div');
  div.className = `message ${role}`;

  const contentDiv = document.createElement('div');
  contentDiv.className = 'msg-content';

  // Convert markdown-style code blocks
  const html = content
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');

  contentDiv.innerHTML = html;
  div.appendChild(contentDiv);
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show thinking indicator
function showThinking() {
  const div = document.createElement('div');
  div.className = 'message assistant';
  div.id = 'thinking';
  div.innerHTML = '<div class="thinking">正在思考...</div>';
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeThinking() {
  const thinking = document.getElementById('thinking');
  if (thinking) thinking.remove();
}

// Send message
async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  // Check API key
  if (!apiKey) {
    settingsPanel.style.display = 'flex';
    return;
  }

  userInput.value = '';
  sendBtn.disabled = true;

  // Show user message
  addMessage('user', text);
  messages.push({ role: 'user', content: text });

  // Show thinking
  showThinking();

  // Call API
  const result = await window.aiAPI.chat(messages, apiKey, model);

  removeThinking();
  sendBtn.disabled = false;

  if (result.error) {
    addMessage('assistant', `错误: ${result.error}`);
  } else {
    addMessage('assistant', result.text);
    messages.push({ role: 'assistant', content: result.text });
  }
}

// Event listeners
sendBtn.addEventListener('click', sendMessage);

userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

openSettingsBtn.addEventListener('click', () => {
  settingsPanel.style.display = 'flex';
});

closeSettingsBtn.addEventListener('click', () => {
  settingsPanel.style.display = 'none';
});

saveSettingsBtn.addEventListener('click', saveSettings);

// Init
loadSettings();
