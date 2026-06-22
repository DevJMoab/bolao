import { TEAMS } from '@/lib/copa-data';

// Banco de dados em memória e sincronizado no localStorage
const INITIAL_MATCHES = [
  // Vamos gerar os jogos a partir das chaves do grupo definidas no copa-data se necessário,
  // ou fornecer uma lista padrão simulada de jogos para a Copa 2026.
  { id: "m1", stage: "group", group: "D", home_team: "Brasil", away_team: "Colômbia", kickoff_at: "2026-06-25T17:00:00-03:00", status: "scheduled", home_score: null, away_score: null },
  { id: "m2", stage: "group", group: "D", home_team: "Irã", away_team: "Costa Rica", kickoff_at: "2026-06-25T20:00:00-03:00", status: "scheduled", home_score: null, away_score: null },
  { id: "m3", stage: "group", group: "B", home_team: "Argentina", away_team: "México", kickoff_at: "2026-06-26T15:00:00-03:00", status: "scheduled", home_score: null, away_score: null },
  { id: "m4", stage: "group", group: "A", home_team: "EUA", away_team: "Marrocos", kickoff_at: "2026-06-26T18:00:00-03:00", status: "scheduled", home_score: null, away_score: null },
  { id: "m5", stage: "group", group: "C", home_team: "Canadá", away_team: "Alemanha", kickoff_at: "2026-06-27T13:00:00-03:00", status: "scheduled", home_score: null, away_score: null },
  { id: "m6", stage: "group", group: "F", home_team: "Espanha", away_team: "Holanda", kickoff_at: "2026-06-27T16:00:00-03:00", status: "scheduled", home_score: null, away_score: null },
  { id: "m7", stage: "group", group: "G", home_team: "Inglaterra", away_team: "Bélgica", kickoff_at: "2026-06-28T19:00:00-03:00", status: "scheduled", home_score: null, away_score: null },
  { id: "m8", stage: "group", group: "H", home_team: "Portugal", away_team: "Uruguai", kickoff_at: "2026-06-28T22:00:00-03:00", status: "scheduled", home_score: null, away_score: null }
];

const getLocalStorageItem = (key, defaultValue) => {
  const item = localStorage.getItem(key);
  if (!item) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(item);
  } catch {
    return defaultValue;
  }
};

const setLocalStorageItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Seeding inicial
getLocalStorageItem("bolao_matches", INITIAL_MATCHES);
getLocalStorageItem("bolao_predictions", []);
getLocalStorageItem("bolao_tournament_predictions", []);
getLocalStorageItem("bolao_standings", [
  { id: "s1", full_name: "Guilherme Silva", total_points: 15, avatar_url: "" },
  { id: "s2", full_name: "Mariana Souza", total_points: 12, avatar_url: "" },
  { id: "s3", full_name: "Pedro Santos", total_points: 10, avatar_url: "" },
  { id: "s4", full_name: "Ana Costa", total_points: 8, avatar_url: "" }
]);

