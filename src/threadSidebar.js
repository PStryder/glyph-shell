import * as Loom from './Loom.js';  // Import Loom for thread context and memory functions

// Select the DOM elements for thread list, import input, and thread header
const threadList = document.getElementById("thread-list");
const importInput = document.getElementById("import-thread");
const threadHeader = document.querySelector("#thread-sidebar h2");

// Variable to hold the ID of the currently selected thread
let selectedThreadId = null;

// Function to create a new thread element in the sidebar
function createThreadElement(thread) {
  const li = document.createElement("li");  // Create a list item element
  li.className = "bg-gray-700 p-2 rounded flex justify-between items-center cursor-pointer hover:bg-gray-600 group";  // Style the list item
  li.dataset.threadId = thread.id;  // Set the thread ID as a data attribute

  const span = document.createElement("span");  // Create a span for the thread name
  span.textContent = thread.name || "Unnamed Thread";  // Set the thread's name as the text content
  span.className = "truncate max-w-[60%]";  // Add styles to truncate the text if it's too long

  const actions = document.createElement("div");  // Create a div for action buttons
  actions.className = "flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity";  // Style the action buttons

  // Create a button to delete the thread
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑️";
  deleteBtn.title = "Delete";
  deleteBtn.className = "hover:text-red-400";
  deleteBtn.onclick = async (e) => {
    e.stopPropagation();  // Prevent event from bubbling up to the list item
    if (confirm("Are you sure you want to delete this thread?")) {  // Confirm deletion
      await Loom.appendToHistory({
        type: "covenant",
        subject: "Thread",
        action: "Deleted",
        result: `Thread "${thread.name}" deleted.`,
        timestamp: Date.now(),
      });  // Log the deletion in Loom history
      threadList.removeChild(li);  // Remove the list item from the sidebar
      if (selectedThreadId === thread.id) selectedThreadId = null;  // Clear the selected thread if it was the one deleted
    }
  };

  actions.appendChild(deleteBtn);  // Add the delete button to the actions container

  li.appendChild(span);  // Add the thread name to the list item
  li.appendChild(actions);  // Add the action buttons to the list item

  return li;  // Return the created list item
}

// Function to select a thread and load its messages from Loom.js
async function selectThread(li) {
  const threadId = parseInt(li.dataset.threadId);  // Get the thread ID from the data attribute
  console.log("🔁 selectThread invoked for:", threadId);

  // Retrieve the current memory or context for the selected thread from Loom
  const messages = await Loom.getContext(5);  // Get the most recent context (messages) from Loom
  console.log("📜 Loaded messages from Loom:", messages);

  // Display the messages in the chat log (now using Loom to handle memory and context)
  messages.forEach(msg => {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${msg.role === 'user' ? 'user' : 'assistant'}`;
    messageDiv.textContent = msg.content;
    document.getElementById('chat-log').appendChild(messageDiv);
  });

  if (selectedThreadId !== null) {  // If there's already a selected thread, remove the highlight
    const old = threadList.querySelector(`[data-thread-id='${selectedThreadId}']`);
    if (old) old.classList.remove("ring-2", "ring-purple-500", "ring-offset-2", "ring-offset-gray-800", "rounded");
  }

  selectedThreadId = threadId;  // Set the new thread as the selected thread
  li.classList.add("ring-2", "ring-purple-500", "ring-offset-2", "ring-offset-gray-800", "rounded");  // Highlight the selected thread
  console.log("✅ Thread selected visually");
}

// Function to create a new thread and select it
async function createNewThread() {
  const thread = { id: Date.now(), name: "New Thread", messages: [] };  // Create a simple thread object
  const li = createThreadElement(thread);  // Create a list item for the new thread
  threadList.insertBefore(li, threadList.firstChild);  // Add the new thread to the beginning of the list
  await selectThread(li);  // Select the newly created thread
}

// Function to load all threads from Loom.js and display them
async function loadAllThreads() {
  const threads = await Loom.getContext(5);  // Get the most recent context (threads) from Loom
  threadList.innerHTML = "";  // Clear the current thread list
  threads.forEach(thread => {
    const li = createThreadElement(thread);  // Create a list item for each thread
    threadList.appendChild(li);  // Add the thread to the list
  });
}

// When the DOM is loaded, initialize the thread sidebar
document.addEventListener("DOMContentLoaded", async () => {
  console.log("📦 DOM loaded. Initializing thread sidebar...");
  await loadAllThreads();  // Load all threads into the sidebar
});

