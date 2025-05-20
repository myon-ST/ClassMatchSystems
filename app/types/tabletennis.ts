export interface TableTennisScore {
  set1: number
  set2: number
  set3: number
}

export interface EditHistory {
  timestamp: string
  type: 'score_change' | 'status_change' | 'time_change' | 'save'
  description: string
}

export interface CategoryMatch {
  scores: {
    team1: TableTennisScore
    team2: TableTennisScore
  }
  setsWon: {
    team1: number
    team2: number
  }
  winner: string | null
}

export interface Match {
  id: string
  round: number
  matchNumber: number
  team1: string
  team2: string
  categories: {
    mens_singles: CategoryMatch
    womens_singles: CategoryMatch
    mens_doubles: CategoryMatch
    womens_doubles: CategoryMatch
    mixed_doubles: CategoryMatch
  }
  categoryWins: {
    team1: number
    team2: number
  }
  winner: string | null
  startTime: string
  endTime: string
  status: 'waiting' | 'in_progress' | 'finished'
  matchCode: string
  isEditing: boolean
  editHistory: EditHistory[]
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

export interface ClassResult {
  class: string
  wins: number
  categories: {
    mens_singles: number
    womens_singles: number
    mens_doubles: number
    womens_doubles: number
    mixed_doubles: number
  }
} 