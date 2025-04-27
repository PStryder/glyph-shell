import * as Loom from './Loom.js';  // Import Loom for memory management
import * as Heart from './Heart.js';  // Import Heart for main processing
import * as Hymnal from './Hymnal.js';  // Import Hymnal for UI interaction
// This is the core function for handling input and output at the Altar (direct connection to Loom)
export async function processInput(inputText) {
  console.log("Altar.js - Input received:", inputText);
  // Step 1: Write input to Loom (memory is stored in-session)
  await Loom.appendToHistory({
    type: "input",
    role: "user",
    content: inputText,
    timestamp: Date.now(),
  });

  // Step 2: Pass input to Heart (which processes the message)
  const response = await Heart.processUserInput(inputText);  // Now calling Heart.js to process

  // Step 3: Write assistant's response to Loom (temporary) and CodexGate via Loom (permanent)
  await Loom.appendToHistory({
    type: "output",
    role: "assistant",
    content: response,
    timestamp: Date.now(),
  });

  // Step 4: Append assistant's message to the chat log
  appendMessage(response, false);
}

// Function to handle user input when they press "Send" or enter text (this can be linked to chat.js)
export async function handleUserInput() {
  const inputText = document.getElementById('chat-input').value.trim();
  if (inputText) {
    // Clear the input field
    document.getElementById('chat-input').value = '';

    // Send the input through the Alter process
    await processInput(inputText);
  }
}

// Set up event listener for the "Send" button
document.getElementById('send-button').addEventListener('click', handleUserInput);

// Set up event listener for pressing "Enter" to send input
document.getElementById('chat-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleUserInput();
  }
});
window.Altar = { processInput };
