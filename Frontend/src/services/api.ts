const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://setu-backend-keb8.onrender.com";

async function request(path: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");

    throw new Error(
      errorText || `Request failed with status ${response.status}`,
    );
  }

  return response.json();
}

// ==========================================
// STATIONS
// ==========================================

export async function getStations() {
  return request("/api/stations");
}

// ==========================================
// FACILITIES
// ==========================================

export async function getFacilities() {
  return request("/api/facilities");
}

// ==========================================
// JOURNEYS
// ==========================================

export async function getJourneys() {
  return request("/api/journeys");
}

export async function findRoute(
  from: number,
  to: number,
  accessible = false,
) {
  const params = new URLSearchParams({
    from: String(from),
    to: String(to),
    accessible: String(accessible),
  });

  return request(`/api/journeys/route?${params.toString()}`);
}

// ==========================================
// CHATBOT
// ==========================================

export async function askChatbot(question: string) {
  return request("/api/chatbot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
    }),
  });
}

// ==========================================
// CROWD PREDICTION
// ==========================================

export async function getPredictedCrowd(
  hour = 18,
  day = 1,
  train = 5,
) {
  const params = new URLSearchParams({
    hour: String(hour),
    day: String(day),
    train: String(train),
  });

  return request(`/api/crowd?${params.toString()}`);
}

// ==========================================
// LOW-CROWD ROUTE
// ==========================================

export async function getLowCrowdRoute(
  hour = 18,
  day = 1,
  train = 5,
) {
  const params = new URLSearchParams({
    hour: String(hour),
    day: String(day),
    train: String(train),
  });

  return request(`/api/crowd/routes?${params.toString()}`);
}

// ==========================================
// AUTHENTICATION
// ==========================================

export interface AuthUser {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: AuthUser;
}

export async function loginUser(
  identifier: string,
  password: string,
): Promise<AuthResponse> {
  return request("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      identifier,
      password,
    }),
  });
}

export async function registerUser(
  username: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  return request("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });
}

export async function getCurrentUser(
  token: string,
): Promise<AuthResponse> {
  return request("/api/auth/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}