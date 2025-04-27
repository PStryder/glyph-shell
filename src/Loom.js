// Loom.js - Working memory (Breath) management

import * as CodexGate from './CodexGate.js';

let activeThreadId = null;

// Switch to a different thread
export function switchThread(id) {
  activeThreadId = id;
  console.log(`[Loom] Switched to thread ${id}`);
}

// Get recent context from active thread
export async function getContext(limit = 5) {
  if (!activeThreadId) {
    console.warn("[Loom] No active thread selected!");
    return [];
  }

  const thread = await CodexGate.getThreadById(activeThreadId);
  if (!thread || !thread.messages) {
    console.warn(`[Loom] Failed to fetch thread ${activeThreadId}`);
    return [];
  }

  // Return the last 'limit' messages
  return thread.messages.slice(-limit);
}

// Append a memory (message) to the active thread
export async function appendMemory(role, content) {
  if (!activeThreadId) {
    console.error("[Loom] Cannot append memory: No active thread selected.");
    return;
  }
  await CodexGate.appendMessageToThread(activeThreadId, role, content);
  console.log(`[Loom] Appended memory to thread ${activeThreadId}: ${role}: ${content}`);
}
