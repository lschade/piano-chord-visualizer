import React, { useState } from 'react';
import ChordSelector from './components/ChordSelector';
import ChordDisplay from './components/ChordDisplay';
import { Chord as TonalChord } from '@tonaljs/tonal';
import { commonChords } from './data/chords';

interface DisplayChord {
  id: number;
  name: string;
  notes: string[];
}

function App() {
  const [displayedChords, setDisplayedChords] = useState<DisplayChord[]>([]);
  const [columnsPerRow, setColumnsPerRow] = useState<number>(2);

  // --- createChordObject, addChord, removeChord, addAllCommonChords, handleColumnsChange, getResponsiveGridColsClass functions remain the same ---
  const createChordObject = (name: string, id: number): DisplayChord | null => {
      try {
          const chordData = TonalChord.get(name);
          if (chordData.empty) {
            console.warn(`Tonal.js could not find chord: ${name}`);
            return null;
          }
          const notesWithOctave = chordData.notes.map(note =>
             /\d/.test(note) ? note : `${note}4`
          );
          return {
            id: id,
            name: chordData.symbol || name,
            notes: notesWithOctave,
          };
      } catch (error) {
          console.error(`Error processing chord ${name}:`, error);
          return null;
      }
  }

  const addChord = (chordName: string) => {
    const newChord = createChordObject(chordName, Date.now());
    if (newChord) {
        setDisplayedChords(prevChords => [...prevChords, newChord]);
    } else {
        alert(`Could not process chord: ${chordName}.`);
    }
  };

  const removeChord = (idToRemove: number) => {
    setDisplayedChords(prevChords => prevChords.filter(chord => chord.id !== idToRemove));
  };

  const addAllCommonChords = () => {
      const chordsToAdd: DisplayChord[] = [];
      commonChords.forEach((name, index) => {
          const chordObj = createChordObject(name, Date.now() + index);
          if (chordObj) {
              chordsToAdd.push(chordObj);
          }
      });
      setDisplayedChords(prevChords => [...prevChords, ...chordsToAdd]);
  };

   const handleColumnsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const numCols = parseInt(event.target.value, 10);
    if (numCols > 0 && numCols <= 4) { setColumnsPerRow(numCols); }
  };

  const getResponsiveGridColsClass = (maxCols: number): string => {
      let classes = 'grid-cols-1';
      if (maxCols >= 2) { classes += ' md:grid-cols-2'; }
      if (maxCols >= 3) { classes += ' lg:grid-cols-3'; }
      if (maxCols >= 4) { classes += ' xl:grid-cols-4'; }
      return classes;
  }
  // --- End of functions ---


  return (
    // --- Outermost container - now potentially full width ---
    // Removed container, mx-auto. Keep padding/font if desired.
    <div className="p-4 font-sans">

        {/* --- ADDED: Inner container for centering and max-width --- */}
        {/* Apply container and mx-auto here */}
        <div className="mx-auto">

            {/* Title (now inside the centered container) */}
            <h1 className="text-3xl font-bold mb-6 text-center">Piano Chord Visualizer</h1>

            {/* Control Area (now inside the centered container) */}
            {/* No need for extra max-width/mx-auto here */}
            <div className="mb-8 p-4 bg-gray-100 rounded-lg shadow space-y-4 md:space-y-0 md:flex md:flex-wrap md:justify-around md:items-center md:gap-4 md:justify-self-center">
                <ChordSelector onChordAdd={addChord} />
                {/* Column Selector */}
                <div className="flex items-center justify-center gap-2">
                    <label htmlFor="columns-select" className="font-medium text-gray-700">Max chords per row:</label>
                    <select id="columns-select" value={columnsPerRow} onChange={handleColumnsChange} className="p-2 border border-gray-300 rounded bg-white text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                </div>
                 {/* Add All Chords Button */}
                <div className="flex justify-center">
                  <button onClick={addAllCommonChords} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow hover:shadow-md transition duration-150 ease-in-out">
                      Add All Common Chords
                  </button>
                </div>
            </div>

            {/* Chord Display Grid Area (now inside the centered container) */}
            {/* No need for extra max-width/mx-auto here */}
            <div className={`grid gap-4 md:gap-6 ${getResponsiveGridColsClass(columnsPerRow)}`}>
                {displayedChords.length === 0 && (
                  <p className="text-gray-500 text-center col-span-full">
                     Add a chord using the selector above.
                  </p>
                )}
                {displayedChords.map((chord) => (
                  <ChordDisplay
                    key={chord.id}
                    id={chord.id}
                    name={chord.name}
                    notes={chord.notes}
                    onRemove={removeChord}
                  />
                ))}
            </div>

        </div>
        {/* --- END: Inner centering container --- */}

    </div>
    // --- END: Outermost container ---
  );
}

export default App;