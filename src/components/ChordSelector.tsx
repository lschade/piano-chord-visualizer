import { useState, useEffect } from 'react'; // Import useEffect
// Import the shared list from the data file
import { commonChords } from '../data/chords'; // Adjust path ../ if needed

// Props interface: expects a function to call when a chord is added
interface ChordSelectorProps {
  onChordAdd: (chordName: string) => void;
}

function ChordSelector({ onChordAdd }: ChordSelectorProps) {
  // State for the currently selected chord in the dropdown
  const [selectedChord, setSelectedChord] = useState(commonChords[0]);
  // --- State for the search term ---
  const [searchTerm, setSearchTerm] = useState('');
  // --------------------------------

  // --- Filter chords based on search term ---
  // Memoize this calculation if list gets very large, but usually fine for < 1000 items
  const filteredChords = commonChords.filter(chord =>
    chord.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // -----------------------------------------

  // --- Effect to update selection if filter removes current selection ---
  useEffect(() => {
    // Check if the currently selected chord is still present in the filtered list
    const isSelectedChordInFilteredList = filteredChords.some(
      chord => chord === selectedChord
    );

    // If the selected chord is no longer in the filtered list,
    // or if the list is empty, update the selection.
    if (!isSelectedChordInFilteredList) {
      // Select the first item in the filtered list, or empty string if filter is empty
      setSelectedChord(filteredChords.length > 0 ? filteredChords[0] : '');
    }
    // Run this effect whenever the filtered list changes (i.e., when searchTerm changes)
  }, [searchTerm, filteredChords, selectedChord]); // Dependencies that influence the logic inside

  // -----------------------------------------------------------------

  // Handler for the Add Chord button click
  const handleAddClick = () => {
    // Ensure a valid chord is selected before adding
    if (selectedChord && commonChords.includes(selectedChord)) {
      onChordAdd(selectedChord);
    } else if (filteredChords.length > 0) {
        // If selection was cleared, maybe add the first filtered item? Or disable button?
        // For now, let's add the first filtered item if selection is invalid
        onChordAdd(filteredChords[0]);
        setSelectedChord(filteredChords[0]); // Update selection state too
    } else {
        console.warn("No valid chord selected or available to add.");
    }
  };


  return (
    // Changed container layout: Wrap Search and Select+Button separately for better flow
    <div className="space-y-2 md:space-y-0 md:flex md:flex-wrap md:items-end md:justify-center md:gap-4">

      {/* --- Search Input Group --- */}
      <div className="flex-grow md:flex-grow-0"> {/* Allow grow on mobile stack */}
        <label htmlFor="chord-search" className="block text-sm font-medium text-gray-700 mb-1">
          Search Chords:
        </label>
        <input
          type="text"
          id="chord-search"
          placeholder="e.g., Cmaj7, Gm, F#..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-auto p-2 border border-gray-300 rounded bg-white text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      {/* ------------------------ */}

      {/* --- Select and Add Button Group --- */}
      <div className="flex items-end gap-2"> {/* Align items to bottom */}
         {/* Dropdown Group */}
         <div>
             <label htmlFor="chord-select" className="block text-sm font-medium text-gray-700 mb-1">
                 Select Chord:
             </label>
             <select
               id="chord-select"
               value={selectedChord}
               onChange={(e) => setSelectedChord(e.target.value)}
               disabled={filteredChords.length === 0} // Disable if no results
               className="p-2 border border-gray-300 rounded bg-white text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
               style={{ minWidth: '8rem' }} // Ensure dropdown has some minimum width
             >
               {/* Render options from the FILTERED list */}
               {filteredChords.length > 0 ? (
                 filteredChords.map(chord => (
                   <option key={chord} value={chord}>
                     {chord}
                   </option>
                 ))
               ) : (
                 // Optional: Show a disabled option if no results found
                 <option value="" disabled>No matches</option>
               )}
             </select>
          </div>
          {/* Add Chord Button */}
          <button
            onClick={handleAddClick}
            disabled={!selectedChord || filteredChords.length === 0} // Disable if nothing valid selected/available
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow hover:shadow-md transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Chord
          </button>
        </div>
      {/* --------------------------- */}

    </div>
  );
}

export default ChordSelector;