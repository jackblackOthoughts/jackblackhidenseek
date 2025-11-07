
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';

const botAuthors = [
    { name: "Shadow", color: "text-emerald-400" },
    { name: "Ghost", color: "text-rose-400" },
    { name: "Viper", color: "text-orange-400" },
    { name: "Echo", color: "text-amber-400" },
];

const botMessages = [
    "Where is everyone?",
    "I can't find anyone.",
    "Time is running out!",
    "I hear footsteps...",
    "Nice hiding spot!",
    "Found one!",
];

interface ChatProps {
    username: string;
}

const Chat: React.FC<ChatProps> = ({ username }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        const initialMessages: ChatMessage[] = [
            { id: 1, author: "Game", text: "Chat is now live. Good luck!", color: "text-orange-400" },
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
            setMessages(prev => [...prev.slice(-100), newMessage]); // Keep last 100 messages
        }, 8000);

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
        <div className="flex flex-col h-full bg-gray-900/50 rounded-lg p-4">
            <h3 className="font-bangers text-3xl text-center text-white tracking-wider mb-2">In-Game Chat</h3>
            <div className="flex-grow bg-black/30 rounded-lg p-2 overflow-y-auto mb-4 text-sm">
                {messages.map(msg => (
                    <div key={msg.id} className="mb-1">
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
                    placeholder="Chat with players..."
                    className="w-full bg-gray-900/80 border border-orange-500/50 rounded-lg py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
            </form>
        </div>
    );
};

export default Chat;
