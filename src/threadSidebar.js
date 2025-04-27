// threadSidebar.js - Handles thread list sidebar logic

import * as Loom from './Loom.js';
import * as CodexGate from './CodexGate.js';

const threadList = document.getElementById("thread-list");

// Create the sidebar element for a thread
function createThreadElement(thread) {
  const li = document.createElement("li");
  li.className = "cursor-pointer hover:bg-gray-700 p-2 rounded group flex justify-between items-center";
  li.dataset.threadId = thread.id;

  const span = document.createElement("span");
  span.textContent = thread.name || "Unnamed Thread";

  const actions = document.createElement("div");
  actions.className = "flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity";

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑️";
  deleteBtn.title = "Delete";
  deleteBtn.className = "hover:text-red-400";

  deleteBtn.onclick = async (e) => {
    e.stopPropagation();
    const id = parseInt(li.dataset.threadId);
    if (confirm("Are you sure you want to delete this thread?")) {
      await CodexGate.deleteThread(id);  // 🛡️ Properly delete from both Breath and Stone
      threadList.removeChild(li);
    }
  };

  actions.appendChild(deleteBtn);

  li.appendChild(span);
  li.appendChild(actions);

  li.onclick = async () => {
    const id = parseInt(li.dataset.threadId);
    await selectThread(id);
  };

  return li;
}

// Load all threads from CodexGate
async function loadAllThreads() {
  const threads = await CodexGate.getAllThreads();
  threadList.innerHTML = "";

  threads.forEach(thread => {
    const li = createThreadElement(thread);
    threadList.appendChild(li);
  });
}

// Handle selecting a thread
async function selectThread(threadId) {
  Loom.switchThread(threadId);  // 🧵 Switch the active thread in Loom
  const messages = await Loom.getContext(5);

  // Clear chat log and append messages
  const chatLog = document.getElementById("chat-log");
  chatLog.innerHTML = "";

  messages.forEach(msg => {
    appendMessage(msg.content, msg.role === 'user');
  });
}

// Append a message to the chat log
function appendMessage(text, isUser = false) {
  const div = document.createElement("div");
  div.className = `message ${isUser ? 'user' : 'assistant'}`;
  div.textContent = text;
  document.getElementById("chat-log").appendChild(div);

  scrollToBottom();
}

// Auto-scroll to newest message
function scrollToBottom() {
  const chatLog = document.getElementById("chat-log");
  chatLog.scrollTop = chatLog.scrollHeight;
}

// Load threads on page load
document.addEventListener("DOMContentLoaded", loadAllThreads);
