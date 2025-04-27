// CodexGate.js - Permanent I/O path for memory storage (retaining Dexie.js)

import Dexie from 'https://cdn.jsdelivr.net/npm/dexie@3.2.3/+esm';

// Create a new Dexie database instance named 'GlyphDB'
const db = new Dexie('GlyphDB');

// Define the structure of the database and its version
db.version(1).stores({
  threads: '++id, name, createdAt',  // Define the threads table with columns: id (auto-increment), name, createdAt
});

// Base structure of a thread: { id, name, createdAt, messages: [{role, content}] }

// Function to add a new thread to the database
export async function addThread(name = null) {
  const now = Date.now();  // Get the current timestamp
  const thread = {
    name: name || `Thread started: ${new Date(now).toISOString().replace(/T/, ' ').replace(/\..+/, '')}`,  // Default name if none provided
    createdAt: now,  // Set creation timestamp
    messages: []  // Start with an empty array of messages
  };
  const id = await db.threads.add(thread);  // Add the thread to the database and get its auto-generated ID
  return { ...thread, id };  // Return the new thread with its ID
}

// Function to get all threads, ordered by creation time (most recent first)
export async function getAllThreads() {
  return await db.threads.orderBy('createdAt').reverse().toArray();  // Retrieve all threads sorted by createdAt in descending order
}

// Function to get a specific thread by its ID
export async function getThreadById(id) {
  return await db.threads.get(id);  // Fetch the thread with the provided ID
}

// Function to delete a thread by its ID
export async function deleteThread(id) {
  return await db.threads.delete(id);  // Delete the thread from the database
}

// Function to append a message to a specific thread
export async function appendMessageToThread(id, role, content) {
  const thread = await db.threads.get(id);  // Retrieve the thread by its ID
  if (!thread) throw new Error('Thread not found');  // Throw an error if the thread doesn't exist
  thread.messages.push({ role, content });  // Add the new message to the thread's messages array
  await db.threads.put(thread);  // Save the updated thread back to the database
}

// Function to save an imported thread object directly into the database
export async function saveImportedThread(importedThread) {
  if (!importedThread || !importedThread.name || !Array.isArray(importedThread.messages)) {
    throw new Error("Invalid thread format for import.");
  }

  const newThread = {
    name: importedThread.name,  // Use the imported thread's name
    messages: importedThread.messages.map(m => ({
      role: m.role,  // Map each message with its role and content
      content: m.content
    })),
    createdAt: Date.now()  // Set the creation timestamp to the current time
  };

  const id = await db.threads.add(newThread);  // Add the new thread to the database
  return { id, ...newThread };  // Return the newly imported thread with its ID
}
