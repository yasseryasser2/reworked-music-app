export const VALID_LETTERS = ["A", "B", "C", "D", "E", "F", "G"];
export const SEMITONE_MAP = {
  C: 0,
  "C#": 1,
  D: 2,
  "D#": 3,
  E: 4,
  F: 5,
  "F#": 6,
  G: 7,
  "G#": 8,
  A: 9,
  "A#": 10,
  B: 11,
};

/**
 * Parses an array of note tokens into structured note objects with frequency data.
 * Returns both successfully parsed notes and a list of parsing errors.
 */
export function parseTokens(tokenArray) {
  const parsedNotes = [];
  const parseErrors = [];

  tokenArray.forEach((rawToken, index) => {
    const t = rawToken.trim().toUpperCase();

    if (t === "") {
      parseErrors.push(`Empty token at position ${index}`);
      return;
    }

    const letterChar = t[0];
    if (!VALID_LETTERS.includes(letterChar)) {
      parseErrors.push(`Invalid note letter '${letterChar}' in token ${index}`);
      return;
    }

    let accidental = null;
    if (t[1] === "#") {
      accidental = "#";
    }

    const octaveStrStart = accidental ? 2 : 1;
    const octaveStr = t.slice(octaveStrStart);
    let octave;
    if (octaveStr === "") {
      octave = 4;
    } else {
      octave = parseInt(octaveStr);
    }

    if (Number.isNaN(octave) || octave < 0 || octave > 8) {
      parseErrors.push(`Invalid octave in token ${index}`);
      return;
    }

    const key = letterChar + (accidental ? accidental : "");
    const semitone = SEMITONE_MAP[key];

    if (semitone === undefined) {
      parseErrors.push(`Unknown note '${key}' at token ${index}`);
      return;
    }

    const midi = 12 * (octave + 1) + semitone;
    const freq = 440 * Math.pow(2, (midi - 69) / 12);

    const noteObj = {
      letter: letterChar,
      accidental: accidental,
      octave: octave,
      semitone: semitone,
      midi: midi,
      frequency: freq,
    };

    parsedNotes.push(noteObj);
  });

  return { parsedNotes, parseErrors };
}

/**
 * Converts parsed note objects back into simple note name strings.
 */
export function parsedNotesToNames(parsedNotes) {
  return parsedNotes.map((n) => `${n.letter}${n.accidental || ""}${n.octave}`);
}

/**
 * Builds a frequency map from parsed notes.
 * Returns an object mapping note names to frequencies.
 */
export function buildNoteFrequencyMap(parsedNotes) {
  const map = {};
  parsedNotes.forEach((noteObj) => {
    const name = noteObj.letter + (noteObj.accidental || "") + noteObj.octave;
    map[name] = noteObj.frequency;
  });
  return map;
}

/**
 * Retrieves the frequency for a note name from a frequency map.
 */
export function getFrequencyForNote(noteName, frequencyMap) {
  return frequencyMap[noteName] || null;
}
