import React, { useState } from 'react';

interface SignInScreenProps {
  onSignIn: (username: string, password: string) => { success: boolean; message?: string };
}

const SignInScreen: React.FC<SignInScreenProps> = ({ onSignIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    const result = onSignIn(username, password);
    if (!result.success) {
      setError(result.message || 'An unexpected error occurred.');
    }
    // On success, App component will re-render and this component will unmount.
  };

  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-900/50">
      <div className="w-full max-w-sm text-center">
        <h1 className="font-bangers text-8xl text-white tracking-widest" style={{ WebkitTextStroke: '3px #000' }}>
          Jack Black
        </h1>
        <h2 className="font-bangers text-5xl text-orange-400 tracking-wider mb-12" style={{ WebkitTextStroke: '2px #000' }}>
          Hide n Seek
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-2">Enter your name to play</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-900/80 border-2 border-orange-500/50 rounded-lg py-3 px-4 text-white text-center text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
              placeholder="Your Name"
              maxLength={15}
            />
          </div>
           <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-900/80 border-2 border-orange-500/50 rounded-lg py-3 px-4 text-white text-center text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
              placeholder="Password"
            />
          </div>
          
          {error && <p className="text-red-500 text-sm h-5">{error}</p>}

          <button
            type="submit"
            className="w-full bg-orange-500 text-gray-900 font-bold py-3 px-8 rounded-lg text-xl hover:bg-orange-400 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-orange-500/20 disabled:bg-gray-600 disabled:scale-100 disabled:cursor-not-allowed"
            disabled={!username.trim() || !password}
          >
            Login / Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignInScreen;
