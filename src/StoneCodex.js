// StoneCodex.js - Permanent, sacred memory (SQLite via Tauri)

import { invoke } from '@tauri-apps/api/tauri';

// Add a new thread into the StoneCodex
export async function addThread(name = null) {
  const now = Date.now();
  const thread = {
    name: name || `Thread started: ${new Date(now).toISOString().replace(/T/, ' ').replace(/\..+/, '')}`,
    created_at: now,
    updated_at: now,
  };
  await invoke('stonecodex_add_thread', { thread });
  return thread;
}

// Fetch all threads from StoneCodex
export async function getAllThreads() {
  return await invoke('stonecodex_get_all_threads');
}

// Fetch a single thread with messages
export async function getThreadById(id) {
  return await invoke('stonecodex_get_thread', { id });
}

// Delete a thread from StoneCodex
export async function deleteThread(id) {
  return await invoke('stonecodex_delete_thread', { id });
}

// Append a new message into StoneCodex
export async function appendMessageToThread(threadId, role, content) {
  const now = Date.now();
  await invoke('stonecodex_add_message', {
    message: {
      thread_id: threadId,
      role,
      content,
      timestamp: now,
    }
  });
}

// Save an imported thread into StoneCodex
export async function saveImportedThread(importedThread) {
  await invoke('stonecodex_save_imported_thread', { thread: importedThread });
}
