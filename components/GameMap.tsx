import React from 'react';
import { Player, Tile } from '../types';
import { MAP_WIDTH, MAP_HEIGHT, TILE_SIZE, MAP_LAYOUT } from '../constants';
import PlayerComponent from './Player';

interface GameMapProps {
  players: Player[];
}

const GameMap: React.FC<GameMapProps> = ({ players }) => {
  const player = players.find(p => p.isPlayer);
  const viewportWidth = TILE_SIZE * MAP_WIDTH;
  const viewportHeight = TILE_SIZE * MAP_HEIGHT;

  const renderTile = (tile: Tile, x: number, y: number) => {
    let className = 'absolute';
    switch (tile) {
      case Tile.Wall:
        className += ' bg-gray-700';
        break;
      case Tile.Tree:
        // Render a more distinct tree icon instead of a plain square
        return (
            <div
                key={`${x}-${y}`}
                className="absolute"
                style={{
                left: x * TILE_SIZE,
                top: y * TILE_SIZE,
                width: TILE_SIZE,
                height: TILE_SIZE,
                }}
            >
                {/* The base tile is transparent, showing the grass from the map background */}
                <div className="relative w-full h-full flex items-center justify-center">
                    {/* Trunk */}
                    <div 
                        className="bg-yellow-900/90 absolute bottom-0"
                        style={{
                            width: TILE_SIZE * 0.25,
                            height: TILE_SIZE * 0.5,
                        }}
                    ></div>
                    {/* Leaves */}
                    <div 
                        className="bg-green-800/90 rounded-full absolute top-0"
                        style={{ 
                            width: TILE_SIZE * 0.8, 
                            height: TILE_SIZE * 0.8,
                        }}
                    ></div>
                </div>
            </div>
        );
      case Tile.Building:
        className += ' bg-yellow-800/60'; // Wooden floor
        break;
      case Tile.Road:
        className += ' bg-gray-600';
        break;
      case Tile.Water:
        className += ' bg-blue-500';
        break;
      case Tile.Floor:
      default:
        className += ' bg-transparent'; // Will show grid background
        break;
    }
    return (
      <div
        key={`${x}-${y}`}
        className={className}
        style={{
          left: x * TILE_SIZE,
          top: y * TILE_SIZE,
          width: TILE_SIZE,
          height: TILE_SIZE,
        }}
      />
    );
  };

  return (
    <div className="relative bg-green-600/40 bg-grid-orange-500/10 overflow-hidden" style={{ width: viewportWidth, height: viewportHeight }}>
      {MAP_LAYOUT.map((row, y) => row.map((tile, x) => renderTile(tile, x, y)))}
      {players.map(p => (
        <PlayerComponent key={p.id} player={p} userPlayer={player} />
      ))}
      {/* Subtle vignette effect for map boundaries */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{ boxShadow: 'inset 0 0 30px 15px rgba(0, 0, 0, 0.4)' }}
      ></div>
    </div>
  );
};

export default GameMap;