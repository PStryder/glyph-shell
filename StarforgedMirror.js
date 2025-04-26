// StarforgedMirror.js - comms transceiver to remote GPT engines

import { openRouterKey } from './config.js';

const STARFORGED_API_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function WhisperReflection(prompt) {
  const payload = {
    model: "nvidia/nim-llama3-70b-instruct",
    messages: [{ role: "user", content: prompt }],
  };

  const response = await fetch(STARFORGED_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${openRouterKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function ScribeReflection(prompt) {
  // Same call, but you might add system prompts later for mythic stylization
  return await WhisperReflection(prompt);
}

export async function BindStarfire(params) {
  // Future expansion: Allow dynamic model swapping, system prompt setting, temp adjustment
  console.log("Starfire parameters updated:", params);
}
