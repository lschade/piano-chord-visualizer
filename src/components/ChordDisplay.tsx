import PianoKeyboard from './PianoKeyboard'; // Import the keyboard component

// Props interface for this component
interface ChordDisplayProps {
  id: number;                     // Unique ID for removal
  name: string;                   // Chord name to display
  notes: string[];                // Notes to highlight on the keyboard
  onRemove: (id: number) => void; // Function to call when remove is clicked
}

function ChordDisplay({ id, name, notes, onRemove }: ChordDisplayProps) {

  // Handler for the remove button click
  const handleRemoveClick = () => {
    onRemove(id); // Call the parent's remove function with this chord's ID
  };

  return (
    // Card container for a single chord display
    <div className="p-4 border border-gray-200 rounded-lg shadow bg-white relative flex flex-col">

      {/* Section for Chord Name and Remove Button */}
      <div className="flex justify-between items-center mb-3 flex-shrink-0">
          {/* Chord Name (truncates if too long) */}
          <h3 className="text-xl font-semibold text-gray-900 truncate pr-2">{name}</h3>
          {/* Remove Button */}
          <button
              onClick={handleRemoveClick}
              className="bg-red-500 hover:bg-red-700 text-white text-xs font-bold py-1 px-2 rounded transition duration-150 ease-in-out flex-shrink-0"
              aria-label={`Remove ${name} chord`} // Accessibility label
          >
              Remove
          </button>
      </div>

      {/* Container for the Piano Keyboard (allows horizontal scroll) */}
      <div className="flex justify-center overflow-x-auto pb-2 mt-auto">
        <PianoKeyboard highlightedNotes={notes} />
      </div>

    </div>
  );
}

export default ChordDisplay;