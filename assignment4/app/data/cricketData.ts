interface CricketInning {
  matchId: string;
  team: string;
  sixesHit: number;
  opponent: string;
}

// This is the mock data for T20I innings.
// Each object represents one team's innings in a match,
// which is the correct structure for your analysis.
export const cricketData: CricketInning[] = [
  { matchId: "T20I-001", team: "India", sixesHit: 8, opponent: "Australia" },
  { matchId: "T20I-001", team: "Australia", sixesHit: 11, opponent: "India" },
  { matchId: "T20I-002", team: "England", sixesHit: 14, opponent: "Pakistan" },
  { matchId: "T20I-002", team: "Pakistan", sixesHit: 7, opponent: "England" },
  { matchId: "T20I-003", team: "West Indies", sixesHit: 15, opponent: "South Africa" },
  { matchId: "T20I-003", team: "South Africa", sixesHit: 9, opponent: "West Indies" },
  { matchId: "T20I-004", team: "New Zealand", sixesHit: 6, opponent: "India" },
  { matchId: "T20I-004", team: "India", sixesHit: 7, opponent: "New Zealand" },
  { matchId: "T20I-005", team: "Australia", sixesHit: 12, opponent: "England" },
  { matchId: "T20I-005", team: "England", sixesHit: 10, opponent: "Australia" },
  { matchId: "T20I-006", team: "Pakistan", sixesHit: 4, opponent: "New Zealand" },
  { matchId: "T20I-006", team: "New Zealand", sixesHit: 5, opponent: "Pakistan" },
  { matchId: "T20I-007", team: "South Africa", sixesHit: 8, opponent: "India" },
  { matchId: "T20I-007", team: "India", sixesHit: 9, opponent: "South Africa" },
  { matchId: "T20I-008", team: "West Indies", sixesHit: 18, opponent: "England" },
  { matchId: "T20I-008", team: "England", sixesHit: 11, opponent: "West Indies" },
  { matchId: "T20I-009", team: "Australia", sixesHit: 7, opponent: "Pakistan" },
  { matchId: "T20I-009", team: "Pakistan", sixesHit: 5, opponent: "Australia" },
  { matchId: "T20I-010", team: "India", sixesHit: 13, opponent: "West Indies" },
  { matchId: "T20I-010", team: "West Indies", sixesHit: 10, opponent: "India" },
  { matchId: "T20I-011", team: "New Zealand", sixesHit: 9, opponent: "South Africa" },
  { matchId: "T20I-011", team: "South Africa", sixesHit: 7, opponent: "New Zealand" },
  { matchId: "T20I-012", team: "England", sixesHit: 8, opponent: "India" },
  { matchId: "T20I-012", team: "India", sixesHit: 6, opponent: "England" },
  { matchId: "T20I-013", team: "Australia", sixesHit: 10, opponent: "West Indies" },
  { matchId: "T20I-013", team: "West Indies", sixesHit: 12, opponent: "Australia" },
  { matchId: "T20I-014", team: "Pakistan", sixesHit: 9, opponent: "South Africa" },
  { matchId: "T20I-014", team: "South Africa", sixesHit: 11, opponent: "Pakistan" },
  { matchId: "T20I-015", team: "New Zealand", sixesHit: 13, opponent: "England" },
  { matchId: "T20I-015", team: "England", sixesHit: 12, opponent: "New Zealand" },
  { matchId: "T20I-016", team: "India", sixesHit: 5, opponent: "Pakistan" },
  { matchId: "T20I-016", team: "Pakistan", sixesHit: 6, opponent: "India" },
  { matchId: "T20I-017", team: "Australia", sixesHit: 9, opponent: "South Africa" },
  { matchId: "T20I-017", team: "South Africa", sixesHit: 8, opponent: "Australia" },
  { matchId: "T20I-018", team: "West Indies", sixesHit: 11, opponent: "New Zealand" },
  { matchId: "T20I-018", team: "New Zealand", sixesHit: 10, opponent: "West Indies" },
  { matchId: "T20I-019", team: "India", sixesHit: 10, opponent: "England" },
  { matchId: "T20I-019", team: "England", sixesHit: 9, opponent: "India" },
  { matchId: "T20I-020", team: "Australia", sixesHit: 14, opponent: "New Zealand" },
  { matchId: "T20I-020", team: "New Zealand", sixesHit: 12, opponent: "Australia" },
];
