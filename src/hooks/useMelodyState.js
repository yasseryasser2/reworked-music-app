import { useState } from "react";

export function useMelodyState() {
  const [inputNotes, setInputNotes] = useState("");
  const [parsedNotes, setParsedNotes] = useState([]);
  const [generatedMelody, setGeneratedMelody] = useState([]);
  const [tempo, setTempo] = useState(120);
  const [volume, setVolume] = useState(80);
  const [instrument, setInstrument] = useState("sine");
  const [generationMode, setGenerationMode] = useState("default");
  const [melodyLength, setMelodyLength] = useState(32);
  const [isPlaying, setIsPlaying] = useState(false);

  return {
    inputNotes,
    setInputNotes,
    parsedNotes,
    setParsedNotes,
    generatedMelody,
    setGeneratedMelody,
    tempo,
    setTempo,
    volume,
    setVolume,
    instrument,
    setInstrument,
    generationMode,
    setGenerationMode,
    melodyLength,
    setMelodyLength,
    isPlaying,
    setIsPlaying,
  };
}
