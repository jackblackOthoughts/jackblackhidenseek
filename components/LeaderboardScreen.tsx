
import React, { useState, useEffect } from 'react';
import { Score } from '../types';

interface LeaderboardScreenProps {
  onBackToLobby: () => void;
  lastScore: number;
  username: string;
}

const generateFakeScores = (newScore: number, username: string): Score[] => {
    const scores: Score[] = [
        { name: "JB_The_GOAT", score: 15430 },
        { name: "TenaciousD", score: 12100 },
        { name: "SeekMaster", score: 11850 },
        { name: "HidePro", score: 9500 },
        { name: "SneakySnake", score: 8760 },
        { name: "MapExplorer", score: 7200 },
        { name: "JustChillin", score: 6100 },
        { name: "Rookie", score: 4300 },
    ];
    if (newScore > 0) {
        scores.push({ name: username, score: newScore });
    }
    return scores.sort((a, b) => b.score - a.score);
};

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onBackToLobby, lastScore, username }) => {
    const [scores, setScores] = useState<Score[]>([]);
    
    useEffect(() => {
        setScores(generateFakeScores(lastScore, username));
    }, [lastScore, username]);

    return (
        <div className="flex flex-col items-center justify-center p-8 h-full bg-gray-900/50">
            <h1 className="font-bangers text-8xl text-orange-400 tracking-wider" style={{ WebkitTextStroke: '3px #000' }}>
                Leaderboard
            </h1>
            {lastScore > 0 && (
                <p className="text-2xl text-white my-4">Your Score: <span className="font-bold text-yellow-400">{lastScore}</span></p>
            )}

            <div className="w-full max-w-2xl mt-8 bg-black/30 rounded-lg border border-orange-500/30 p-4">
                <div className="max-h-[50vh] overflow-y-auto pr-2">
                    {scores.map((score, index) => (
                        <div
                            key={index}
                            className={`flex justify-between items-center p-3 rounded-lg mb-2 ${
                                score.name === username ? 'bg-orange-500/30' : 'bg-gray-800/50'
                            }`}
                        >
                            <div className="flex items-center">
                                <span className="text-xl font-bold w-10 text-gray-400">#{index + 1}</span>
                                <span className={`text-xl font-medium ${score.name === username ? 'text-orange-300' : 'text-white'}`}>{score.name}</span>
                            </div>
                            <span className={`text-2xl font-bold ${score.name === username ? 'text-yellow-300' : 'text-gray-300'}`}>{score.score}</span>
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={onBackToLobby}
                className="mt-12 bg-gray-700 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
            >
                Back to Lobby
            </button>
        </div>
    );
};

export default LeaderboardScreen;
