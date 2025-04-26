// Props interface: expects an array of notes to highlight
interface PianoKeyboardProps {
  highlightedNotes: string[]; // e.g., ["C4", "E4", "G4"]
}

// Configuration: Define the range of notes for the keyboard visualization
const keyboardNotes: string[] = [
  'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
  'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
];

// Helper function to check if a note corresponds to a black key
const isBlackKey = (note: string): boolean => {
  return note.includes('#');
}

// Lookup map for black keys to their preceding white key note name
const precedingWhiteKeyLookup: { [key: string]: string } = {
    'C#': 'C', 'D#': 'D', 'F#': 'F', 'G#': 'G', 'A#': 'A'
};

// Constants for key dimensions (ensure these match Tailwind classes)
// Using Tailwind defaults: w-10 = 2.5rem, w-6 = 1.5rem
const whiteKeyWidthRem = 2.5;
// Offset factor determines where the black key starts relative to the white key
const blackKeyRelativeOffsetFactor = 0.7; // Adjust visually (0.6 to 0.75)

function PianoKeyboard({ highlightedNotes }: PianoKeyboardProps) {
  // Use a Set for efficient checking of highlighted notes
  const highlights = new Set(highlightedNotes);

  // Separate notes into white and black keys
  const whiteKeys = keyboardNotes.filter(n => !isBlackKey(n));
  const blackKeys = keyboardNotes.filter(n => isBlackKey(n));

  // --- Calculate the horizontal starting position (offset) for each white key ---
  const whiteKeyOffsetsMap = new Map<string, number>();
  let currentOffset = 0;
  whiteKeys.forEach(wk => {
      whiteKeyOffsetsMap.set(wk, currentOffset);
      currentOffset += whiteKeyWidthRem; // Increment offset by white key width
  });
  // ------------------------------------------------------------------------------

  return (
    // --- Keyboard Container ---
    // Sets up relative positioning context for absolute black keys
    // Width is calculated based on the number of white keys
    <div className="relative flex h-36" style={{ width: `${whiteKeys.length * whiteKeyWidthRem}rem` }}>

      {/* --- Render White Keys Sequentially --- */}
      {whiteKeys.map((note) => {
        const isHighlighted = highlights.has(note);
        return (
          <div
            key={note} // Unique key for React rendering
            title={note} // Tooltip showing note name
            className={`
              w-10 h-full border border-gray-400 rounded-b box-border flex-shrink-0  /* w-10 = 2.5rem */
              transition-colors duration-150 ease-in-out /* Smooth color change */
              relative /* For positioning the label inside */
              ${isHighlighted ? 'bg-sky-300' : 'bg-white'} /* Conditional highlighting */
            `}
          >
            {/* Optional: Label for the key */}
             <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 select-none">{note}</span>
          </div>
        );
      })}
      {/* --------------------------------- */}


      {/* --- Render Black Keys Absolutely --- */}
      {blackKeys.map((note) => {
           const noteName = note.slice(0, -1); // Note name without octave (e.g., C#)
           const octave = note.slice(-1); // Octave number (e.g., 4)
           const isHighlighted = highlights.has(note);

           // Find the full name (with octave) of the white key before this black key
           const precedingWhiteKeyName = precedingWhiteKeyLookup[noteName];
           if (!precedingWhiteKeyName) return null; // Safety check
           const precedingWhiteNoteFullName = `${precedingWhiteKeyName}${octave}`; // e.g., C4

           // Get the pre-calculated starting offset of that white key
           const precedingWhiteKeyOffset = whiteKeyOffsetsMap.get(precedingWhiteNoteFullName);

           // Skip rendering if the preceding white key wasn't found (e.g., out of defined range)
           if (precedingWhiteKeyOffset === undefined) return null;

           // Calculate left position: (start of preceding white key) + (relative offset)
           const leftPos = precedingWhiteKeyOffset + (whiteKeyWidthRem * blackKeyRelativeOffsetFactor);

           return (
             <div
               key={note} // Unique key
               title={note} // Tooltip
               className={`
                 absolute top-0 z-10 /* Position on top */
                 w-6 h-24 border border-black rounded-b-sm box-border /* w-6 = 1.5rem, height, styling */
                 transition-colors duration-150 ease-in-out /* Smooth color change */
                 ${isHighlighted ? 'bg-sky-600 border-sky-400' : 'bg-black'} /* Conditional highlighting */
               `}
               style={{ left: `${leftPos}rem` }} // Apply calculated horizontal position
             ></div>
           );
      })}
      {/* -------------------------------- */}

    </div>
    // --- End Keyboard Container ---
  );
}

export default PianoKeyboard;