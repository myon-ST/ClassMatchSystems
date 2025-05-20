export interface BasketballScore {
  firstHalf: number
  secondHalf: number
  freeThrow?: number  // 同点時のフリースロー
}

export interface EditHistory {
  timestamp: string
  type: 'score_change' | 'status_change' | 'time_change' | 'save' | 'free_throw'
  description: string
}

export interface Match {
  id: string
  round: number
  matchNumber: number
  team1: string
  team2: string
  scores: {
    team1: BasketballScore
    team2: BasketballScore
  }
  winner: string | null
  startTime: string
  endTime: string
  status: 'waiting' | 'in_progress' | 'finished'
  matchCode: string
  isEditing: boolean
  editHistory: EditHistory[]
  needsFreeThrow: boolean  // 同点時のフリースロー必要フラグ
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