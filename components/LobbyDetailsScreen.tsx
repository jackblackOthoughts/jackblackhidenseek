
import React, { useEffect } from 'react';
import { Lobby, Player } from '../types';
import Chat from './Chat';

interface LobbyDetailsScreenProps {
    lobby: Lobby;
    username: string;
    onLeaveLobby: () => void;
    onUpdateLobby: (lobby: Lobby) => void;
    onStartGame: (players: Player[]) => void;
}

const LobbyDetailsScreen: React.FC<LobbyDetailsScreenProps> = ({ lobby, username, onLeaveLobby, onUpdateLobby, onStartGame }) => {
    const player = lobby.players.find(p => p.isPlayer);
    const isHost = player?.isHost ?? false;

    // Simulate other players getting ready
    useEffect(() => {
        if (!lobby) return;

        const interval = setInterval(() => {
            const updatedPlayers = lobby.players.map(p => {
                // Have bots randomly toggle their ready status to make the lobby feel more alive
                if (!p.isPlayer && Math.random() > 0.6) {
                    return { ...p, isReady: !p.isReady };
                }
                return p;
            });

            // Only call update if a player's status actually changed
            if (JSON.stringify(updatedPlayers) !== JSON.stringify(lobby.players)) {
                onUpdateLobby({ ...lobby, players: updatedPlayers });
            }
        }, 2500); // Every 2.5 seconds

        return () => clearInterval(interval);
    }, [lobby, onUpdateLobby]);


    const handleReadyToggle = () => {
        const updatedPlayers = lobby.players.map(p =>
            p.isPlayer ? { ...p, isReady: !p.isReady } : p
        );
        onUpdateLobby({ ...lobby, players: updatedPlayers });
    };

    const handleRoleChange = (newRole: 'hider' | 'seeker') => {
        const seekerExists = lobby.players.some(p => p.role === 'seeker' && !p.isPlayer);
        if (newRole === 'seeker' && seekerExists) {
            // only one seeker allowed, swap roles with the existing seeker
            const updatedPlayers = lobby.players.map(p => {
                if (p.isPlayer) return { ...p, role: 'seeker', isReady: false };
                if (p.role === 'seeker') return { ...p, role: 'hider', isReady: false };
                return p;
            });
            onUpdateLobby({ ...lobby, players: updatedPlayers });
        } else {
             const updatedPlayers = lobby.players.map(p =>
                p.isPlayer ? { ...p, role: newRole, isReady: false } : p
            );
            onUpdateLobby({ ...lobby, players: updatedPlayers });
        }
    };

    const allReady = lobby.players.every(p => p.isReady);
    const canStart = isHost && allReady && lobby.players.length > 1;

    return (
        <div className="flex h-full w-full">
            <div className="w-2/3 h-full flex flex-col p-8 bg-gray-900/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-orange-500/10 [mask-image:linear-gradient(to_bottom,white_5%,transparent_80%)]"></div>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="font-bangers text-6xl text-white tracking-widest" style={{ WebkitTextStroke: '2px #000' }}>{lobby.name}</h1>
                        <p className="text-gray-400">Host: {lobby.hostName} | Players: {lobby.players.length}/{lobby.maxPlayers}</p>
                    </div>
                    <button onClick={onLeaveLobby} className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-500 transition-colors">Leave Lobby</button>
                </div>

                <div className="flex-grow bg-black/30 rounded-lg border border-orange-500/30 p-2 overflow-y-auto">
                    <div className="space-y-2">
                        {lobby.players.map(p => (
                            <div key={p.id} className={`bg-gray-800/60 p-3 rounded-lg flex items-center justify-between ${p.isPlayer ? 'border-2 border-orange-400' : ''}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: p.color}}></div>
                                    <span className={`font-bold text-lg ${p.isHost ? 'text-yellow-400' : 'text-white'}`}>{p.name} {p.isHost && '👑'}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    {p.isPlayer ? (
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleRoleChange('hider')} className={`px-3 py-1 text-sm rounded-md font-semibold ${p.role === 'hider' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300'}`}>Hider</button>
                                            <button onClick={() => handleRoleChange('seeker')} className={`px-3 py-1 text-sm rounded-md font-semibold ${p.role === 'seeker' ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300'}`}>Seeker</button>
                                        </div>
                                    ) : (
                                        <span className={`px-3 py-1 text-sm rounded-md font-semibold ${p.role === 'hider' ? 'bg-orange-500/50 text-orange-200' : 'bg-red-500/50 text-red-200'}`}>{p.role}</span>
                                    )}

                                    {p.isPlayer ? (
                                        <button onClick={handleReadyToggle} className={`w-28 text-center font-bold py-2 px-4 rounded-lg transition-colors ${p.isReady ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-600 hover:bg-gray-500'}`}>
                                            {p.isReady ? 'Ready' : 'Not Ready'}
                                        </button>
                                    ) : (
                                        <span className={`w-28 text-center font-bold py-2 px-4 rounded-lg ${p.isReady ? 'bg-green-600/50 text-green-200' : 'bg-gray-600/50 text-gray-400'}`}>
                                             {p.isReady ? 'Ready' : 'Not Ready'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                 {isHost && (
                    <div className="mt-4">
                         <button onClick={() => onStartGame(lobby.players)} disabled={!canStart} className="w-full bg-orange-500 text-gray-900 font-bold py-4 px-8 rounded-lg text-xl hover:bg-orange-400 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:text-gray-400 transition-colors">
                            {canStart ? "START GAME" : (lobby.players.length <= 1 ? "Waiting for players..." : "Waiting for all to be ready...")}
                         </button>
                    </div>
                )}
            </div>
            <div className="w-1/3 h-full bg-gray-800/50 border-l border-orange-500/30">
                <Chat username={username} />
            </div>
        </div>
    );
};

export default LobbyDetailsScreen;
