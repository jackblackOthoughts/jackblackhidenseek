
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';

const botAuthors = [
    { name: "Gamer123", color: "text-red-400" },
    { name: "ProHider", color: "text-amber-400" },
    { name: "SeekerSlayer", color: "text-green-400" },
    { name: "JBGamer", color: "text-yellow-400" },
    { name: "FanOfJB", color: "text-purple-400" },
];

const botMessages = [
    "Anyone up for a game?",
    "That last round was intense!",
    "Jack Black is a legend!",
    "What's the best hiding spot on the main map?",
    "Just got a new high score!",
    "The sneak radar is so cool.",
    "Lobby is filling up fast!",
    "Who's seeking next?",
    "GG everyone!",
];

interface CommunityChatProps {
    username: string;
}

const CommunityChat: React.FC<CommunityChatProps> = ({ username }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        const initialMessages: ChatMessage[] = [
            { id: 1, author: "Admin", text: "Welcome to the Jack Black Hide n Seek community chat!", color: "text-orange-400" },
            { id: 2, author: "Gamer123", text: "Hey everyone!", color: "text-red-400" },
        ];
        setMessages(initialMessages);

        const interval = setInterval(() => {
            const author = botAuthors[Math.floor(Math.random() * botAuthors.length)];
            const text = botMessages[Math.floor(Math.random() * botMessages.length)];
            const newMessage: ChatMessage = {
                id: Date.now(),
                author: author.name,
                text,
                color: author.color,
            };
            setMessages(prev => [...prev, newMessage]);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() === '') return;

        const newMessage: ChatMessage = {
            id: Date.now(),
            author: username,
            text: input,
            color: 'text-white font-bold',
        };
        setMessages(prev => [...prev, newMessage]);
        setInput('');
    };

    return (
        <div className="flex flex-col h-full p-4">
            <h3 className="font-bangers text-3xl text-center text-orange-400 tracking-wider mb-4">Community Chat</h3>
            <div className="flex-grow bg-black/30 rounded-lg p-2 overflow-y-auto mb-4">
                {messages.map(msg => (
                    <div key={msg.id} className="text-sm mb-1">
                        <span className={`font-semibold ${msg.color}`}>{msg.author}:</span>
                        <span className="text-gray-300 ml-1">{msg.text}</span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full bg-gray-900/80 border border-orange-500/50 rounded-lg py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
            </form>
        </div>
    );
};

export default CommunityChat;
