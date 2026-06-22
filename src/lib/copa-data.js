// Copa do Mundo 2026 - Data & Utilities
// Teams, Groups, Historical Data

export const TEAMS = {
    "Brasil": { flag: "🇧🇷", code: "BRA", confederation: "CONMEBOL", fifa_rank: 5 },
    "Argentina": { flag: "🇦🇷", code: "ARG", confederation: "CONMEBOL", fifa_rank: 1 },
    "França": { flag: "🇫🇷", code: "FRA", confederation: "UEFA", fifa_rank: 2 },
    "Inglaterra": { flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", code: "ENG", confederation: "UEFA", fifa_rank: 4 },
    "Espanha": { flag: "🇪🇸", code: "ESP", confederation: "UEFA", fifa_rank: 3 },
    "Alemanha": { flag: "🇩🇪", code: "GER", confederation: "UEFA", fifa_rank: 11 },
    "Portugal": { flag: "🇵🇹", code: "POR", confederation: "UEFA", fifa_rank: 6 },
    "Holanda": { flag: "🇳🇱", code: "NED", confederation: "UEFA", fifa_rank: 7 },
    "Itália": { flag: "🇮🇹", code: "ITA", confederation: "UEFA", fifa_rank: 9 },
    "Bélgica": { flag: "🇧🇪", code: "BEL", confederation: "UEFA", fifa_rank: 8 },
    "Colômbia": { flag: "🇨🇴", code: "COL", confederation: "CONMEBOL", fifa_rank: 10 },
    "Uruguai": { flag: "🇺🇾", code: "URU", confederation: "CONMEBOL", fifa_rank: 13 },
    "Croácia": { flag: "🇭🇷", code: "CRO", confederation: "UEFA", fifa_rank: 12 },
    "México": { flag: "🇲🇽", code: "MEX", confederation: "CONCACAF", fifa_rank: 14 },
    "EUA": { flag: "🇺🇸", code: "USA", confederation: "CONCACAF", fifa_rank: 16 },
    "Canadá": { flag: "🇨🇦", code: "CAN", confederation: "CONCACAF", fifa_rank: 40 },
    "Marrocos": { flag: "🇲🇦", code: "MAR", confederation: "CAF", fifa_rank: 15 },
    "Japão": { flag: "🇯🇵", code: "JPN", confederation: "AFC", fifa_rank: 17 },
    "Senegal": { flag: "🇸🇳", code: "SEN", confederation: "CAF", fifa_rank: 18 },
    "Irã": { flag: "🇮🇷", code: "IRN", confederation: "AFC", fifa_rank: 20 },
    "Coreia do Sul": { flag: "🇰🇷", code: "KOR", confederation: "AFC", fifa_rank: 22 },
    "Suíça": { flag: "🇨🇭", code: "SUI", confederation: "UEFA", fifa_rank: 19 },
    "Dinamarca": { flag: "🇩🇰", code: "DEN", confederation: "UEFA", fifa_rank: 21 },
    "Áustria": { flag: "🇦🇹", code: "AUT", confederation: "UEFA", fifa_rank: 23 },
    "Sérvia": { flag: "🇷🇸", code: "SRB", confederation: "UEFA", fifa_rank: 33 },
    "Polônia": { flag: "🇵🇱", code: "POL", confederation: "UEFA", fifa_rank: 24 },
    "Equador": { flag: "🇪🇨", code: "ECU", confederation: "CONMEBOL", fifa_rank: 25 },
    "Paraguai": { flag: "🇵🇾", code: "PAR", confederation: "CONMEBOL", fifa_rank: 55 },
    "Austrália": { flag: "🇦🇺", code: "AUS", confederation: "AFC", fifa_rank: 26 },
    "Gana": { flag: "🇬🇭", code: "GHA", confederation: "CAF", fifa_rank: 45 },
    "Camarões": { flag: "🇨🇲", code: "CMR", confederation: "CAF", fifa_rank: 42 },
    "Nigéria": { flag: "🇳🇬", code: "NGA", confederation: "CAF", fifa_rank: 28 },
    "Tunísia": { flag: "🇹🇳", code: "TUN", confederation: "CAF", fifa_rank: 35 },
    "Costa Rica": { flag: "🇨🇷", code: "CRC", confederation: "CONCACAF", fifa_rank: 48 },
    "Jamaica": { flag: "🇯🇲", code: "JAM", confederation: "CONCACAF", fifa_rank: 58 },
    "Honduras": { flag: "🇭🇳", code: "HON", confederation: "CONCACAF", fifa_rank: 72 },
    "Arábia Saudita": { flag: "🇸🇦", code: "KSA", confederation: "AFC", fifa_rank: 56 },
    "Qatar": { flag: "🇶🇦", code: "QAT", confederation: "AFC", fifa_rank: 46 },
    "Uzbequistão": { flag: "🇺🇿", code: "UZB", confederation: "AFC", fifa_rank: 52 },
    "Turquia": { flag: "🇹🇷", code: "TUR", confederation: "UEFA", fifa_rank: 30 },
    "Ucrânia": { flag: "🇺🇦", code: "UKR", confederation: "UEFA", fifa_rank: 27 },
    "País de Gales": { flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", code: "WAL", confederation: "UEFA", fifa_rank: 29 },
    "Escócia": { flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", code: "SCO", confederation: "UEFA", fifa_rank: 39 },
    "Chile": { flag: "🇨🇱", code: "CHI", confederation: "CONMEBOL", fifa_rank: 31 },
    "Peru": { flag: "🇵🇪", code: "PER", confederation: "CONMEBOL", fifa_rank: 32 },
    "Bolívia": { flag: "🇧🇴", code: "BOL", confederation: "CONMEBOL", fifa_rank: 82 },
    "Venezuela": { flag: "🇻🇪", code: "VEN", confederation: "CONMEBOL", fifa_rank: 52 },
    "Panamá": { flag: "🇵🇦", code: "PAN", confederation: "CONCACAF", fifa_rank: 43 },
};

export const GROUPS_2026 = {
    A: ["EUA", "Marrocos", "Escócia", "Bolívia"],
    B: ["México", "Argentina", "Uzbequistão", "Jamaica"],
    C: ["Canadá", "Alemanha", "Equador", "Honduras"],
    D: ["Brasil", "Colômbia", "Irã", "Costa Rica"],
    E: ["França", "Japão", "Gana", "Panamá"],
    F: ["Espanha", "Holanda", "Nigéria", "Paraguai"],
    G: ["Inglaterra", "Bélgica", "Senegal", "Qatar"],
    H: ["Portugal", "Uruguai", "Coreia do Sul", "Arábia Saudita"],
    I: ["Itália", "Áustria", "Turquia", "Tunísia"],
    J: ["Croácia", "Dinamarca", "Austrália", "Camarões"],
    K: ["Suíça", "Polônia", "Chile", "Ucrânia"],
    L: ["Sérvia", "Peru", "Venezuela", "País de Gales"],
};

export const ALL_TEAMS_LIST = Object.keys(TEAMS).sort();

export function getTeamInfo(teamName) {
    return TEAMS[teamName] || { flag: "🏳️", code: "???", confederation: "?", fifa_rank: 999 };
}

export const STAGE_LABELS = {
    group: "Fase de Grupos",
    round_of_16: "Oitavas de Final",
    quarter_final: "Quartas de Final",
    semi_final: "Semifinal",
    third_place: "Disputa de 3º Lugar",
    final: "Final",
};

export const STATUS_LABELS = {
    scheduled: "Agendado",
    live: "Ao Vivo",
    finished: "Encerrado",
    postponed: "Adiado",
};

// Historical World Cup Winners
export const WORLD_CUP_HISTORY = [
    { year: 2022, host: "Qatar", champion: "Argentina", runnerUp: "França" },
    { year: 2018, host: "Rússia", champion: "França", runnerUp: "Croácia" },
    { year: 2014, host: "Brasil", champion: "Alemanha", runnerUp: "Argentina" },
    { year: 2010, host: "África do Sul", champion: "Espanha", runnerUp: "Holanda" },
    { year: 2006, host: "Alemanha", champion: "Itália", runnerUp: "França" },
    { year: 2002, host: "Japão/Coreia", champion: "Brasil", runnerUp: "Alemanha" },
    { year: 1998, host: "França", champion: "França", runnerUp: "Brasil" },
    { year: 1994, host: "EUA", champion: "Brasil", runnerUp: "Itália" },
    { year: 1990, host: "Itália", champion: "Alemanha", runnerUp: "Argentina" },
    { year: 1986, host: "México", champion: "Argentina", runnerUp: "Alemanha" },
    { year: 1982, host: "Espanha", champion: "Itália", runnerUp: "Alemanha" },
    { year: 1978, host: "Argentina", champion: "Argentina", runnerUp: "Holanda" },
    { year: 1974, host: "Alemanha", champion: "Alemanha", runnerUp: "Holanda" },
    { year: 1970, host: "México", champion: "Brasil", runnerUp: "Itália" },
    { year: 1966, host: "Inglaterra", champion: "Inglaterra", runnerUp: "Alemanha" },
    { year: 1962, host: "Chile", champion: "Brasil", runnerUp: "Tchecoslováquia" },
    { year: 1958, host: "Suécia", champion: "Brasil", runnerUp: "Suécia" },
    { year: 1954, host: "Suíça", champion: "Alemanha", runnerUp: "Hungria" },
    { year: 1950, host: "Brasil", champion: "Uruguai", runnerUp: "Brasil" },
    { year: 1938, host: "França", champion: "Itália", runnerUp: "Hungria" },
    { year: 1934, host: "Itália", champion: "Itália", runnerUp: "Tchecoslováquia" },
    { year: 1930, host: "Uruguai", champion: "Uruguai", runnerUp: "Argentina" },
];

export const ALL_TIME_TOP_SCORERS = [
    { player: "Miroslav Klose", country: "Alemanha", goals: 16, cups: "2002-2014" },
    { player: "Ronaldo", country: "Brasil", goals: 15, cups: "1998-2006" },
    { player: "Gerd Müller", country: "Alemanha", goals: 14, cups: "1970-1974" },
    { player: "Just Fontaine", country: "França", goals: 13, cups: "1958" },
    { player: "Pelé", country: "Brasil", goals: 12, cups: "1958-1970" },
    { player: "Sándor Kocsis", country: "Hungria", goals: 11, cups: "1954" },
    { player: "Jürgen Klinsmann", country: "Alemanha", goals: 11, cups: "1990-1998" },
    { player: "Kylian Mbappé", country: "França", goals: 12, cups: "2018-2022" },
    { player: "Helmut Rahn", country: "Alemanha", goals: 10, cups: "1954-1958" },
    { player: "Gary Lineker", country: "Inglaterra", goals: 10, cups: "1986-1990" },
    { player: "Gabriel Batistuta", country: "Argentina", goals: 10, cups: "1994-2002" },
    { player: "Teófilo Cubillas", country: "Peru", goals: 10, cups: "1970-1978" },
];

export const TITLES_COUNT = {
    "Brasil": 5,
    "Alemanha": 4,
    "Itália": 4,
    "Argentina": 3,
    "França": 2,
    "Uruguai": 2,
    "Inglaterra": 1,
    "Espanha": 1,
};

// Scoring rules
export function calculatePredictionPoints(pred, match) {
    if (!match || match.status !== "finished" || pred.home_score_pred == null || pred.away_score_pred == null) {
        return 0;
    }

    const { home_score, away_score } = match;
    const { home_score_pred, away_score_pred } = pred;

    // Exact score
    if (home_score_pred === home_score && away_score_pred === away_score) {
        return 2;
    }

    // Correct outcome
    const actualResult = home_score > away_score ? "home" : home_score < away_score ? "away" : "draw";
    const predResult = home_score_pred > away_score_pred ? "home" : home_score_pred < away_score_pred ? "away" : "draw";

    if (actualResult === predResult) {
        return 1;
    }

    return 0;
}

export function isMatchLocked(kickoffAt) {
    if (!kickoffAt) return false;
    const kickoff = new Date(kickoffAt);
    const now = new Date();
    const diff = kickoff.getTime() - now.getTime();
    return diff < 60000; // Less than 1 minute
}

export function isChampionPredictionLocked() {
    const deadline = new Date("2025-06-28T23:59:00-03:00");
    return new Date() > deadline;
}