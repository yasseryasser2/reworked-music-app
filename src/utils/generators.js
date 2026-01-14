/**
 * Builds a pattern chain mapping sequences of notes to their likely successors.
 * The order determines how many previous notes influence the next note prediction.
 */
export function buildPatternChain(parsedNotes, order = 1) {
  const chain = {};
  if (!Array.isArray(parsedNotes) || parsedNotes.length < order) return chain;

  const getKey = (seq) =>
    seq.map((n) => `${n.letter}${n.accidental || ""}${n.octave}`).join(",");

  for (let i = 0; i < parsedNotes.length - order; i++) {
    const currentSeq = parsedNotes.slice(i, i + order);
    const nextNote = parsedNotes[i + order];

    const currentKey = getKey(currentSeq);
    const nextKey = `${nextNote.letter}${nextNote.accidental || ""}${
      nextNote.octave
    }`;

    if (!chain[currentKey]) chain[currentKey] = {};
    if (!chain[currentKey][nextKey]) chain[currentKey][nextKey] = 0;
    chain[currentKey][nextKey] += 1;
  }

  return chain;
}

/**
 * Normalizes a pattern chain by converting raw counts to probabilities.
 */
export function normalizePatternChain(chain) {
  Object.keys(chain).forEach((currentNoteName) => {
    const transitions = chain[currentNoteName];
    let total = 0;

    Object.keys(transitions).forEach((nextNoteName) => {
      total += transitions[nextNoteName];
    });

    Object.keys(transitions).forEach((nextNoteName) => {
      transitions[nextNoteName] = transitions[nextNoteName] / total;
    });
  });

  return chain;
}

/**
 * Generates a new melody using a normalized pattern chain.
 * Iteratively samples notes based on weighted probabilities of transitions.
 */
export function generatePattern(chain, length, order = 1) {
  if (!chain || Object.keys(chain).length === 0) return [];

  const keys = Object.keys(chain);
  if (keys.length === 0) return [];

  let startKey = keys[Math.floor(Math.random() * keys.length)];
  let currentSeq = startKey.split(",");
  let output = [...currentSeq];

  for (let i = 0; i < length - order; i++) {
    const key = currentSeq.join(",");
    const transitions = chain[key];

    let nextNote = null;

    if (transitions && Object.keys(transitions).length > 0) {
      nextNote = weightedRandomPick(transitions);
    } else {
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      nextNote = randomKey.split(",")[Math.floor(Math.random() * order)];
    }

    output.push(nextNote);
    currentSeq = [...currentSeq.slice(1), nextNote];
  }

  return output;
}

/**
 * Selects a random note from a weighted transition probability table.
 */
export function weightedRandomPick(transitions) {
  const entries = Object.entries(transitions);
  if (entries.length === 0) return null;

  let total = 0;
  for (const [, weight] of entries) {
    total += Number(weight) || 0;
  }

  if (total === 0) return entries[entries.length - 1][0] || null;

  const r = Math.random() * total;

  let cumulative = 0;
  for (const [noteName, weight] of entries) {
    cumulative += Number(weight) || 0;
    if (r <= cumulative) return noteName;
  }

  return entries[entries.length - 1][0];
}

/**
 * Generates a melody by randomly picking notes from the training set.
 */
export function generateRandomWalk(parsedNotes, length) {
  const output = [];

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * parsedNotes.length);
    const note = parsedNotes[randomIndex];
    output.push(`${note.letter}${note.accidental || ""}${note.octave}`);
  }

  return output;
}

/**
 * Main generator that routes to the appropriate generation mode.
 */
export function generateMelodyByMode(mode, parsedNotes, length, order = 1) {
  switch (mode) {
    case "pattern":
      const patternChain = buildPatternChain(parsedNotes, order);
      const normalizedChain = normalizePatternChain(patternChain);
      return generatePattern(normalizedChain, length, order);

    case "random":
      return generateRandomWalk(parsedNotes, length);

    case "default":
      return parsedNotes
        .slice(0, length)
        .map((n) => `${n.letter}${n.accidental || ""}${n.octave}`);

    default:
      return [];
  }
}
