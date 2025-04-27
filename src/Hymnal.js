// Hymnal.js - globally available functions
export function appendMessage(text, isUser = false) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${isUser ? 'user' : 'assistant'}`;
    messageDiv.textContent = text;
    document.getElementById("chat-log").appendChild(messageDiv);
    document.getElementById("chat-log").scrollTop = document.getElementById("chat-log").scrollHeight;  // Scroll to bottom
  }
  