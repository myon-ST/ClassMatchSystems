import { Tournament } from '../types/volleyball'

// ローカルストレージのキー
const STORAGE_KEY = 'volleyball_tournament_data'

// データの保存
export const saveTournamentData = (data: Tournament) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch (error) {
    console.error('Failed to save tournament data:', error)
    return false
  }
}

// データの読み込み
export const loadTournamentData = (): Tournament | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Failed to load tournament data:', error)
    return null
  }
}

// JSONファイルとしてエクスポート
export const exportTournamentData = (data: Tournament) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `volleyball_tournament_${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// JSONファイルからインポート
export const importTournamentData = (file: File): Promise<Tournament> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        resolve(data as Tournament)
      } catch (error) {
        reject(new Error('Invalid tournament data file'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
} 