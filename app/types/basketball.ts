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

export interface BasketballMatch {
  id: string
  matchCode: string
  gender: 'men' | 'women'
  round: number
  matchNumber: number
  team1: string
  team2: string
  scores: {
    team1: {
      firstHalf: number
      secondHalf: number
      freeThrow: number
    }
    team2: {
      firstHalf: number
      secondHalf: number
      freeThrow: number
    }
  }
  winner: string | null
  scheduledTime: string
  startTime: string | null
  endTime: string | null
  status: 'waiting' | 'in_progress' | 'finished'
  isFreeThrowNeeded: boolean
  createdAt: string
  updatedAt: string
}

// 旧Match型との互換性のためのエイリアス
export interface Match extends BasketballMatch {}

export interface Tournament {
  matches: BasketballMatch[]
}

export interface SaveLog {
  timestamp: string
  matchCode: string
  action: string
  details: string
}

export interface BasketballRanking {
  id: number
  className: string
  gender: 'men' | 'women'
  rank: number | null
  rankText: string | null
  eliminatedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface BasketballStatistics {
  totalMatches: number
  completedMatches: number
  highestScore: {
    score: number
    team: string
    matchCode: string
  }
  freeThrowMatches: number
  lastUpdated: string
} 