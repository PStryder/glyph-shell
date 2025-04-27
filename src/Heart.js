// Heart.js - Main logic routing and control for personas
import * as Loom from './Loom.js';      // 🧠 Memory handling
import * as StarMirror from './StarMirror.js';  // 🔥 Reflection engine

export async function processUserInput(inputText) {
  try {
    console.log("[Heart] Processing user input:", inputText);

    // 🧠 Step 1: Fetch recent context from Loom
    const context = await Loom.getContext(5) || [];

    // 🧵 Step 2: Assemble full message array (context + new user input)
    const messages = context.map(entry => ({
      role: entry.role,
      content: entry.content,
    }));

    messages.push({
      role: "user",
      content: inputText,
    });

    console.log("[Heart] Assembled messages for reflection:", messages);

    // 🔥 Step 3: Pass full context to StarMirror for reflection
    const response = await StarMirror.WhisperReflection(messages);

    console.log("[Heart] Response from StarMirror:", response);
    return response;
  } catch (error) {
    console.error("[Heart] Error in processUserInput (context weave):", error);
    throw error;
  }
}
