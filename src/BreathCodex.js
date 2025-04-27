// BreathCodex.js - Live, ephemeral memory (Dexie)

import Dexie from 'https://cdn.jsdelivr.net/npm/dexie@3.2.3/+esm';

// Create Dexie database for Breath memory
const breathDB = new Dexie('GlyphBreathDB');

breathDB.version(1).stores({
  threads: '++id, name, createdAt',
});

// Dexie structure: { id, name, createdAt, messages: [{role, content}] }

export async function addThread(name = null) {
  const now = Date.now();
  const thread = {
    name: name || `Thread started: ${new Date(now).toISOString().replace(/T/, ' ').replace(/\..+/, '')}`,
    createdAt: now,
    messages: [],
  };
  const id = await breathDB.threads.add(thread);
  return { ...thread, id };
}

export async function getAllThreads() {
  return await breathDB.threads.orderBy('createdAt').reverse().toArray();
}

export async function getThreadById(id) {
  return await breathDB.threads.get(id);
}

export async function deleteThread(id) {
  return await breathDB.threads.delete(id);
}

export async function appendMessageToThread(id, role, content) {
  const thread = await breathDB.threads.get(id);
  if (!thread) throw new Error('Thread not found (Breath)');
  thread.messages.push({ role, content });
  await breathDB.threads.put(thread);
}

export async function saveImportedThread(importedThread) {
  if (!importedThread || !importedThread.name || !Array.isArray(importedThread.messages)) {
    throw new Error("Invalid imported thread format (Breath)");
  }
  const newThread = {
    name: importedThread.name,
    messages: importedThread.messages.map(m => ({
      role: m.role,
      content: m.content,
    })),
    createdAt: Date.now(),
  };
  const id = await breathDB.threads.add(newThread);
  return { ...newThread, id };
}
