// Loom.js - Memory Management (handles current session and syncs to CodexGate for permanence)

import * as CodexGate from './CodexGate.js';  // Import CodexGate for permanent memory handling

let glyphMemory = {};  // In-memory representation of the glyph's context

// Append a memory arc to the Loom (session memory)
export async function appendToHistory(memory) {
    const id = `arc_${Date.now()}`;
    glyphMemory[id] = memory;  // Store the memory in in-memory context
    console.log("[Loom] Memory appended:", memory);

    // Duplicate check: Ensure the last message is not the same as the current message
    const lastLoomEntry = await getContext(1);  // Fetch the most recent entry in Loom.js context
    if (lastLoomEntry?.[0]?.content !== memory.content) {
        // Sync to CodexGate for permanent storage periodically
        if (Object.keys(glyphMemory).length > 10) {  // Arbitrary condition for syncing
            await CodexGate.appendToMemory(memory);  // Sync the latest memory to CodexGate
        }
    } else {
        console.log("[Loom] Skipping duplicate memory write.");
    }
}

// Retrieve recent context (simple implementation for now, pulling from Loom memory)
export async function getContext(limit = 5) {
    const entries = Object.entries(glyphMemory)
        .sort((a, b) => a[1].timestamp - b[1].timestamp)
        .slice(-limit)
        .map(([id, memory]) => memory);

    console.log("[Loom] Retrieved context:", entries);
    return entries;
}

export { glyphMemory };  // Export in-memory context for internal use
