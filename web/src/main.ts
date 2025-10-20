import './style.css';
import { chatApi, ApiError } from './api';
import type { AppState, ChatMessage } from './types';
import { ChatRole } from './types';
import { marked } from 'marked';

// Application state
const state: AppState = {
  username: '',
  messages: [],
  isLoading: false,
  error: null,
};

// DOM elements
const usernameInput = document.querySelector<HTMLInputElement>('#username')!;
const loadSessionBtn = document.querySelector<HTMLButtonElement>('#load-session')!;
const clearSessionBtn = document.querySelector<HTMLButtonElement>('#clear-session')!;
const messageHistory = document.querySelector<HTMLElement>('#message-history')!;
const mainContainer = document.querySelector<HTMLElement>('main')!;
const messageInput = document.querySelector<HTMLInputElement>('#message-input')!;
const sendBtn = document.querySelector<HTMLButtonElement>('#send-message')!;
const messageForm = document.querySelector<HTMLFormElement>('.input-group')!;

// Utility functions
function saveUsername(username: string): void {
  localStorage.setItem('podcastbot-username', username);
}

function loadUsername(): string {
  return localStorage.getItem('podcastbot-username') || '';
}

function showError(message: string): void {
  state.error = message;
  const errorLi = document.createElement('li');
  errorLi.className = 'system-message';
  errorLi.style.color = 'red';
  errorLi.textContent = `Error: ${message}`;
  messageHistory.appendChild(errorLi);
  scrollToBottom();
}


function displayMessage(message: ChatMessage): void {
  const messageLi = document.createElement('li');

  // Set CSS class based on role
  switch (message.role) {
    case ChatRole.USER:
      messageLi.className = 'message user-message';
      break;
    case ChatRole.PODBOT:
      messageLi.className = 'message bot-message';
      break;
    case ChatRole.SUMMARY:
      messageLi.className = 'message summary-message';
      break;
  }

  // Set content based on role
  if (message.role === ChatRole.USER) {
    const username = usernameInput.value.trim() || 'you';
    messageLi.innerHTML = `<span class="username">${username}></span> ${message.content}`;
  } else if (message.role === ChatRole.PODBOT) {
    const renderedContent = marked.parse(message.content);
    messageLi.innerHTML = `<span class="username">PodBot></span> ${renderedContent}`;
  } else if (message.role === ChatRole.SUMMARY) {
    messageLi.innerHTML = `<span class="username">Context></span> <em>${message.content}</em>`;
  }

  messageHistory.appendChild(messageLi);
  scrollToBottom();
}

function clearMessages(): void {
  const messages = messageHistory.querySelectorAll('.message, .system-message:not(:first-child)');
  messages.forEach(msg => msg.remove());
}

function scrollToBottom(): void {
  mainContainer.scrollTop = mainContainer.scrollHeight;
}

function setLoading(loading: boolean): void {
  state.isLoading = loading;
  sendBtn.disabled = loading;
  loadSessionBtn.disabled = loading;
  clearSessionBtn.disabled = loading;

  if (loading) {
    sendBtn.classList.add('loading');
  } else {
    sendBtn.classList.remove('loading');
  }
}

function updateButtonStates(): void {
  const hasUsername = usernameInput.value.trim().length > 0;
  loadSessionBtn.disabled = !hasUsername || state.isLoading;
  clearSessionBtn.disabled = !hasUsername || state.isLoading;
  sendBtn.disabled = !hasUsername || state.isLoading || messageInput.value.trim().length === 0;
}

// Event handlers
async function handleLoadSession(): Promise<void> {
  const username = usernameInput.value.trim();
  if (!username) {
    showError('Please enter a username');
    return;
  }

  state.username = username;
  saveUsername(username);
  setLoading(true);

  try {
    const sessionHistory = await chatApi.getSessionHistory(username);
    state.messages = sessionHistory;

    clearMessages();
    sessionHistory.forEach(displayMessage);
  } catch (error) {
    if (error instanceof ApiError) {
      showError(`Failed to load session: ${error.message}`);
    } else {
      showError('Failed to load session. Please check if the chat API is running.');
    }
  } finally {
    setLoading(false);
    updateButtonStates();
  }
}

async function handleClearSession(): Promise<void> {
  const username = usernameInput.value.trim();
  if (!username) {
    showError('Please enter a username');
    return;
  }

  if (!confirm(`Are you sure you want to clear the session for ${username}?`)) {
    return;
  }

  setLoading(true);

  try {
    await chatApi.clearSession(username);
    state.messages = [];
    clearMessages();
  } catch (error) {
    if (error instanceof ApiError) {
      showError(`Failed to clear session: ${error.message}`);
    } else {
      showError('Failed to clear session. Please check if the chat API is running.');
    }
  } finally {
    setLoading(false);
  }
}

async function handleSendMessage(): Promise<void> {
  const username = usernameInput.value.trim();
  const message = messageInput.value.trim();

  if (!username) {
    showError('Please enter a username');
    return;
  }

  if (!message) {
    return;
  }

  // Clear input immediately
  messageInput.value = '';
  setLoading(true);

  // Display user message
  const userMessage: ChatMessage = { role: ChatRole.USER, content: message };
  displayMessage(userMessage);

  try {
    const response = await chatApi.sendMessage(username, message);

    // Display bot response
    const botMessage: ChatMessage = { role: ChatRole.PODBOT, content: response.response };
    displayMessage(botMessage);

    // Update state
    state.messages = [...state.messages, userMessage, botMessage];
  } catch (error) {
    if (error instanceof ApiError) {
      showError(`Failed to send message: ${error.message}`);
    } else {
      showError('Failed to send message. Please check if the chat API is running.');
    }
  } finally {
    setLoading(false);
    updateButtonStates();
  }
}

function handleUsernameInput(): void {
  updateButtonStates();
}

function handleMessageInput(): void {
  updateButtonStates();
}

function handleKeyPress(event: KeyboardEvent): void {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    if (!sendBtn.disabled) {
      handleSendMessage();
    }
  }
}

function handleFormSubmit(event: Event): void {
  event.preventDefault();
  if (!sendBtn.disabled) {
    handleSendMessage();
  }
}

// Initialize application
function init(): void {
  // Load saved username
  const savedUsername = loadUsername();
  if (savedUsername) {
    usernameInput.value = savedUsername;
    state.username = savedUsername;
  }

  // Set up event listeners
  loadSessionBtn.addEventListener('click', handleLoadSession);
  clearSessionBtn.addEventListener('click', handleClearSession);
  sendBtn.addEventListener('click', handleSendMessage);
  messageForm.addEventListener('submit', handleFormSubmit);
  usernameInput.addEventListener('input', handleUsernameInput);
  messageInput.addEventListener('input', handleMessageInput);
  messageInput.addEventListener('keypress', handleKeyPress);

  // Initial button state update
  updateButtonStates();

  // Focus username input if empty, otherwise focus message input
  if (!savedUsername) {
    usernameInput.focus();
  } else {
    messageInput.focus();
  }
}

// Start the application
init();
