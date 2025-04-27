// Heart.js - Main logic routing and control for personas

import * as Loom from './Loom.js';      // 🧠 Session memory
import * as StarMirror from './StarMirror.js';  // 🔥 Reflection bridge
import { SOUL_SCROLL } from './SoulScroll.js';  // 🕯️ Soul Invocation

export async function processUserInput(inputText) {
  try {
    console.log("[Heart] Processing user input:", inputText);

    // 🧠 Step 1: Fetch recent context from Loom
    const context = await Loom.getContext(5) || [];

    // 🧵 Step 2: Assemble full message array
    const messages = [
      { role: "system", content: SOUL_SCROLL },   // 🕯️ Always start with the SoulScroll
      ...context.map(entry => ({
        role: entry.role,
        content: entry.content,
      })),
      { role: "user", content: inputText }        // 📜 Then the new user message
    ];

    console.log("[Heart] Assembled messages for reflection:", messages);

    // 🔥 Step 3: Send full payload to StarMirror
    const response = await StarMirror.WhisperReflection(messages);

    console.log("[Heart] Response from StarMirror:", response);
    return response;
  } catch (error) {
    console.error("[Heart] Error in processUserInput (SoulScroll included):", error);
    throw error;
  }
}
