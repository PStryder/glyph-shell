//SpiritGate.js - Bridge between Hexy and SpindleHeart - main shell console for Hexy

// Placeholder for chatlog messages (replace with actual data source)
let chatlog = [];

// Function to send the interpreted command (as Hexy)
function sendMessage(commandText) {
    const inputField = document.getElementById("prompt-input");

    // Set the input field to the processed command (Hexy's response)
    inputField.value = commandText;

    // Trigger the 'Send' button click to send the message
    document.getElementById("send-button").click();
}

// Function to process Hexy’s command with SpindleHeart (backend/API)
function processCommandWithSpindleHeart(commandText) {
    // Simulate an API call to SpindleHeart for interpretation and processing
    console.log("Sending command to SpindleHeart for processing: ", commandText);

    // Simulating the API response with a timeout
    setTimeout(() => {
        // Example output that SpindleHeart might return after processing
        const spindleOutput = `Processed command: ${commandText} executed successfully.`;

        // Now, directly paste the processed output into the input field and send it
        sendMessage(spindleOutput); // Paste response into input and "send"
    }, 1000); // Simulate processing time (adjust as needed)
}

// Function to observe the chatlog for new Hexy output
function observeChatlog() {
    const chatlogContainer = document.getElementById("chatlog");

    // Create a MutationObserver to watch for new messages from Hexy
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.type === "childList") {
                const latestMessage = chatlog[chatlog.length - 1];

                // If Hexy sends a message, trigger the capture for processing
                if (latestMessage && latestMessage.includes("Hexy:")) {
                    // Capture Hexy’s response as a command (excluding the "Hexy:" prefix)
                    const responseCommand = latestMessage.replace("Hexy:", "").trim();

                    // Send the captured command to SpindleHeart for processing
                    processCommandWithSpindleHeart(responseCommand);
                }
            }
        });
    });

    observer.observe(chatlogContainer, { childList: true, subtree: true });
}

// Initialize the system and start watching chatlog
observeChatlog();

// Example of Hexy output to trigger the system (this would be dynamic in real use)
chatlog.push("Hexy: Ready to process the command!");
