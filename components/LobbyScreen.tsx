
import React, { useState } from 'react';
import CommunityChat from './CommunityChat';
import { Lobby } from '../types';
import HowToPlayModal from './HowToPlayModal';

interface LobbyListScreenProps {
  onShowLeaderboard: () => void;
  username: string;
  lobbies: Lobby[];
  onJoinLobby: (lobbyId: string) => void;
  onCreateLobby: (lobbyName: string) => void;
}

const LobbyListScreen: React.FC<LobbyListScreenProps> = ({ onShowLeaderboard, username, lobbies, onJoinLobby, onCreateLobby }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [lobbyName, setLobbyName] = useState(`${username}'s Game`);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const handleCreate = () => {
    if (lobbyName.trim()) {
      onCreateLobby(lobbyName.trim());
      setLobbyName(`${username}'s Game`);
      setShowCreate(false);
    }
  };
  
  return (
    <div className="flex h-full w-full">
      {showHowToPlay && <HowToPlayModal onClose={() => setShowHowToPlay(false)} />}
      <div className="w-2/3 h-full flex flex-col p-8 bg-gray-900/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-orange-500/10 [mask-image:linear-gradient(to_bottom,white_5%,transparent_80%)]"></div>
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="font-bangers text-6xl text-white tracking-widest" style={{ WebkitTextStroke: '2px #000' }}>
                Game Lobbies
                </h1>
                <p className="text-gray-400">Welcome, <span className="font-bold text-orange-400">{username}</span>! Find a game or create your own.</p>
            </div>
            <div className="flex items-center gap-4">
                 <button
                    onClick={() => setShowHowToPlay(true)}
                    className="bg-gray-700 text-white font-bold py-2 px-6 rounded-lg text-md hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
                  >
                    How to Play
                  </button>
                 <button
                    onClick={onShowLeaderboard}
                    className="bg-gray-700 text-white font-bold py-2 px-6 rounded-lg text-md hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
                  >
                    Leaderboard
                  </button>
            </div>
        </div>

        {showCreate ? (
            <div className="bg-black/30 p-4 rounded-lg border border-orange-500/30 mb-4">
                <h2 className="text-xl font-bold text-orange-400">Create New Lobby</h2>
                <div className="flex gap-4 mt-2">
                    <input
                        type="text"
                        value={lobbyName}
                        onChange={(e) => setLobbyName(e.target.value)}
                        placeholder="Lobby Name"
                        className="flex-grow bg-gray-900/80 border border-orange-500/50 rounded-lg py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <button onClick={handleCreate} className="bg-orange-500 text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-orange-400 transition-colors">Create</button>
                    <button onClick={() => setShowCreate(false)} className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-500 transition-colors">Cancel</button>
                </div>
            </div>
        ) : (
             <button
                onClick={() => setShowCreate(true)}
                className="w-full bg-orange-500 text-gray-900 font-bold py-3 px-8 rounded-lg text-lg hover:bg-orange-400 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-orange-500/20 mb-4"
              >
                + CREATE LOBBY
              </button>
        )}

        <div className="flex-grow bg-black/30 rounded-lg border border-orange-500/30 p-2 overflow-y-auto">
            <div className="space-y-2">
                {lobbies.map(lobby => (
                    <div key={lobby.id} className="bg-gray-800/60 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg text-white">{lobby.name}</h3>
                            <p className="text-sm text-gray-400">Host: {lobby.hostName}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-lg font-mono bg-gray-900/50 px-3 py-1 rounded-md">{lobby.players.length}/{lobby.maxPlayers}</span>
                             <button
                                onClick={() => onJoinLobby(lobby.id)}
                                disabled={lobby.players.length >= lobby.maxPlayers}
                                className="bg-orange-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-orange-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                            >
                                Join
                            </button>
                        </div>
                    </div>
                ))}
                {lobbies.length === 0 && <p className="text-center text-gray-500 p-8">No active lobbies. Why not create one?</p>}
            </div>
        </div>
      </div>
      <div className="w-1/3 h-full bg-gray-800/50 border-l border-orange-500/30">
        <CommunityChat username={username} />
      </div>
    </div>
  );
};

// Note: The component is renamed to LobbyListScreen internally, but the file name remains LobbyScreen.tsx to update the existing file.
// The default export is updated to maintain consistency.
const LobbyScreen: React.FC<LobbyListScreenProps> = (props) => <LobbyListScreen {...props} />;


export default LobbyScreen;
