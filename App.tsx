import React, { useState, useCallback, useEffect } from 'react';
// FIX: Corrected the import path to match the file name 'LobbyScreen.tsx'.
import LobbyListScreen from './components/LobbyScreen';
import LobbyDetailsScreen from './components/LobbyDetailsScreen';
import GameScreen from './components/GameScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import SignInScreen from './components/SignInScreen';
import { GameMode, Lobby, Player } from './types';
import { MAX_PLAYERS_PER_LOBBY } from './constants';
import useSounds, { SoundName } from './hooks/useSounds';

// Mock data
const initialLobbies: Lobby[] = [
    { id: 'lobby-1', name: "Jack's Funhouse", hostName: "JB_The_GOAT", maxPlayers: MAX_PLAYERS_PER_LOBBY, players: [{ id: 'p1', name: 'JB_The_GOAT', isPlayer: false, x: 0, y: 0, role: 'hider', isFound: false, color: '#FBBF24', isHost: true, isReady: true }, { id: 'p2', name: 'TenaciousD', isPlayer: false, x: 0, y: 0, role: 'hider', isFound: false, color: '#A78BFA', isReady: true }] },
    { id: 'lobby-2', name: "Beginners Only", hostName: "MapExplorer", maxPlayers: MAX_PLAYERS_PER_LOBBY, players: [{ id: 'p3', name: 'MapExplorer', isPlayer: false, x: 0, y: 0, role: 'hider', isFound: false, color: '#34D399', isHost: true, isReady: false }, { id: 'p4', name: 'Rookie', isPlayer: false, x: 0, y: 0, role: 'hider', isFound: false, color: '#F87171', isReady: true }, { id: 'p5', name: 'JustChillin', isPlayer: false, x: 0, y: 0, role: 'hider', isFound: false, color: '#60A5FA', isReady: false }] },
];

const playerColors = ["#34D399", "#F87171", "#FB923C", "#FBBF24", "#A78BFA", "#F472B6", "#A3E635", "#F59E0B", "#EC4899", "#F97316"];


