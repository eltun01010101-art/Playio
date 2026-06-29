const API_URL = 'http://localhost:4000';

export async function registerUser(data: {
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
  const response = await fetch(`${API_URL}/teams`);
  return response.json();
}

export async function createTeam(data: {
  name: string;
  game: string;
}) {
  const response = await fetch(`${API_URL}/teams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
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
}) {
  const response = await fetch(`${API_URL}/tournaments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return response.json();
}