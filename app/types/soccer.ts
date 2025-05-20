export interface SoccerScore {
  firstHalf: number
  secondHalf: number
  penaltyKick?: number  // PK戦の得点
}

export interface EditHistory {
  timestamp: string
  type: 'score_change' | 'status_change' | 'time_change' | 'save' | 'penalty_kick'
  description: string
}

export interface Match {
  id: string
  round: number
  matchNumber: number
  team1: string
  team2: string
  scores: {
    team1: SoccerScore
    team2: SoccerScore
  }
  winner: string | null
  startTime: string
  endTime: string
  status: 'waiting' | 'in_progress' | 'finished'
  matchCode: string
  isEditing: boolean
  editHistory: EditHistory[]
  needsPenaltyKick: boolean  // PK戦必要フラグ
}

export interface Tournament {
  matches: Match[]
}

export interface SaveLog {
  timestamp: string
  matchCode: string
  action: string
  details: string
} 