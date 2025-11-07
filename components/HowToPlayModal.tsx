
import React from 'react';

interface HowToPlayModalProps {
  onClose: () => void;
}

const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="w-full max-w-2xl bg-gray-900 border-2 border-orange-500/50 rounded-2xl p-8 text-white relative shadow-2xl shadow-orange-500/20" onClick={(e) => e.stopPropagation()}>
        <h1 className="font-bangers text-5xl text-orange-400 tracking-wider text-center mb-6" style={{ WebkitTextStroke: '2px #000' }}>
            How to Play
        </h1>
        
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-4 text-gray-300">
            <div className="space-y-2">
                <h2 className="font-bangers text-3xl text-orange-300 tracking-wide">The Objective</h2>
                <p>Jack Black Hide n Seek is a classic game of cat and mouse. One player is the <span className="font-bold text-red-400">Seeker</span>, and the rest are <span className="font-bold text-orange-400">Hiders</span>.</p>
                <ul className="list-disc list-inside pl-4 space-y-1">
                    <li><strong className="text-orange-400">Hiders:</strong> Your goal is to survive and avoid being caught by the Seeker until the timer runs out.</li>
                    <li><strong className="text-red-400">Seeker:</strong> Your goal is to find and catch all the Hiders before the time is up.</li>
                </ul>
            </div>

            <div className="space-y-2">
                <h2 className="font-bangers text-3xl text-orange-300 tracking-wide">Controls</h2>
                 <ul className="list-disc list-inside pl-4 space-y-1">
                    <li><strong>Movement:</strong> Use <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">W</kbd> <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">A</kbd> <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">S</kbd> <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">D</kbd> or the Arrow Keys to move your character.</li>
                    <li><strong>Hider's Radar:</strong> Press the <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Spacebar</kbd> to activate your Sneak Radar. This will give you a temporary hint about the Seeker's location if they are nearby. Use it wisely, as it has a cooldown!</li>
                </ul>
            </div>
            
             <div className="space-y-2">
                <h2 className="font-bangers text-3xl text-orange-300 tracking-wide">Gameplay Tips</h2>
                <ul className="list-disc list-inside pl-4 space-y-1">
                    <li><strong>Hiding Spots:</strong> Trees and other objects on the map can provide cover. A Seeker's view range is reduced when you're hiding in a tree!</li>
                    <li><strong>Radar Logic:</strong> The radar shows the Seeker's direction and a rough estimate of their distance. The closer the blip is to the center, the closer they are to you.</li>
                    <li><strong>Teamwork:</strong> Use the in-game chat to communicate with other players, but be careful—the Seeker can see the chat too!</li>
                </ul>
            </div>
        </div>

        <button
            onClick={onClose}
            className="mt-8 w-full bg-orange-500 text-gray-900 font-bold py-3 px-8 rounded-lg text-lg hover:bg-orange-400 transition-all duration-300 transform hover:scale-105"
        >
            Got It!
        </button>
      </div>
    </div>
  );
};

export default HowToPlayModal;
