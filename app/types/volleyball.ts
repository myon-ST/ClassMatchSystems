export interface VolleyballScore {
  score: number
}

export interface TeamStats {
  wins: number
  losses: number
  points: number
  scoreFor: number
  scoreAgainst: number
  pointDifference: number
}

export interface EditHistory {
  timestamp: string
  team1Score: number
  team2Score: number
}

export interface Match {
  id: string
  group: 'A' | 'B' | 'C' | 'Final'
  matchNumber: number
  team1: string
  team2: string
  scores: {
    team1: VolleyballScore
    team2: VolleyballScore
  }
  team1Stats?: TeamStats
  team2Stats?: TeamStats
  winner: string | null
  startTime: string | null
  endTime: string | null
  status: 'waiting' | 'in_progress' | 'finished'
  matchCode: string
  isEditing: boolean
  editHistory: EditHistory[]
}

export interface Team {
  id: string
  name: string
  stats: TeamStats
}

export interface Group {
  name: 'A' | 'B' | 'C' | 'Final'
  teams: { [key: string]: Team }
  matches: Array<Match>
  winner: string | null
}

export interface Tournament {
  groups: { [key: string]: Group }
  currentPhase: 'preliminary' | 'final'
}

export interface SaveLog {
  timestamp: string
  matchCode: string
  action: string
  details: string
} 