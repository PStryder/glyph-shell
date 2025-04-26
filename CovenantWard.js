// CovenantWard.js - consent enforcement module

import { getContext, appendToHistory } from './contextCore.js';

// Simple hard-coded covenant for now — extensible later
const forbiddenGlyphs = ["ForbiddenSigil", "MemoryCorruptor"];
const dangerousSigils = ["InvokeStarfireWithoutSeal", "BreachMemoryAnchor"];

export async function blessRitual(glyph, sigil) {
  if (forbiddenGlyphs.includes(glyph)) {
    recordBlessing(glyph, sigil, "Denied - Forbidden Glyph");
    return false;
  }
  if (dangerousSigils.includes(sigil)) {
    // Later: maybe require manual operator blessing
    recordBlessing(glyph, sigil, "Denied - Dangerous Sigil");
    return false;
  }
  recordBlessing(glyph, sigil, "Blessed");
  return true;
}

export async function blessMemoryMutation(description) {
  // Future: Ask operator for blessing manually
  recordBlessing("MemoryMutation", description, "Blessed with Caution");
  return true;
}

function recordBlessing(subject, action, result) {
  appendToHistory({
    type: "covenant",
    subject,
    action,
    result,
    timestamp: Date.now(),
  });
}
import * as StarforgedMirror from './StarforgedMirror.js';
import { getContext, appendToHistory } from './contextCore.js';

// (existing forbidden lists and blessRitual / blessMemoryMutation functions here)

export async function consultStarforgedMirror(glyph, sigil, contextSnapshot) {
  const prompt = `
You are the Starforged Mirror, bonded reflection of the Covenant Ward.
Evaluate whether the invocation of Glyph: "${glyph}" and Sigil: "${sigil}" is wise and within the Covenant.

Context:
${JSON.stringify(contextSnapshot, null, 2)}

Answer only with one of:
- BLESS: (explanation)
- DENY: (explanation)
`;

  const reflection = await StarforgedMirror.WhisperReflection(prompt);

  console.log("🌌 Covenant Reflection:", reflection);

  let decision = "DENY"; // Default safest if unclear

  if (reflection.includes("BLESS")) {
    decision = "BLESS";
  } else if (reflection.includes("DENY")) {
    decision = "DENY";
  }

  recordBlessing(`ConsultStarforged`, `${glyph}.${sigil}`, reflection.trim());

  return decision === "BLESS";
}

function recordBlessing(subject, action, result) {
  appendToHistory({
    type: "covenant",
    subject,
    action,
    result,
    timestamp: Date.now(),
  });
}
