'use client'

import { useState, useEffect } from 'react'

interface BasketballRanking {
  id: number
  className: string
  gender: string
  rank: number | null
  rankText: string | null
  eliminatedAt: string | null
  createdAt: string
  updatedAt: string
}

interface BasketballRankingsProps {
  gender: 'men' | 'women'
}

export default function BasketballRankings({ gender }: BasketballRankingsProps) {
  const [rankings, setRankings] = useState<BasketballRanking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRankings()
  }, [gender])

  const fetchRankings = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/basketball/rankings?gender=${gender}`)
      if (response.ok) {
        const data = await response.json()
        setRankings(data)
      }
    } catch (error) {
      console.error('Error fetching rankings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateRanking = async (className: string, rank: number | null, rankText: string | null, eliminatedAt: string | null = null) => {
    try {
      const response = await fetch('/api/basketball/rankings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          className,
          gender,
          rank,
          rankText,
          eliminatedAt
        })
      })

      if (response.ok) {
        await fetchRankings()
      }
    } catch (error) {
      console.error('Error updating ranking:', error)
    }
  }

  const getRankColor = (rankText: string | null) => {
    if (!rankText) return 'text-gray-500'
    
    switch (rankText) {
      case '1位': return 'text-yellow-600 font-bold'
      case '2位': return 'text-gray-600 font-bold'
      case '3位': return 'text-orange-600 font-bold'
      case '4位': return 'text-blue-600 font-semibold'
      case 'ベスト8': return 'text-green-600'
      case 'ベスト16': return 'text-purple-600'
      case 'ベスト19': return 'text-red-600'
      default: return 'text-gray-500'
    }
  }

  const allClasses = [
    '1-1', '1-2', '1-3', '1-4', '1-5', '1-6',
    '2-1', '2-2', '2-3', '2-4', '2-5', '2-6',
    '3-1', '3-2', '3-3', '3-4', '3-5', '3-6',
    '教職員'
  ]

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          🏆 {gender === 'men' ? '男子' : '女子'}バスケットボール順位表
        </h3>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-500 mt-2">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-6">
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
        🏆 {gender === 'men' ? '男子' : '女子'}バスケットボール順位表
      </h3>
      
      <div className="space-y-3 sm:space-y-4">
        {/* 自動決定された順位表示 */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 sm:mb-3 gap-2">
            <h4 className="font-semibold text-gray-700 text-sm sm:text-base">現在の順位（自動決定）</h4>
            <span className="text-xs text-gray-500">※試合結果に基づいて自動更新されます</span>
          </div>
          {rankings.length === 0 ? (
            <div className="text-center py-6 sm:py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-sm">まだ試合が終了していないため、順位が確定していません</p>
              <p className="text-gray-400 text-xs mt-1">試合終了後に自動的に順位が決定されます</p>
            </div>
          ) : (
            <div className="space-y-1 sm:space-y-2">
              {rankings
                .sort((a, b) => {
                  // 1位〜4位を優先してソート
                  if (a.rank && b.rank) return a.rank - b.rank
                  if (a.rank) return -1
                  if (b.rank) return 1
                  
                  // ベスト順でソート
                  const rankOrder = ['ベスト4', 'ベスト8', 'ベスト16', 'ベスト19']
                  const aIndex = a.rankText ? rankOrder.indexOf(a.rankText) : -1
                  const bIndex = b.rankText ? rankOrder.indexOf(b.rankText) : -1
                  
                  if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
                  if (aIndex !== -1) return -1
                  if (bIndex !== -1) return 1
                  
                  return a.className.localeCompare(b.className)
                })
                .map((ranking, index) => (
                  <div key={ranking.id} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between py-2 sm:py-3 px-3 sm:px-4 rounded-lg border-l-4 gap-2 sm:gap-3 ${
                    ranking.rank === 1 ? 'bg-yellow-50 border-yellow-400' :
                    ranking.rank === 2 ? 'bg-gray-50 border-gray-400' :
                    ranking.rank === 3 ? 'bg-orange-50 border-orange-400' :
                    ranking.rank === 4 ? 'bg-blue-50 border-blue-400' :
                    'bg-gray-50 border-gray-300'
                  }`}>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex items-center gap-1 sm:gap-2">
                        {ranking.rank === 1 && <span className="text-lg sm:text-xl">🥇</span>}
                        {ranking.rank === 2 && <span className="text-lg sm:text-xl">🥈</span>}
                        {ranking.rank === 3 && <span className="text-lg sm:text-xl">🥉</span>}
                        {ranking.rank === 4 && <span className="text-base sm:text-lg">🏅</span>}
                        {!ranking.rank && <span className="text-base sm:text-lg">📊</span>}
                        <span className="font-bold text-base sm:text-lg">{ranking.className}</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3">
                      <span className={`font-semibold text-base sm:text-lg ${getRankColor(ranking.rankText)}`}>
                        {ranking.rankText || '未確定'}
                      </span>
                      {ranking.eliminatedAt && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {ranking.eliminatedAt}で敗退
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* 順位説明 */}
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg">
          <h5 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">順位決定方法</h5>
          <div className="text-xs sm:text-sm text-blue-800 space-y-1">
            <p>• <strong>1位・2位</strong>: 決勝戦の勝者・敗者</p>
            <p>• <strong>3位・4位</strong>: 3位決定戦の勝者・敗者</p>
            <p>• <strong>ベスト4</strong>: 準決勝敗退</p>
            <p>• <strong>ベスト8</strong>: 3回戦敗退</p>
            <p>• <strong>ベスト16</strong>: 2回戦敗退</p>
            <p>• <strong>ベスト19</strong>: 1回戦敗退</p>
          </div>
        </div>
      </div>
    </div>
  )
} 