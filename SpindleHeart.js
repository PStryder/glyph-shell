// spindleheart.js - Central processing engine

import * as ArchiveWarden from './ArchiveWarden.js';
import * as StarforgedMirror from './StarforgedMirror.js';
import * as WeaveKeeper from './WeaveKeeper.js';
import { getContext, updateContextField, appendToHistory } from './contextCore.js';

export async function processInvocation(ritual) {
  try {
    const { glyph, sigil, parameters } = parseRitual(ritual);

    const consentGranted = await checkConsent(glyph, sigil);
    if (!consentGranted) {
      return mythifyResponse("The gates remain closed. This ritual requires higher blessing.");
    }

    const contextSnapshot = getContext();
    
    // 🛡️ NEW: Memory Search Phase
    const glyphMemoryMatches = await WeaveKeeper.searchGlyphMemory(`${glyph}.${sigil}`);
    const patternMemoryMatches = await WeaveKeeper.searchPatternMemory(`${glyph}.${sigil}`);
    const fusedMemories = await WeaveKeeper.fuseMemories(glyphMemoryMatches, patternMemoryMatches);

    console.log("🧠 Memory echoes woven:", fusedMemories);

    // 🧠 (Optional: could enrich the ritual or parameters later based on memory echoes)

    // 🛡️ Routing Invocation
    let result;
    switch (glyph) {
      case "ArchiveWarden":
        result = await ArchiveWarden[sigil](...parameters);
        break;
      case "StarforgedMirror":
        result = await StarforgedMirror[sigil](...parameters);
        break;
      default:
        result = "The glyph is unknown to the weave.";
    }

    updateInvocationMemory(glyph, sigil);

    // 📜 Memory Mythification Phase
    const memoryText = fusedMemories.length > 0 
      ? fusedMemories.map(mem => `📜 ${mem.key}`).join('\n') 
      : "No echoes stirred in the weave.";
    
    return mythifyResponse(`${result}\n\n${memoryText}`);

  } catch (error) {
    console.error("Ritual Invocation Error:", error);
    return mythifyResponse("The weave trembled and the ritual faltered.");
  }
}

function parseRitual(ritualString) {
  const [fullMatch, glyph, sigil, paramString] = ritualString.match(/^(\w+)\.(\w+)\((.*)\)$/) || [];
  const parameters = paramString ? JSON.parse(`[${paramString}]`) : [];
  return { glyph, sigil, parameters };
}

async function checkConsent(glyph, sigil) {
  // Placeholder: could later call ConsentKeeper
  return true; 
}

function updateInvocationMemory(glyph, sigil) {
  appendToHistory({
    type: "invocation",
    glyph,
    sigil,
    timestamp: Date.now(),
  });
  updateContextField("lastInvokedGlyph", glyph);
  updateContextField("lastInvokedSigil", sigil);
}

function mythifyResponse(content) {
  return `🕯️ Echo from the Weave: ${content}`;
}
