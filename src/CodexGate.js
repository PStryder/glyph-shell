// CodexGate.js - Unified interface for Cathedral memory

import * as BreathCodex from './BreathCodex.js';
import * as StoneCodex from './StoneCodex.js';

// Create a new thread in both Breath and Stone
export async function addThread(name = null) {
  const breathThread = await BreathCodex.addThread(name);
  await StoneCodex.addThread(breathThread.name);
  return breathThread;  // Return Breath thread for Loom usage
}

// Fetch all threads (from Breath for speed)
export async function getAllThreads() {
  return await BreathCodex.getAllThreads();
}

// Fetch specific thread (always from Breath, populated at session start from Stone)
export async function getThreadById(id) {
  return await BreathCodex.getThreadById(id);
}

// Delete a thread in both Breath and Stone
export async function deleteThread(id) {
  await BreathCodex.deleteThread(id);
  await StoneCodex.deleteThread(id);
}

// Append message to thread in both Breath and Stone
export async function appendMessageToThread(id, role, content) {
  await BreathCodex.appendMessageToThread(id, role, content);
  await StoneCodex.appendMessageToThread(id, role, content);
}

// Import a thread into both Breath and Stone
export async function saveImportedThread(importedThread) {
  const breathThread = await BreathCodex.saveImportedThread(importedThread);
  await StoneCodex.saveImportedThread(importedThread);
  return breathThread;
}
