// Hymnal.js - globally available Cathedral utilities

// Append a message to the chat log
export function appendMessage(text, isUser = false) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${isUser ? 'user' : 'assistant'}`;
  messageDiv.textContent = text;
  document.getElementById("chat-log").appendChild(messageDiv);
  scrollToBottom();  // Auto-scroll to newest after appending
}

// Clear the entire chat log (e.g., when switching threads)
export function clearChat() {
  const chatLog = document.getElementById("chat-log");
  chatLog.innerHTML = '';
  console.log("[Hymnal] Chat log cleared.");
}

// Smooth scroll to the bottom of the chat log
export function scrollToBottom() {
  const chatLog = document.getElementById("chat-log");
  chatLog.scrollTop = chatLog.scrollHeight;
}

// Display an invocation message (ritual events, system status, etc.)
export function displayInvocation(message) {
  const invocationDiv = document.createElement("div");
  invocationDiv.className = "message assistant italic opacity-70";  // Special styling for invocations
  invocationDiv.textContent = message;
  document.getElementById("chat-log").appendChild(invocationDiv);
  scrollToBottom();
}

// Confirm a critical action with a ritual prompt
export function confirmAction(promptText = "Are you sure you wish to proceed?") {
  return window.confirm(`🛡️ Covenant Check: ${promptText}`);
}
