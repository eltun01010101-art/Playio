const API_URL = 'http://localhost:4000';

export type TournamentStatus = 'upcoming' | 'active' | 'finished';

function getAuthHeaders() {
  const token = localStorage.getItem('token');

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function registerUser(data: {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}) {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return response.json();
}

export async function loginUser(data: {
  email: string;
  password: string;
}) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return response.json();
}

export async function getTeams() {
  const response = await fetch(`${API_URL}/teams`, {
    headers: getAuthHeaders(),
  });

  return response.json();
}

export async function createTeam(data: {
  name: string;
  game: string;
}) {
  const response = await fetch(`${API_URL}/teams`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return response.json();
}

export async function updateTeam(
  id: string,
  data: {
    name?: string;
    game?: string;
    logo?: string;
  },
) {
  const response = await fetch(`${API_URL}/teams/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return response.json();
}

export async function deleteTeam(id: string) {
  const response = await fetch(`${API_URL}/teams/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  return response.json();
}

export async function getTournaments() {
  const response = await fetch(`${API_URL}/tournaments`);
  return response.json();
}

export async function createTournament(data: {
  title: string;
  game: string;
  prizePool: number;
  maxTeams: number;
  status?: TournamentStatus;
}) {
  const response = await fetch(`${API_URL}/tournaments`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return response.json();
}

export async function updateTournament(
  id: string,
  data: {
    title?: string;
    game?: string;
    prizePool?: number;
    maxTeams?: number;
    status?: TournamentStatus;
  },
) {
  const response = await fetch(`${API_URL}/tournaments/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return response.json();
}

export async function deleteTournament(id: string) {
  const response = await fetch(`${API_URL}/tournaments/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  return response.json();
}

export async function getTournamentEntries() {
  const response = await fetch(`${API_URL}/tournament-entries`);
  return response.json();
}

export async function joinTournament(data: {
  tournamentId: string;
  teamId: string;
}) {
  const response = await fetch(`${API_URL}/tournament-entries`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return response.json();
}

export async function getMatchesByTournament(tournamentId: string) {
  const response = await fetch(`${API_URL}/matches/tournament/${tournamentId}`);
  return response.json();
}

export async function generateBracket(tournamentId: string) {
  const response = await fetch(`${API_URL}/matches/generate/${tournamentId}`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  return response.json();
}

export async function finishMatch(data: {
  matchId: string;
  scoreA: number;
  scoreB: number;
}) {
  const response = await fetch(`${API_URL}/matches/finish`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return response.json();
}

export type GameStatus = 'active' | 'inactive';

export async function getGames() {
  const response = await fetch(`${API_URL}/games`);
  return response.json();
}

export async function getActiveGames() {
  const response = await fetch(`${API_URL}/games/active`);
  return response.json();
}

export async function createGame(data: {
  name: string;
  slug: string;
  image?: string;
  genre?: string;
  platform?: string;
  status?: GameStatus;
}) {
  const response = await fetch(`${API_URL}/games`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return response.json();
}

export async function updateGame(
  id: string,
  data: {
    name?: string;
    slug?: string;
    image?: string;
    genre?: string;
    platform?: string;
    status?: GameStatus;
  },
) {
  const response = await fetch(`${API_URL}/games/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return response.json();
}

export async function deleteGame(id: string) {
  const response = await fetch(`${API_URL}/games/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  return response.json();
}

export async function getGameRooms() {
  const response = await fetch(`${API_URL}/game-rooms`);
  return response.json();
}

export async function getGameRoom(id: string) {
  const response = await fetch(`${API_URL}/game-rooms/${id}`);
  return response.json();
}

export async function createGameRoom() {
  const response = await fetch(`${API_URL}/game-rooms`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  return response.json();
}

export async function joinGameRoom(id: string) {
  const response = await fetch(`${API_URL}/game-rooms/${id}/join`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  return response.json();
}