export const base44 = {
  auth: {
    me: async () => {
      const token = localStorage.getItem("base44_access_token");
      if (!token) throw { status: 401, message: "Unauthorized" };
      const users = getLocalStorageItem("bolao_users", []);
      const user = users.find(u => u.token === token) || {
        id: "mock-user-id",
        email: "mock@user.com",
        full_name: "Jogador de Teste",
        avatar_url: ""
      };
      return user;
    },
    loginViaEmailPassword: async (email, password) => {
      const users = getLocalStorageItem("bolao_users", []);
      let user = users.find(u => u.email === email);
      if (!user) {
        // Criar usuário sob demanda se não existir
        user = {
          id: `usr_${Date.now()}`,
          email,
          full_name: email.split("@")[0],
          token: `token_${Date.now()}`
        };
        users.push(user);
        setLocalStorageItem("bolao_users", users);
      }
      localStorage.setItem("base44_access_token", user.token);
      return user;
    },
    register: async ({ email, password }) => {
      const users = getLocalStorageItem("bolao_users", []);
      if (users.find(u => u.email === email)) {
        throw new Error("Usuário já cadastrado");
      }
      const newUser = {
        id: `usr_${Date.now()}`,
        email,
        full_name: email.split("@")[0],
        token: `token_${Date.now()}`
      };
      users.push(newUser);
      setLocalStorageItem("bolao_users", users);
      return newUser;
    },
    verifyOtp: async ({ email, otpCode }) => {
      const users = getLocalStorageItem("bolao_users", []);
      const user = users.find(u => u.email === email) || {
        id: `usr_${Date.now()}`,
        email,
        full_name: email.split("@")[0],
        token: `token_${Date.now()}`
      };
      return { access_token: user.token };
    },
    resendOtp: async (email) => {
      return true;
    },
    resetPassword: async ({ resetToken, newPassword }) => {
      return true;
    },
    setToken: (token) => {
      localStorage.setItem("base44_access_token", token);
    },
    logout: (redirectUrl) => {
      localStorage.removeItem("base44_access_token");
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    },
    redirectToLogin: (redirectUrl) => {
      window.location.href = `/login?from=${encodeURIComponent(redirectUrl)}`;
    },
    loginWithProvider: (provider, path) => {
      const mockUser = {
        id: "mock-google-id",
        email: "google@user.com",
        full_name: "Jogador Google",
        token: "google_token_123"
      };
      const users = getLocalStorageItem("bolao_users", []);
      if (!users.find(u => u.email === mockUser.email)) {
        users.push(mockUser);
        setLocalStorageItem("bolao_users", users);
      }
      localStorage.setItem("base44_access_token", mockUser.token);
      window.location.href = path || "/";
    }
  },
  entities: {
    Match: {
      list: async (sortBy, limit) => {
        return getLocalStorageItem("bolao_matches", INITIAL_MATCHES);
      },
      filter: async (filters) => {
        let matches = getLocalStorageItem("bolao_matches", INITIAL_MATCHES);
        if (filters && filters.stage) {
          matches = matches.filter(m => m.stage === filters.stage);
        }
        return matches;
      }
    },
    Prediction: {
      filter: async (filters) => {
        const predictions = getLocalStorageItem("bolao_predictions", []);
        if (filters && filters.created_by_id) {
          return predictions.filter(p => p.created_by_id === filters.created_by_id);
        }
        return predictions;
      },
      create: async (data) => {
        const predictions = getLocalStorageItem("bolao_predictions", []);
        const newPrediction = {
          id: `pred_${Date.now()}`,
          ...data,
          created_at: new Date().toISOString()
        };
        predictions.push(newPrediction);
        setLocalStorageItem("bolao_predictions", predictions);
        return newPrediction;
      },
      update: async (id, data) => {
        const predictions = getLocalStorageItem("bolao_predictions", []);
        const index = predictions.findIndex(p => p.id === id);
        if (index !== -1) {
          predictions[index] = { ...predictions[index], ...data };
          setLocalStorageItem("bolao_predictions", predictions);
          return predictions[index];
        }
        throw new Error("Prediction not found");
      }
    },
    TournamentPrediction: {
      filter: async (filters) => {
        const tournamentPredictions = getLocalStorageItem("bolao_tournament_predictions", []);
        if (filters && filters.created_by_id) {
          return tournamentPredictions.filter(p => p.created_by_id === filters.created_by_id);
        }
        return tournamentPredictions;
      },
      create: async (data) => {
        const tournamentPredictions = getLocalStorageItem("bolao_tournament_predictions", []);
        const newTP = {
          id: `tp_${Date.now()}`,
          ...data,
          created_at: new Date().toISOString()
        };
        tournamentPredictions.push(newTP);
        setLocalStorageItem("bolao_tournament_predictions", tournamentPredictions);
        return newTP;
      },
      update: async (id, data) => {
        const tournamentPredictions = getLocalStorageItem("bolao_tournament_predictions", []);
        const index = tournamentPredictions.findIndex(p => p.id === id);
        if (index !== -1) {
          tournamentPredictions[index] = { ...tournamentPredictions[index], ...data };
          setLocalStorageItem("bolao_tournament_predictions", tournamentPredictions);
          return tournamentPredictions[index];
        }
        throw new Error("Tournament prediction not found");
      }
    },
    Standing: {
      list: async (sortBy, limit) => {
        const standings = getLocalStorageItem("bolao_standings", []);
        return standings.sort((a, b) => b.total_points - a.total_points).slice(0, limit);
      },
      filter: async (filters) => {
        const standings = getLocalStorageItem("bolao_standings", []);
        if (filters && filters.created_by_id) {
          // Garante que o usuário logado tenha uma pontuação na lista
          let userStanding = standings.find(s => s.created_by_id === filters.created_by_id);
          if (!userStanding) {
            userStanding = {
              id: `st_${Date.now()}`,
              created_by_id: filters.created_by_id,
              full_name: "Jogador de Teste",
              total_points: 0,
              avatar_url: ""
            };
            standings.push(userStanding);
            setLocalStorageItem("bolao_standings", standings);
          }
          return [userStanding];
        }
        return standings;
      }
    }
  }
};
