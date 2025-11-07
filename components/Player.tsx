
import React from 'react';
import { Player } from '../types';
import { TILE_SIZE } from '../constants';

interface PlayerProps {
  player: Player;
  userPlayer?: Player;
}

const PlayerComponent: React.FC<PlayerProps> = ({ player, userPlayer }) => {
  const isUser = player.isPlayer;

  // Hiders are invisible to other hiders unless they are found
  // The user player can always see themselves
  if (userPlayer?.role === 'hider' && player.role === 'hider' && !isUser && !player.isFound) {
    return null;
  }
  
  // Hiders are invisible to the seeker if they are not found
  if (userPlayer?.role === 'seeker' && player.role === 'hider' && !player.isFound) {
      return null;
  }

  const seekerClasses = "border-2 border-red-500 rounded-full animate-pulse";
  const hiderClasses = "border-2 border-orange-400 rounded-md";

  const foundClasses = "opacity-50";

  return (
    <div
      className="absolute transition-all duration-100 ease-linear flex items-center justify-center"
      style={{
        left: player.x * TILE_SIZE,
        top: player.y * TILE_SIZE,
        width: TILE_SIZE,
        height: TILE_SIZE,
        zIndex: isUser ? 10 : 5,
      }}
    >
      <div
        className={`w-4 h-4 transition-opacity duration-300 ${player.role === 'seeker' ? seekerClasses : hiderClasses} ${player.isFound ? foundClasses : ''}`}
        style={{ backgroundColor: player.color }}
      />
      {!isUser && (
        <div className="absolute -top-4 bg-black/50 text-white text-[10px] px-1 rounded-sm">
            {player.name}
        </div>
      )}
      {isUser && (
        <div className="absolute -top-4 bg-orange-500 text-black text-xs px-2 rounded-full font-bold">
            {player.name}
        </div>
      )}
    </div>
  );
};

export default PlayerComponent;
