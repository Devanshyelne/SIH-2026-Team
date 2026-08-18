const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://setu-backend-keb8.onrender.com";

export interface AuthUser {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: AuthUser;
}

export interface CurrentUserResponse {
  success: boolean;
  message?: string;
  user?: AuthUser;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  try {
    const response = await fetch(
      `${API_BASE_URL}${path}`,
      {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
      },
    );

    const text = await response.text();

    let data: any = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = {
        message: text,
      };
    }

    if (!response.ok) {
      throw new Error(
        data?.message ||
          data?.error ||
          `Request failed with status ${response.status}`,
      );
    }

    return data as T;

  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Unable to connect to SETU backend. Please check the backend URL and CORS settings.",
      );
    }

    throw error;
  }
}

// ==========================================
// AUTH
// ==========================================

export async function registerUser(
  username: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  return request<AuthResponse>(
    "/api/auth/register",
    {
      method: "POST",
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    },
  );
}

export async function loginUser(
  identifier: string,
  password: string,
): Promise<AuthResponse> {
  return request<AuthResponse>(
    "/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify({
        identifier,
        password,
      }),
    },
  );
}

export async function getCurrentUser(
  token: string,
): Promise<CurrentUserResponse> {
  return request<CurrentUserResponse>(
    "/api/auth/me",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
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

  return request(
    `/api/journeys/route?${params.toString()}`,
  );
}

// ==========================================
// CHATBOT
// ==========================================

export async function askChatbot(
  question: string,
) {
  return request("/api/chatbot", {
    method: "POST",
    body: JSON.stringify({
      question,
    }),
  });
}

// ==========================================
// CROWD DATA
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

  return request(
    `/api/crowd/predict?${params.toString()}`,
  );
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

  return request(
    `/api/crowd/routes?${params.toString()}`,
  );
}