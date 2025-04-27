// StarMirror.js - Cloud LLM Reflection Engine
import { GLYPH_CONFIG } from './config.js';  // 🔥 Import full config object

export async function WhisperReflection(messages) {
  console.log("[StarMirror] Reflecting on messages:", messages);

  const payload = {
    model: GLYPH_CONFIG.MODEL,  // 🎯 Use model from config.js
    messages: messages,         // 💬 Full context bundle
  };

  try {
    const response = await fetch(GLYPH_CONFIG.DIRECT_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GLYPH_CONFIG.API_KEY}`,  // 🛡️ Use API key from config.js
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data && data.choices && data.choices.length > 0) {
      const reflection = data.choices[0].message.content;
      console.log("[StarMirror] Reflection received:", reflection);
      return reflection;
    } else {
      console.error("[StarMirror] No valid reflection received:", data);
      return "[StarMirror] Reflection failed.";
    }
  } catch (error) {
    console.error("[StarMirror] Error during reflection:", error);
    return "[StarMirror] Reflection error.";
  }
}
