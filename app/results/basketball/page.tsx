'use client'

import { useState, useEffect } from 'react'
import { BasketballMatch, BasketballRanking, BasketballStatistics } from '@/app/types/basketball'

export default function BasketballResults() {
  const [menMatches, setMenMatches] = useState<BasketballMatch[]>([])
  const [womenMatches, setWomenMatches] = useState<BasketballMatch[]>([])
  const [menRankings, setMenRankings] = useState<BasketballRanking[]>([])
  const [womenRankings, setWomenRankings] = useState<BasketballRanking[]>([])
  const [statistics, setStatistics] = useState<BasketballStatistics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [pageLoadTime] = useState(new Date())
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [selectedGender, setSelectedGender] = useState<'men' | 'women'>('men')

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setIsLoading(true)
      
      // 男子試合データ取得
      const menResponse = await fetch('/api/basketball/matches?gender=men')
      if (menResponse.ok) {
        const menData = await menResponse.json()
        setMenMatches(menData)
      }

      // 女子試合データ取得
      const womenResponse = await fetch('/api/basketball/matches?gender=women')
      if (womenResponse.ok) {
        const womenData = await womenResponse.json()
        setWomenMatches(womenData)
      }

      // 男子順位データ取得
      const menRankingsResponse = await fetch('/api/basketball/rankings?gender=men')
      if (menRankingsResponse.ok) {
        const menRankingsData = await menRankingsResponse.json()
        setMenRankings(menRankingsData)
      }

      // 女子順位データ取得
      const womenRankingsResponse = await fetch('/api/basketball/rankings?gender=women')
      if (womenRankingsResponse.ok) {
        const womenRankingsData = await womenRankingsResponse.json()
        setWomenRankings(womenRankingsData)
      }

      // 統計データ取得
      const statsResponse = await fetch('/api/basketball/statistics')
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStatistics(statsData)
        if (statsData.lastUpdated) {
          setLastUpdated(new Date(statsData.lastUpdated))
        }
      }

    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getCurrentMatches = () => selectedGender === 'men' ? menMatches : womenMatches
  const getCurrentRankings = () => selectedGender === 'men' ? menRankings : womenRankings

  const getTodayMatches = () => {
    const today = new Date().toDateString()
    const allMatches = [...menMatches, ...womenMatches]
    return allMatches
      .filter(match => match.status === 'finished' && match.updatedAt && new Date(match.updatedAt).toDateString() === today)
      .sort((a, b) => {
        const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
        const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
        return bTime - aTime
      })
  }

  const getMatchStatusDisplay = (match: BasketballMatch) => {
    switch (match.status) {
      case 'waiting':
        return {
          text: '開始前',
          color: 'bg-gray-100 text-gray-700',
          time: match.scheduledTime ? `予定: ${match.scheduledTime}` : ''
        }
      case 'in_progress':
        return {
          text: 'LIVE',
          color: 'bg-red-100 text-red-700 animate-pulse',
          time: match.startTime ? `開始: ${match.startTime}` : ''
        }
      case 'finished':
        return {
          text: '試合終了',
          color: 'bg-green-100 text-green-700',
          time: match.endTime ? `終了: ${match.endTime}` : ''
        }
      default:
        return {
          text: '不明',
          color: 'bg-gray-100 text-gray-700',
          time: ''
        }
    }
  }

  const calculateTotalScore = (match: BasketballMatch, team: 'team1' | 'team2') => {
    const scores = match.scores[team]
    return scores.firstHalf + scores.secondHalf + (match.isFreeThrowNeeded ? scores.freeThrow : 0)
  }

  const getRoundName = (round: number) => {
    switch (round) {
      case 1: return '1回戦'
      case 2: return '2回戦'
      case 3: return '3回戦'
      case 4: return '準決勝'
      case 5: return '決勝・3位決定戦'
      default: return `${round}回戦`
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">データを読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white shadow-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🏀 バスケットボール試合結果
              </h1>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p>📅 ページ読み込み: {pageLoadTime.toLocaleString('ja-JP')}</p>
                {lastUpdated && (
                  <p>🔄 最終更新: {lastUpdated.toLocaleString('ja-JP')}</p>
                )}
              </div>
            </div>
            
            {/* 性別切り替えタブ */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setSelectedGender('men')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  selectedGender === 'men'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                男子
              </button>
              <button
                onClick={() => setSelectedGender('women')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  selectedGender === 'women'
                    ? 'bg-pink-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                女子
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* トーナメント表 */}
        <div className="bg-white rounded-lg shadow-md border p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            🏆 {selectedGender === 'men' ? '男子' : '女子'}トーナメント表
          </h2>
          
          <div className="space-y-8">
            {[1, 2, 3, 4, 5].map(round => {
              const roundMatches = getCurrentMatches().filter(match => match.round === round)
              if (roundMatches.length === 0) return null

              return (
                <div key={round} className="border-l-4 border-orange-500 pl-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {getRoundName(round)}
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {roundMatches.map(match => {
                      const statusInfo = getMatchStatusDisplay(match)
                      const team1Total = calculateTotalScore(match, 'team1')
                      const team2Total = calculateTotalScore(match, 'team2')
                      
                      return (
                        <div key={match.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-mono text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {match.matchCode}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                {statusInfo.text}
                              </span>
                              {statusInfo.time && (
                                <span className="text-xs text-gray-500">{statusInfo.time}</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className={`flex items-center justify-between p-2 rounded ${
                              match.winner === match.team1 ? 'bg-green-100 border border-green-200' : 'bg-white'
                            }`}>
                              <span className="font-medium">{match.team1}</span>
                              <span className="font-bold text-lg">{team1Total}</span>
                            </div>
                            <div className={`flex items-center justify-between p-2 rounded ${
                              match.winner === match.team2 ? 'bg-green-100 border border-green-200' : 'bg-white'
                            }`}>
                              <span className="font-medium">{match.team2}</span>
                              <span className="font-bold text-lg">{team2Total}</span>
                            </div>
                          </div>
                          
                          {match.winner && (
                            <div className="mt-2 text-center">
                              <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                                🏆 勝者: {match.winner}
                              </span>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 本日の試合結果 */}
        <div className="bg-white rounded-lg shadow-md border p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 本日の試合結果</h2>
          <div className="space-y-3">
            {getTodayMatches().length > 0 ? (
              getTodayMatches().map(match => {
                const team1Total = calculateTotalScore(match, 'team1')
                const team2Total = calculateTotalScore(match, 'team2')
                
                return (
                  <div key={match.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {match.matchCode}
                      </span>
                      <span className="text-sm text-gray-600">
                        {match.gender === 'men' ? '男子' : '女子'}
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">
                        {match.team1} {team1Total} - {team2Total} {match.team2}
                      </div>
                      <div className="text-sm text-gray-600">
                        勝者: {match.winner}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {match.updatedAt && new Date(match.updatedAt).toLocaleTimeString('ja-JP', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-gray-500 text-center py-8">本日の試合結果はありません</p>
            )}
          </div>
        </div>

        {/* 大会統計 */}
        {statistics && (
          <div className="bg-white rounded-lg shadow-md border p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📈 大会統計</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{statistics.totalMatches}</div>
                <div className="text-sm text-gray-600">総試合数</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{statistics.completedMatches}</div>
                <div className="text-sm text-gray-600">完了試合数</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-3xl font-bold text-orange-600">{statistics.highestScore.score}</div>
                <div className="text-sm text-gray-600">最高得点</div>
                <div className="text-xs text-gray-500">{statistics.highestScore.team}</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">{statistics.freeThrowMatches}</div>
                <div className="text-sm text-gray-600">フリースロー決着</div>
              </div>
            </div>
          </div>
        )}

        {/* 結果詳細 */}
        <div className="bg-white rounded-lg shadow-md border p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            📋 {selectedGender === 'men' ? '男子' : '女子'}結果詳細
          </h2>
          
          <div className="space-y-6">
            {getCurrentMatches()
              .filter(match => match.status === 'finished')
              .map(match => {
                const team1Total = calculateTotalScore(match, 'team1')
                const team2Total = calculateTotalScore(match, 'team2')
                
                return (
                  <div key={match.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-lg bg-blue-100 text-blue-800 px-3 py-2 rounded">
                          {match.matchCode}
                        </span>
                        <span className="text-lg font-semibold">
                          {getRoundName(match.round)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {match.endTime && `終了: ${match.endTime}`}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* チーム1 */}
                      <div className={`p-4 rounded-lg border-2 ${
                        match.winner === match.team1 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 bg-gray-50'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-lg font-semibold">{match.team1}</h4>
                          {match.winner === match.team1 && (
                            <span className="text-green-600 font-bold">🏆 勝利</span>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>前半</span>
                            <span className="font-bold">{match.scores.team1.firstHalf}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>後半</span>
                            <span className="font-bold">{match.scores.team1.secondHalf}</span>
                          </div>
                          {match.isFreeThrowNeeded && (
                            <div className="flex justify-between">
                              <span>フリースロー</span>
                              <span className="font-bold">{match.scores.team1.freeThrow}</span>
                            </div>
                          )}
                          <div className="border-t pt-2 flex justify-between text-lg font-bold">
                            <span>合計</span>
                            <span>{team1Total}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* チーム2 */}
                      <div className={`p-4 rounded-lg border-2 ${
                        match.winner === match.team2 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 bg-gray-50'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-lg font-semibold">{match.team2}</h4>
                          {match.winner === match.team2 && (
                            <span className="text-green-600 font-bold">🏆 勝利</span>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>前半</span>
                            <span className="font-bold">{match.scores.team2.firstHalf}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>後半</span>
                            <span className="font-bold">{match.scores.team2.secondHalf}</span>
                          </div>
                          {match.isFreeThrowNeeded && (
                            <div className="flex justify-between">
                              <span>フリースロー</span>
                              <span className="font-bold">{match.scores.team2.freeThrow}</span>
                            </div>
                          )}
                          <div className="border-t pt-2 flex justify-between text-lg font-bold">
                            <span>合計</span>
                            <span>{team2Total}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>

        {/* 順位表 */}
        <div className="bg-white rounded-lg shadow-md border p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            🏅 {selectedGender === 'men' ? '男子' : '女子'}順位表
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold">順位</th>
                  <th className="text-left py-3 px-4 font-semibold">クラス</th>
                  <th className="text-left py-3 px-4 font-semibold">敗退時期</th>
                </tr>
              </thead>
              <tbody>
                {getCurrentRankings()
                  .sort((a, b) => (a.rank || 999) - (b.rank || 999))
                  .map((ranking, index) => (
                    <tr key={ranking.id} className={`border-b border-gray-100 ${
                      index < 3 ? 'bg-yellow-50' : ''
                    }`}>
                      <td className="py-3 px-4">
                        <span className={`font-bold ${
                          ranking.rank === 1 ? 'text-yellow-600' :
                          ranking.rank === 2 ? 'text-gray-600' :
                          ranking.rank === 3 ? 'text-orange-600' :
                          'text-gray-800'
                        }`}>
                          {ranking.rankText}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium">{ranking.className}</td>
                      <td className="py-3 px-4 text-gray-600">{ranking.eliminatedAt || '-'}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 