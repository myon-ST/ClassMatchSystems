'use client'

import { useState, useEffect } from 'react'
import { TableTennisMatch, Tournament, SaveLog, TableTennisGame, EditHistory } from '@/app/types/tabletennis'
import TableTennisRankings from '@/app/components/TableTennisRankings'

export default function TableTennisEdit() {
  const [tournament, setTournament] = useState<Tournament>({
    matches: []
  })
  const [saveLogs, setSaveLogs] = useState<SaveLog[]>([])
  const [showSaveMessage, setShowSaveMessage] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // データベースから試合データを取得
  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/tabletennis/matches')
      if (response.ok) {
        const matches = await response.json()
        setTournament({ matches })
      } else {
        // データがない場合は初期化
        await initializeTournament()
      }
    } catch (error) {
      console.error('Error fetching matches:', error)
      await initializeTournament()
    } finally {
      setIsLoading(false)
    }
  }

  const initializeTournament = async () => {
    try {
      const response = await fetch('/api/tabletennis/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      if (response.ok) {
        await fetchMatches()
      }
    } catch (error) {
      console.error('Error initializing tournament:', error)
    }
  }

  // トーナメントリセット機能
  const resetTournament = async () => {
    if (confirm('トーナメントをリセットしますか？すべてのデータが削除されます。')) {
      try {
        const response = await fetch('/api/tabletennis/reset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
        if (response.ok) {
          // リセット後に初期データを再作成
          await initializeTournament()
          setSaveLogs([])
          setShowSaveMessage(false)
        }
      } catch (error) {
        console.error('Error resetting tournament:', error)
      }
    }
  }

  // セット勝者を計算する関数
  const calculateSetWinner = (game: any): string | null => {
    let team1Sets = 0
    let team2Sets = 0

    // セット1
    if (game.set1.team1 >= 11 && game.set1.team1 - game.set1.team2 >= 2) team1Sets++
    else if (game.set1.team2 >= 11 && game.set1.team2 - game.set1.team1 >= 2) team2Sets++

    // セット2
    if (game.set2.team1 >= 11 && game.set2.team1 - game.set2.team2 >= 2) team1Sets++
    else if (game.set2.team2 >= 11 && game.set2.team2 - game.set1.team1 >= 2) team2Sets++

    // セット3
    if (game.set3.team1 >= 11 && game.set3.team1 - game.set3.team2 >= 2) team1Sets++
    else if (game.set3.team2 >= 11 && game.set3.team2 - game.set3.team1 >= 2) team2Sets++

    if (team1Sets >= 2) return 'team1'
    if (team2Sets >= 2) return 'team2'
    return null
  }

  // セット勝利数を計算する関数
  const calculateSetWins = (game: any): { team1Sets: number, team2Sets: number } => {
    let team1Sets = 0
    let team2Sets = 0

    // セット1
    if (game.set1.team1 >= 11 && game.set1.team1 - game.set1.team2 >= 2) team1Sets++
    else if (game.set1.team2 >= 11 && game.set1.team2 - game.set1.team1 >= 2) team2Sets++

    // セット2
    if (game.set2.team1 >= 11 && game.set2.team1 - game.set2.team2 >= 2) team1Sets++
    else if (game.set2.team2 >= 11 && game.set2.team2 - game.set1.team1 >= 2) team2Sets++

    // セット3
    if (game.set3.team1 >= 11 && game.set3.team1 - game.set3.team2 >= 2) team1Sets++
    else if (game.set3.team2 >= 11 && game.set3.team2 - game.set3.team1 >= 2) team2Sets++

    return { team1Sets, team2Sets }
  }

  // 試合全体の勝者を計算する関数
  const calculateMatchWinner = (match: any): { winner: string | null, team1Wins: number, team2Wins: number } => {
    let team1Wins = 0
    let team2Wins = 0

    // 各種目の勝者をカウント
    const games = [
      { game: match.menSingles, team1: match.team1, team2: match.team2 },
      { game: match.womenSingles, team1: match.team1, team2: match.team2 },
      { game: match.menDoubles, team1: match.team1, team2: match.team2 },
      { game: match.womenDoubles, team1: match.team1, team2: match.team2 },
      { game: match.mixedDoubles, team1: match.team1, team2: match.team2 }
    ]

    games.forEach(({ game, team1, team2 }) => {
      const setWinner = calculateSetWinner(game)
      if (setWinner === 'team1') team1Wins++
      else if (setWinner === 'team2') team2Wins++
    })

    const winner = team1Wins > team2Wins ? match.team1 : 
                   team2Wins > team1Wins ? match.team2 : null

    return { winner, team1Wins, team2Wins }
  }

  // 試合が終了可能かチェックする関数
  const canFinishMatch = (match: any): boolean => {
    const games = [match.menSingles, match.womenSingles, match.menDoubles, match.womenDoubles, match.mixedDoubles]
    
    // すべての種目で勝者が決定しているかチェック
    return games.every(game => {
      const setWinner = calculateSetWinner(game)
      return setWinner !== null
    })
  }

  // スコアの更新処理
  const handleScoreChange = async (
    matchId: string,
    gameType: 'menSingles' | 'womenSingles' | 'menDoubles' | 'womenDoubles' | 'mixedDoubles',
    team: 'team1' | 'team2',
    set: 'set1' | 'set2' | 'set3',
    value: string
  ) => {
    const score = parseInt(value) || 0
    
    try {
      const match = tournament.matches.find(m => m.id === matchId)
      if (!match) return

      const updateData: any = {}
      const fieldName = `${gameType}${team.charAt(0).toUpperCase() + team.slice(1)}${set.charAt(0).toUpperCase() + set.slice(1)}`
      updateData[fieldName] = score

      const response = await fetch(`/api/tabletennis/matches/${matchId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })

      if (response.ok) {
        const updatedMatch = await response.json()
        
        setTournament(prev => ({
          matches: prev.matches.map(m => 
            m.id === matchId ? { 
              ...updatedMatch, 
              isEditing: m.isEditing, 
              editHistory: m.editHistory
            } : m
          )
        }))
      }
    } catch (error) {
      console.error('Error updating score:', error)
    }
  }

  // 試合状態の更新
  const handleMatchStatus = async (matchId: string, newStatus: 'waiting' | 'in_progress' | 'finished') => {
    const match = tournament.matches.find(m => m.id === matchId)
    if (!match) return

    try {
      const currentTime = new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
      
      let updateData: any = { status: newStatus }
      
      if (newStatus === 'in_progress') {
        updateData.startTime = currentTime
      } else if (newStatus === 'finished') {
        updateData.endTime = currentTime
        
        // 試合結果を計算
        const { winner, team1Wins, team2Wins } = calculateMatchWinner(match as any)
        updateData.winner = winner
        updateData.team1Wins = team1Wins
        updateData.team2Wins = team2Wins
        
        if (winner) {
          // 次の試合に勝者を進出させる
          await advanceWinner(match as any, winner)
          
          // 順位を自動更新
          await updateRankingsAutomatically(match as any, winner)
        }
      }

      const response = await fetch(`/api/tabletennis/matches/${matchId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })

      if (response.ok) {
        const updatedMatch = await response.json()
        setTournament(prev => ({
          matches: prev.matches.map(m => 
            m.id === matchId ? { ...updatedMatch, isEditing: m.isEditing, editHistory: m.editHistory } : m
          )
        }))
      }
    } catch (error) {
      console.error('Error updating match status:', error)
    }
  }

  // 勝者を次の試合に進出させる
  const advanceWinner = async (match: any, winner: string) => {
    const advancementMap: { [key: string]: { nextMatch: string, position: 'team1' | 'team2' } } = {
      'TUA1': { nextMatch: 'TUA3', position: 'team2' },
      'TUB1': { nextMatch: 'TUB4', position: 'team1' },
      'TUB2': { nextMatch: 'TUB6', position: 'team1' },
      'TUA2': { nextMatch: 'TUA6', position: 'team2' },
      'TUA3': { nextMatch: 'TUA6', position: 'team1' },
      'TUA4': { nextMatch: 'TUA7', position: 'team1' },
      'TUA5': { nextMatch: 'TUA7', position: 'team2' },
      'TUB3': { nextMatch: 'TUB7', position: 'team1' },
      'TUB4': { nextMatch: 'TUB7', position: 'team2' },
      'TUB5': { nextMatch: 'TUB8', position: 'team1' },
      'TUB6': { nextMatch: 'TUB8', position: 'team2' },
      'TUA6': { nextMatch: 'TUA8', position: 'team1' },
      'TUA7': { nextMatch: 'TUA8', position: 'team2' },
      'TUB7': { nextMatch: 'TUB9', position: 'team1' },
      'TUB8': { nextMatch: 'TUB9', position: 'team2' },
      'TUA8': { nextMatch: 'TUA9', position: 'team1' },
      'TUB9': { nextMatch: 'TUA9', position: 'team2' }
    }

    const advancement = advancementMap[match.matchCode]
    if (advancement) {
      const nextMatch = tournament.matches.find(m => m.matchCode === advancement.nextMatch)
      if (nextMatch) {
        const updateData: any = {}
        updateData[advancement.position] = winner

        try {
          await fetch(`/api/tabletennis/matches/${nextMatch.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
          })
          
          // ローカル状態も更新
          setTournament(prev => ({
            matches: prev.matches.map(m => 
              m.id === nextMatch.id 
                ? { ...m, [advancement.position]: winner }
                : m
            )
          }))
        } catch (error) {
          console.error('Error advancing winner:', error)
        }
      }
    }

    // 準決勝の場合は敗者を3位決定戦に進出させる
    if (match.matchCode === 'TUA8' || match.matchCode === 'TUB9') {
      const loser = match.team1 === winner ? match.team2 : match.team1
      await advanceLoserToThirdPlace(match.matchCode, loser)
    }
  }

  // 準決勝敗者を3位決定戦に進出させる
  const advanceLoserToThirdPlace = async (matchCode: string, loser: string) => {
    const thirdPlaceMatch = tournament.matches.find(m => m.matchCode === 'TUB10')
    if (thirdPlaceMatch) {
      const position = matchCode === 'TUA8' ? 'team1' : 'team2'
      const updateData: any = {}
      updateData[position] = loser

      try {
        await fetch(`/api/tabletennis/matches/${thirdPlaceMatch.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        })
        
        // ローカル状態も更新
        setTournament(prev => ({
          matches: prev.matches.map(m => 
            m.id === thirdPlaceMatch.id 
              ? { ...m, [position]: loser }
              : m
          )
        }))
      } catch (error) {
        console.error('Error advancing loser to third place:', error)
      }
    }
  }

  // 順位を自動決定する関数
  const updateRankingsAutomatically = async (finishedMatch: any, winner: string) => {
    try {
      const loser = finishedMatch.team1 === winner ? finishedMatch.team2 : finishedMatch.team1
      
      // 再編集の場合は、この試合に関連する古い順位データを削除
      if (finishedMatch.status === 'finished') {
        await deleteOldRankings(finishedMatch.team1, finishedMatch.team2)
      }
      
      // 試合コードに基づいて順位を決定
      if (finishedMatch.matchCode === 'TUA9') {
        // 決勝戦: 勝者は1位、敗者は2位
        await updateRanking(winner, 1, '1位', null)
        await updateRanking(loser, 2, '2位', finishedMatch.matchCode)
      }
      else if (finishedMatch.matchCode === 'TUB10') {
        // 3位決定戦: 勝者は3位、敗者は4位
        await updateRanking(winner, 3, '3位', null)
        await updateRanking(loser, 4, '4位', finishedMatch.matchCode)
      }
      else if (finishedMatch.matchCode === 'TUA8' || finishedMatch.matchCode === 'TUB9') {
        // 準決勝: 敗者はベスト4（3位決定戦進出）
        await updateRanking(loser, null, 'ベスト4', finishedMatch.matchCode)
      }
      else if (finishedMatch.round === 3) {
        // 3回戦: 敗者はベスト8
        await updateRanking(loser, null, 'ベスト8', finishedMatch.matchCode)
      }
      else if (finishedMatch.round === 2) {
        // 2回戦: 敗者はベスト16
        await updateRanking(loser, null, 'ベスト16', finishedMatch.matchCode)
      }
      else if (finishedMatch.round === 1) {
        // 1回戦: 敗者はベスト19
        await updateRanking(loser, null, 'ベスト19', finishedMatch.matchCode)
      }
      
    } catch (error) {
      console.error('Error updating rankings automatically:', error)
    }
  }

  // 古い順位データを削除する関数
  const deleteOldRankings = async (team1: string, team2: string) => {
    try {
      await fetch('/api/tabletennis/rankings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          className: team1,
          rank: null,
          rankText: null,
          eliminatedAt: null
        })
      })
      
      await fetch('/api/tabletennis/rankings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          className: team2,
          rank: null,
          rankText: null,
          eliminatedAt: null
        })
      })
    } catch (error) {
      console.error('Error deleting old rankings:', error)
    }
  }

  // 順位更新API呼び出し
  const updateRanking = async (className: string, rank: number | null, rankText: string, eliminatedAt: string | null) => {
    try {
      const response = await fetch('/api/tabletennis/rankings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          className,
          rank,
          rankText,
          eliminatedAt
        })
      })

      if (!response.ok) {
        console.error('Failed to update ranking')
      }
    } catch (error) {
      console.error('Error updating ranking:', error)
    }
  }

  // 試合データの保存
  const handleSave = async (matchId: string) => {
    const match = tournament.matches.find(m => m.id === matchId)
    if (!match) return

    const { team1Wins, team2Wins } = calculateMatchWinner(match as any)

    const newLog: SaveLog = {
      timestamp: new Date().toLocaleString('ja-JP'),
      matchCode: match.matchCode,
      action: '試合データ保存',
      details: `${match.team1} vs ${match.team2} - 勝利数: ${team1Wins}-${team2Wins}`
    }

    setSaveLogs(prev => [newLog, ...prev])
    setShowSaveMessage(true)
    setTimeout(() => setShowSaveMessage(false), 3000)
  }

  // 予定時刻の更新
  const handleScheduledTimeChange = async (matchId: string, scheduledTime: string) => {
    try {
      const response = await fetch(`/api/tabletennis/matches/${matchId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduledTime })
      })

      if (response.ok) {
        setTournament(prev => ({
          matches: prev.matches.map(m => 
            m.id === matchId ? { ...m, scheduledTime } : m
          )
        }))
      }
    } catch (error) {
      console.error('Error updating scheduled time:', error)
    }
  }

  // ゲーム種目のスコア入力コンポーネント
  const GameScoreInput = ({ 
    match, 
    gameType, 
    gameTitle, 
    game 
  }: { 
    match: any, 
    gameType: 'menSingles' | 'womenSingles' | 'menDoubles' | 'womenDoubles' | 'mixedDoubles',
    gameTitle: string,
    game: any
  }) => {
    const setWinner = calculateSetWinner(game)
    const { team1Sets, team2Sets } = calculateSetWins(game)
    const isDisabled = match.status === 'waiting' || (match.status === 'finished' && !match.isEditing)

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-base text-gray-800">{gameTitle}</h4>
          {/* セット数表示 - シンプルな形式 */}
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm font-medium">
            {team1Sets}-{team2Sets}
          </div>
        </div>

        <div className="space-y-3">
          {/* チーム1 */}
          <div className={`flex items-center gap-4 p-2 rounded-md transition-all duration-200 ${
            team1Sets >= 2 ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
          }`}>
            <div className="w-24 text-sm font-medium text-gray-700 truncate">{match.team1}</div>
            <div className="flex gap-2">
              {['set1', 'set2', 'set3'].map((set, index) => (
                <div key={set} className="text-center">
                  <div className="text-xs text-gray-500 mb-1">セット{index + 1}</div>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={(game as any)[set].team1}
                    onChange={(e) => handleScoreChange(match.id, gameType, 'team1', set as 'set1' | 'set2' | 'set3', e.target.value)}
                    className="w-14 h-10 text-center border border-gray-300 rounded-md text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    disabled={isDisabled}
                  />
                </div>
              ))}
            </div>
            {team1Sets >= 2 && (
              <span className="text-green-600 text-sm font-medium">勝ち{team1Sets}-{team2Sets}</span>
            )}
          </div>
          
          {/* チーム2 */}
          <div className={`flex items-center gap-4 p-2 rounded-md transition-all duration-200 ${
            team2Sets >= 2 ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
          }`}>
            <div className="w-24 text-sm font-medium text-gray-700 truncate">{match.team2}</div>
            <div className="flex gap-2">
              {['set1', 'set2', 'set3'].map((set, index) => (
                <div key={set} className="text-center">
                  <div className="text-xs text-gray-500 mb-1">セット{index + 1}</div>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={(game as any)[set].team2}
                    onChange={(e) => handleScoreChange(match.id, gameType, 'team2', set as 'set1' | 'set2' | 'set3', e.target.value)}
                    className="w-14 h-10 text-center border border-gray-300 rounded-md text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    disabled={isDisabled}
                  />
                </div>
              ))}
            </div>
            {team2Sets >= 2 && (
              <span className="text-green-600 text-sm font-medium">勝ち{team2Sets}-{team1Sets}</span>
            )}
          </div>
        </div>

        {/* 勝者表示 */}
        {setWinner && (
          <div className="mt-3 text-center">
            <div className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-md text-sm font-medium">
              種目勝者: {setWinner === 'team1' ? match.team1 : match.team2}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">データを読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white shadow-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                🏓 卓球トーナメント
              </h1>
              <p className="text-base text-gray-600 mt-1">シングルエリミネーション式トーナメント</p>
            </div>
            <button
              onClick={resetTournament}
              className="w-full sm:w-auto bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
            >
              🔄 トーナメントリセット
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* 保存成功メッセージ */}
        {showSaveMessage && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50 max-w-sm">
            <p className="font-medium text-sm">✅ 保存完了！</p>
          </div>
        )}

        {/* トーナメント表示 */}
        <div className="space-y-8">
          {[1, 2, 3, 4, 5].map(round => {
            const roundMatches = tournament.matches.filter(match => match.round === round)
            if (roundMatches.length === 0) return null

            return (
              <div key={round} className="bg-white rounded-lg shadow-md border p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 pb-3 border-b">
                  {round === 1 ? '1回戦' : 
                   round === 2 ? '2回戦' : 
                   round === 3 ? '3回戦' : 
                   round === 4 ? '準決勝' : '決勝・3位決定戦'}
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  {roundMatches.map(match => {
                    const { winner, team1Wins, team2Wins } = calculateMatchWinner(match as any)
                    const canFinish = canFinishMatch(match as any)
                    
                    return (
                      <div key={match.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200">
                        {/* 試合情報ヘッダー */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-3 sm:gap-4 bg-white p-4 rounded-lg border">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                            <span className="font-mono text-sm bg-blue-100 text-blue-800 px-3 py-2 rounded-md font-medium">{(match as any).matchCode}</span>
                            <input
                              type="datetime-local"
                              value={(match as any).scheduledTime}
                              onChange={(e) => handleScheduledTimeChange((match as any).id, e.target.value)}
                              className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full sm:w-auto focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                              disabled={!(match as any).isEditing && (match as any).status === 'finished'}
                            />
                            {(match as any).status === 'in_progress' && (match as any).startTime && (
                              <span className="text-sm text-green-700 font-medium bg-green-100 px-3 py-1 rounded-md">
                                開始: {(match as any).startTime}
                              </span>
                            )}
                            {(match as any).status === 'finished' && (match as any).endTime && (
                              <span className="text-sm text-red-700 font-medium bg-red-100 px-3 py-1 rounded-md">
                                終了: {(match as any).endTime}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            {(match as any).status === 'waiting' && (
                              <button
                                onClick={() => handleMatchStatus((match as any).id, 'in_progress')}
                                className={`text-white px-4 py-2 rounded-md text-sm transition-all flex-1 sm:flex-none font-medium ${
                                  !(match as any).team1 || !(match as any).team2 || (match as any).team1.includes('勝者') || (match as any).team2.includes('勝者') || (match as any).team1.includes('敗者') || (match as any).team2.includes('敗者')
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-500 hover:bg-blue-600'
                                }`}
                                disabled={!(match as any).team1 || !(match as any).team2 || (match as any).team1.includes('勝者') || (match as any).team2.includes('勝者') || (match as any).team1.includes('敗者') || (match as any).team2.includes('敗者')}
                              >
                                🎯 試合開始
                              </button>
                            )}
                            {(match as any).status === 'in_progress' && (
                              <>
                                <button
                                  onClick={() => handleMatchStatus((match as any).id, 'finished')}
                                  className={`text-white px-4 py-2 rounded-md text-sm transition-all flex-1 sm:flex-none font-medium ${
                                    !canFinish
                                      ? 'bg-gray-400 cursor-not-allowed opacity-50'
                                      : 'bg-red-500 hover:bg-red-600'
                                  }`}
                                  disabled={!canFinish}
                                  title={!canFinish ? 'すべての種目を完了してください' : ''}
                                >
                                  🏁 試合終了
                                </button>
                                <button
                                  onClick={() => handleSave((match as any).id)}
                                  className="bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600 transition-all flex-1 sm:flex-none font-medium"
                                >
                                  💾 データ保存
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* 勝者表示 */}
                        {(match as any).winner && (
                          <div className="text-center mb-5">
                            <div className="inline-block px-6 py-3 bg-yellow-100 text-yellow-800 rounded-lg text-base font-medium border border-yellow-200">
                              🏆 試合勝者: {(match as any).winner} ({team1Wins}-{team2Wins})
                            </div>
                          </div>
                        )}

                        {/* 各種目のスコア入力（縦並び） */}
                        <div className="space-y-4">
                          <GameScoreInput 
                            match={match as any} 
                            gameType="menSingles" 
                            gameTitle="男子シングルス" 
                            game={(match as any).menSingles} 
                          />
                          <GameScoreInput 
                            match={match as any} 
                            gameType="womenSingles" 
                            gameTitle="女子シングルス" 
                            game={(match as any).womenSingles} 
                          />
                          <GameScoreInput 
                            match={match as any} 
                            gameType="menDoubles" 
                            gameTitle="男子ダブルス" 
                            game={(match as any).menDoubles} 
                          />
                          <GameScoreInput 
                            match={match as any} 
                            gameType="womenDoubles" 
                            gameTitle="女子ダブルス" 
                            game={(match as any).womenDoubles} 
                          />
                          <GameScoreInput 
                            match={match as any} 
                            gameType="mixedDoubles" 
                            gameTitle="ミックスダブルス" 
                            game={(match as any).mixedDoubles} 
                          />
                        </div>

                        {/* 試合結果サマリー */}
                        <div className="mt-6 pt-4 border-t border-gray-200">
                          <div className="flex justify-center items-center gap-6 text-base">
                            <div className={`font-medium px-4 py-2 rounded-md ${
                              winner === (match as any).team1 
                                ? 'text-white bg-green-500' 
                                : 'text-gray-700 bg-gray-200'
                            }`}>
                              {(match as any).team1}: {team1Wins}勝
                            </div>
                            <div className="text-xl font-bold text-gray-400">VS</div>
                            <div className={`font-medium px-4 py-2 rounded-md ${
                              winner === (match as any).team2 
                                ? 'text-white bg-green-500' 
                                : 'text-gray-700 bg-gray-200'
                            }`}>
                              {(match as any).team2}: {team2Wins}勝
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* 順位表 */}
        <TableTennisRankings />
      </div>
    </div>
  )
}