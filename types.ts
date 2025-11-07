export enum GameMode {
  LobbyList,
  InLobby,
  Playing,
  Leaderboard,
}

export interface Player {
  id: string;
  name: string;
  isPlayer: boolean;
  x: number;
  y: number;
  role: 'hider' | 'seeker';
  isFound: boolean;
  color: string;
  isReady?: boolean;
  isHost?: boolean;
}

export interface Lobby {
    id: string;
    name: string;
    hostName: string;
    players: Player[];
    maxPlayers: number;
}

export enum Tile {
  Floor,    // Grass/Pavement
  Wall,     // Impassable building walls
  Building, // Inside of a building (passable)
  Road,     // Passable road tile
  Water,    // Impassable water
  Tree,     // Hiding spot
}

export interface ChatMessage {
  id: number;
  author: string;
  text: string;
  color: string;
}

export interface Score {
    name: string;
    score: number;
}