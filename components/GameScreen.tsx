import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Player, Tile } from '../types';
import { MAP_WIDTH, MAP_HEIGHT, PLAYER_SPEED, SEEKER_VIEW_RANGE, MAP_LAYOUT, GAME_DURATION_SECONDS, COUNTDOWN_SECONDS, RADAR_COOLDOWN } from '../constants';
import GameMap from './GameMap';
import Radar from './Radar';
import Chat from './Chat';
import { SoundName } from '../hooks/useSounds';

interface GameScreenProps {
  onGameOver: (score: number) => void;
  username: string;
  initialPlayers: Player[];
  playSound: (name: SoundName) => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ onGameOver, username, initialPlayers, playSound }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION_SECONDS);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [isGameActive, setIsGameActive] = useState(false);
  const [lastRadarPing, setLastRadarPing] = useState(0);
  const [showRadarPing, setShowRadarPing] = useState(false);
  const [seekerMessage, setSeekerMessage] = useState('');
  
  const pressedKeys = useRef<Set<string>>(new Set());
  const lastMoveSoundTime = useRef(0);

  const getValidSpawn = useCallback(() => {
    let x, y;
    do {
      x = Math.floor(Math.random() * MAP_WIDTH);
      y = Math.floor(Math.random() * MAP_HEIGHT);
    } while (MAP_LAYOUT[y][x] === Tile.Wall || MAP_LAYOUT[y][x] === Tile.Water);
    return { x, y };
  }, []);

  // Initialize game with players from lobby
  useEffect(() => {
    const spawnedPlayers = initialPlayers.map(p => {
        const spawn = getValidSpawn();
        return {...p, x: spawn.x, y: spawn.y, isFound: false};
    });
    setPlayers(spawnedPlayers);
    setTimeLeft(GAME_DURATION_SECONDS);
    setCountdown(COUNTDOWN_SECONDS);
    setIsGameActive(false);
  }, [initialPlayers, getValidSpawn]);

  const movePlayer = useCallback((dx: number, dy: number) => {
    setPlayers(prevPlayers => {
      const player = prevPlayers.find(p => p.isPlayer);
      if (!player) return prevPlayers;

      const newX = player.x + dx;
      const newY = player.y + dy;

      if (
        newX >= 0 && newX < MAP_WIDTH && newY >= 0 && newY < MAP_HEIGHT &&
        MAP_LAYOUT[newY][newX] !== Tile.Wall && MAP_LAYOUT[newY][newX] !== Tile.Water
      ) {
        return prevPlayers.map(p => p.isPlayer ? { ...p, x: newX, y: newY } : p);
      }
      return prevPlayers;
    });
  }, []);

  const gameLoop = useCallback(() => {
    let dx = 0;
    let dy = 0;
    if (pressedKeys.current.has('w') || pressedKeys.current.has('ArrowUp')) dy -= PLAYER_SPEED;
    if (pressedKeys.current.has('s') || pressedKeys.current.has('ArrowDown')) dy += PLAYER_SPEED;
    if (pressedKeys.current.has('a') || pressedKeys.current.has('ArrowLeft')) dx -= PLAYER_SPEED;
    if (pressedKeys.current.has('d') || pressedKeys.current.has('ArrowRight')) dx += PLAYER_SPEED;

    if (dx !== 0 || dy !== 0) {
      movePlayer(dx, dy);
      const now = Date.now();
      if(now - lastMoveSoundTime.current > 350) {
        playSound('move');
        lastMoveSoundTime.current = now;
      }
    }

    // AI logic for non-player characters
    setPlayers(prev => {
        const seeker = prev.find(p => p.role === 'seeker');
        if (!seeker) return prev;

        return prev.map(p => {
            if (p.isPlayer || p.isFound) return p; // Don't move player or found hiders
            
            // simple bot hider movement
            if(p.role === 'hider' && Math.random() < 0.05) {
                const moveX = Math.floor(Math.random() * 3) - 1;
                const moveY = Math.floor(Math.random() * 3) - 1;
                const newX = p.x + moveX;
                const newY = p.y + moveY;
                if (newX >= 0 && newX < MAP_WIDTH && newY >= 0 && newY < MAP_HEIGHT && MAP_LAYOUT[newY][newX] !== Tile.Wall && MAP_LAYOUT[newY][newX] !== Tile.Water) {
                    return {...p, x: newX, y: newY};
                }
            }
            
            // simple bot seeker movement
             if (p.role === 'seeker' && !p.isPlayer) {
                const hiders = prev.filter(h => h.role === 'hider' && !h.isFound);
                if (hiders.length > 0) {
                    // Simple AI: target a random non-found hider
                    const target = hiders[Math.floor(Math.random() * hiders.length)];
                    let newX = p.x;
                    let newY = p.y;
                    if (target.x > p.x) newX++;
                    else if (target.x < p.x) newX--;
                    if (target.y > p.y) newY++;
                    else if (target.y < p.y) newY--;

                    if (newX >= 0 && newX < MAP_WIDTH && newY >= 0 && newY < MAP_HEIGHT && MAP_LAYOUT[newY][newX] !== Tile.Wall && MAP_LAYOUT[newY][newX] !== Tile.Water) {
                        return {...p, x: newX, y: newY};
                    }
                }
             }
             return p;
        });
    });

    // Seeker check
    setPlayers(prev => {
        const seeker = prev.find(p => p.role === 'seeker');
        if(!seeker) return prev;

        return prev.map(p => {
            if(p.role === 'hider' && !p.isFound) {
                const distance = Math.sqrt(Math.pow(seeker.x - p.x, 2) + Math.pow(seeker.y - p.y, 2));
                const isInTree = MAP_LAYOUT[p.y][p.x] === Tile.Tree;
                const viewRange = isInTree ? SEEKER_VIEW_RANGE / 2 : SEEKER_VIEW_RANGE;
                if(distance < viewRange) {
                    playSound('found');
                    setSeekerMessage(`Found ${p.name}!`);
                    setTimeout(() => setSeekerMessage(''), 2000);
                    return {...p, isFound: true};
                }
            }
            return p;
        })
    })

  }, [movePlayer, playSound]);

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (!isGameActive) return;
        pressedKeys.current.add(e.key.toLowerCase());
        if (e.key.toLowerCase() === ' ') {
            e.preventDefault();
            const player = players.find(p => p.isPlayer);
            if(player?.role !== 'hider') return;
            if (Date.now() - lastRadarPing > RADAR_COOLDOWN) {
                setLastRadarPing(Date.now());
                setShowRadarPing(true);
                playSound('ping');
                setTimeout(() => setShowRadarPing(false), 500);
            }
        }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
        pressedKeys.current.delete(e.key.toLowerCase());
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isGameActive, lastRadarPing, players, playSound]);

  // Game Timers & State
  useEffect(() => {
    if (countdown > 0) {
        const timer = setTimeout(() => {
            setCountdown(countdown - 1);
            if (countdown > 1) {
                playSound('countdown');
            }
        }, 1000);
        return () => clearTimeout(timer);
    } else if (!isGameActive) {
        setIsGameActive(true);
    }
  }, [countdown, isGameActive, playSound]);

  useEffect(() => {
    if (!isGameActive) return;

    const gameInterval = setInterval(gameLoop, 100);
    
    const hiders = players.filter(p => p.role === 'hider');
    const hidersFound = hiders.filter(p => p.isFound).length;
    const allHidersFound = hiders.length > 0 && hidersFound === hiders.length;
    
    if (timeLeft <= 0 || allHidersFound) {
        clearInterval(gameInterval);
        const playerIsHider = players.find(p => p.isPlayer)?.role === 'hider';
        const hidersRemaining = hiders.length - hidersFound;
        let score = 0;
        if (playerIsHider) {
            score = hidersRemaining * 100 + timeLeft * 10;
        } else { // is seeker
            score = hidersFound * 100 + (GAME_DURATION_SECONDS - timeLeft) * 10;
        }
        playSound('gameOver');
        onGameOver(score);
        return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(gameInterval);
    };
  }, [isGameActive, timeLeft, onGameOver, gameLoop, players, playSound]);
  
  const player = players.find(p => p.isPlayer);
  const seeker = players.find(p => p.role === 'seeker');
  const hiders = players.filter(p => p.role === 'hider');
  const hidersRemaining = hiders.filter(p => !p.isFound).length;

  return (
    <div className="flex h-full w-full">
      <div className="w-1/3 h-full bg-gray-800/50 border-r border-orange-500/30 flex flex-col p-4 space-y-4">
        <div className="text-center">
            <h2 className="font-bangers text-4xl text-orange-400 tracking-wider">Game Info</h2>
        </div>
        <div className="bg-gray-900/50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-center text-red-500">
                TIME LEFT: {Math.floor(timeLeft/60).toString().padStart(2,'0')}:{ (timeLeft%60).toString().padStart(2,'0') }
            </div>
            <div className="text-xl font-bold text-center text-orange-400 mt-2">
                Hiders Remaining: {hidersRemaining} / {hiders.length}
            </div>
        </div>
        {player?.role === 'hider' && (
            <Radar
                player={player}
                seeker={seeker}
                isPinging={showRadarPing}
                pingCooldown={RADAR_COOLDOWN}
                lastPingTime={lastRadarPing}
            />
        )}
        <div className="flex-grow">
            <Chat username={username} />
        </div>
      </div>
      <div className="w-2/3 h-full flex items-center justify-center bg-gray-900/50 relative overflow-hidden">
        {countdown > 0 && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
                <p className="font-bangers text-5xl text-white">Game starting in...</p>
                <p className="font-bangers text-9xl text-orange-400">{countdown}</p>
            </div>
        )}
        <div className="absolute top-2 left-2 bg-black/50 p-2 rounded-lg z-10">
            <p className="text-white">Your Role: <span className={player?.role === 'hider' ? "text-orange-400 font-bold" : "text-red-500 font-bold"}>{player?.role.toUpperCase()}</span></p>
        </div>
        {seekerMessage && <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-red-600/80 px-4 py-2 rounded-lg z-10 font-bangers text-2xl tracking-wide">{seekerMessage}</div>}
        <GameMap players={players} />
      </div>
    </div>
  );
};

export default GameScreen;