const App: React.FC = () => {
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.LobbyList);
  const [lastScore, setLastScore] = useState<number>(0);
  const [username, setUsername] = useState<string>('');
  const [lobbies, setLobbies] = useState<Lobby[]>(initialLobbies);
  const [currentLobby, setCurrentLobby] = useState<Lobby | null>(null);
  const [initialGamePlayers, setInitialGamePlayers] = useState<Player[]>([]);
  const { isMuted, toggleMute, playSound } = useSounds();

  useEffect(() => {
    // Simulate other players joining/leaving lobbies to make it feel dynamic
    const interval = setInterval(() => {
        setLobbies(prevLobbies => {
            return prevLobbies.map(lobby => {
                if (lobby.id === currentLobby?.id) return lobby; // Don't change the lobby the user is in

                // Randomly add a player
                if (Math.random() > 0.7 && lobby.players.length < lobby.maxPlayers) {
                    const newPlayer: Player = { id: `bot-${Date.now()}`, name: `Guest${Math.floor(Math.random() * 1000)}`, isPlayer: false, x: 0, y: 0, role: 'hider', isFound: false, color: playerColors[Math.floor(Math.random() * playerColors.length)], isReady: Math.random() > 0.5 };
                    return {...lobby, players: [...lobby.players, newPlayer]};
                }
                // Randomly remove a player
                if (Math.random() > 0.8 && lobby.players.length > 1) {
                     const players = [...lobby.players];
                     const playerToRemove = players.findIndex(p => !p.isHost);
                     if(playerToRemove > -1) {
                         players.splice(playerToRemove, 1);
                         return {...lobby, players};
                     }
                }
                return lobby;
            });
        });
        // FIX: The setInterval function requires a delay argument. This fixes the type error on `clearInterval`.
    }, 2000);
        return () => clearInterval(interval);
  }, [currentLobby]);


  const handleSignIn = useCallback((name: string, pass: string): { success: boolean; message?: string } => {
    const trimmedName = name.trim();
    if (!trimmedName || !pass) {
        return { success: false, message: 'Username and password cannot be empty.' };
    }
    const users = JSON.parse(localStorage.getItem('hide-n-seek-users') || '{}');
    
    if (users[trimmedName]) { // Login
        if (users[trimmedName] === pass) {
            setUsername(trimmedName);
            return { success: true };
        } else {
            return { success: false, message: 'Incorrect password.' };
        }
    } else { // Sign up
        users[trimmedName] = pass;
        localStorage.setItem('hide-n-seek-users', JSON.stringify(users));
        setUsername(trimmedName);
        return { success: true };
    }
  }, []);

  const handleShowLeaderboard = useCallback(() => {
    setGameMode(GameMode.Leaderboard);
  }, []);

  const handleBackToLobbyList = useCallback(() => {
    setGameMode(GameMode.LobbyList);
  }, []);
  
  const handleGameOver = useCallback((score: number) => {
    setLastScore(score);
    setCurrentLobby(null);
    setInitialGamePlayers([]);
    setGameMode(GameMode.Leaderboard);
  }, []);

  const getAvailableColor = useCallback((playersInLobby: Player[]): string => {
    const usedColors = new Set(playersInLobby.map(p => p.color));
    const available = playerColors.filter(c => !usedColors.has(c));
    if (available.length > 0) {
        return available[Math.floor(Math.random() * available.length)];
    }
    return playerColors[Math.floor(Math.random() * playerColors.length)];
  }, []);

  const handleCreateLobby = useCallback((lobbyName: string) => {
      const newPlayer: Player = { id: 'player', name: username, isPlayer: true, x: 0, y: 0, role: 'hider', isFound: false, color: getAvailableColor([]), isHost: true, isReady: false };
      const newLobby: Lobby = {
        id: `lobby-${Date.now()}`,
        name: lobbyName,
        hostName: username,
        maxPlayers: MAX_PLAYERS_PER_LOBBY,
        players: [newPlayer]
      };
      setLobbies(prev => [...prev, newLobby]);
      setCurrentLobby(newLobby);
      setGameMode(GameMode.InLobby);
  }, [username, getAvailableColor]);

  const handleJoinLobby = useCallback((lobbyId: string) => {
      const lobby = lobbies.find(l => l.id === lobbyId);
      if (lobby && lobby.players.length < lobby.maxPlayers) {
          const newPlayer: Player = { id: 'player', name: username, isPlayer: true, x: 0, y: 0, role: 'hider', isFound: false, color: getAvailableColor(lobby.players), isHost: false, isReady: false };
          const updatedLobby = {...lobby, players: [...lobby.players, newPlayer]};
          
          setLobbies(prev => prev.map(l => l.id === lobbyId ? updatedLobby : l));
          setCurrentLobby(updatedLobby);
          setGameMode(GameMode.InLobby);
      }
  }, [lobbies, username, getAvailableColor]);

  const handleLeaveLobby = useCallback(() => {
      if (!currentLobby) return;
      const updatedLobby = {
          ...currentLobby,
          players: currentLobby.players.filter(p => !p.isPlayer)
      };
      // If host leaves, a new host is assigned or lobby is deleted
      const isHost = currentLobby.players.find(p => p.isPlayer)?.isHost;
      if (isHost) {
          if (updatedLobby.players.length > 0) {
              updatedLobby.players[0].isHost = true;
              updatedLobby.hostName = updatedLobby.players[0].name;
              setLobbies(prev => prev.map(l => l.id === currentLobby.id ? updatedLobby : l));
          } else {
              setLobbies(prev => prev.filter(l => l.id !== currentLobby.id));
          }
      } else {
           setLobbies(prev => prev.map(l => l.id === currentLobby.id ? updatedLobby : l));
      }

      setCurrentLobby(null);
      setGameMode(GameMode.LobbyList);
  }, [currentLobby]);
  
  const handleUpdateLobby = useCallback((updatedLobby: Lobby) => {
      setCurrentLobby(updatedLobby);
      setLobbies(prev => prev.map(l => l.id === updatedLobby.id ? updatedLobby : l));
  }, []);

  const handleStartGame = useCallback((players: Player[]) => {
      setInitialGamePlayers(players);
      setGameMode(GameMode.Playing);
  }, []);


  const renderContent = () => {
    if (!username) {
      return <SignInScreen onSignIn={handleSignIn} />;
    }

    switch (gameMode) {
      case GameMode.InLobby:
        return currentLobby && <LobbyDetailsScreen
            lobby={currentLobby}
            username={username}
            onLeaveLobby={handleLeaveLobby}
            onUpdateLobby={handleUpdateLobby}
            onStartGame={handleStartGame}
        />;
      case GameMode.Playing:
        return <GameScreen onGameOver={handleGameOver} username={username} initialPlayers={initialGamePlayers} playSound={playSound} />;
      case GameMode.Leaderboard:
        return <LeaderboardScreen onBackToLobby={handleBackToLobbyList} lastScore={lastScore} username={username} />;
      case GameMode.LobbyList:
      default:
        return (
          <LobbyListScreen
            onShowLeaderboard={handleShowLeaderboard}
            username={username}
            lobbies={lobbies}
            onJoinLobby={handleJoinLobby}
            onCreateLobby={handleCreateLobby}
          />
        );
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4 selection:bg-orange-400 selection:text-gray-900">
      <div className="w-full max-w-7xl h-[90vh] max-h-[1000px] bg-black bg-opacity-40 rounded-2xl shadow-2xl shadow-orange-500/20 border border-orange-500/30 flex flex-col overflow-hidden">
        {renderContent()}
      </div>
       <div className="absolute bottom-2 left-2 text-gray-500 text-xs font-mono">
        Sponsored by Kaspersthoughts
      </div>
      <button
        onClick={toggleMute}
        className="absolute bottom-2 right-2 p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/70 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 z-30"
        aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
      >
        {isMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l-2-2m0 0l-2-2m2 2l-2 2m2-2l2 2" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9A9 9 0 0122 12a9 9 0 01-3.636 7.536M11 5L6 9H2v6h4l5 4V5z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default App;
