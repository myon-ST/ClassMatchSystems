'use client'

import { useState, useEffect } from 'react'
import { BasketballMatch, Tournament, SaveLog, BasketballScore, EditHistory } from '@/app/types/basketball'
import BasketballRankings from '@/app/components/BasketballRankings'

export default function MenBasketballEdit() {
  const [tournament, setTournament] = useState<Tournament>({
    matches: []
  })
  const [saveLogs, setSaveLogs] = useState<SaveLog[]>([])
  const [showSaveMessage, setShowSaveMessage] = useState(false)
  const [showTieMessage, setShowTieMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // データベースから試合データを取得
  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/basketball/matches?gender=men')
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
      const response = await fetch('/api/basketball/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gender: 'men' })
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
        const response = await fetch('/api/basketball/reset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gender: 'men' })
        })
        if (response.ok) {
          await fetchMatches()
          setSaveLogs([])
          setShowSaveMessage(false)
          setShowTieMessage(null)
        }
      } catch (error) {
        console.error('Error resetting tournament:', error)
      }
    }
  }

  // スコアの合計を計算する関数
  const calculateTotalScore = (score: BasketballScore): number => {
    return score.firstHalf + score.secondHalf
  }

  // フリースローを含む合計点を計算
  const calculateFinalScore = (score: BasketballScore): number => {
    return calculateTotalScore(score) + (score.freeThrow || 0)
  }

  // 同点かどうかをチェックする関数
  const isTieGame = (match: BasketballMatch): boolean => {
    const team1Total = calculateTotalScore(match.scores.team1)
    const team2Total = calculateTotalScore(match.scores.team2)
    return team1Total === team2Total
  }

  // スコアの更新処理
  const handleScoreChange = async (
    matchId: string,
    team: 'team1' | 'team2',
    half: 'firstHalf' | 'secondHalf' | 'freeThrow',
    value: string
  ) => {
    const score = parseInt(value) || 0
    
    try {
      const match = tournament.matches.find(m => m.id === matchId)
      if (!match) return

      const updateData: any = {}
      updateData[`${team}${half.charAt(0).toUpperCase() + half.slice(1)}`] = score

      const response = await fetch(`/api/basketball/matches/${matchId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })

      if (response.ok) {
        const updatedMatch = await response.json()
        
        // 編集中の場合は勝者を再計算
        let newWinner = updatedMatch.winner
        if (match.isEditing && match.status === 'finished') {
          const team1Final = calculateFinalScore({
            firstHalf: updatedMatch.team1FirstHalf,
            secondHalf: updatedMatch.team1SecondHalf,
            freeThrow: updatedMatch.team1FreeThrow || 0
          })
          const team2Final = calculateFinalScore({
            firstHalf: updatedMatch.team2FirstHalf,
            secondHalf: updatedMatch.team2SecondHalf,
            freeThrow: updatedMatch.team2FreeThrow || 0
          })
          
          if (team1Final !== team2Final) {
            newWinner = team1Final > team2Final ? updatedMatch.team1 : updatedMatch.team2
          }
        }
        
        setTournament(prev => ({
          matches: prev.matches.map(m => 
            m.id === matchId ? { 
              ...updatedMatch, 
              isEditing: m.isEditing, 
              editHistory: m.editHistory,
              winner: newWinner
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
        
        const team1Total = calculateTotalScore(match.scores.team1)
        const team2Total = calculateTotalScore(match.scores.team2)

        // 同点で、まだフリースローが行われていない場合
        if (team1Total === team2Total && !match.scores.team1.freeThrow && !match.scores.team2.freeThrow) {
          setShowTieMessage(matchId)
          updateData.isFreeThrowNeeded = true
          updateData.status = 'in_progress' // 試合継続
        } else {
          // 勝者を決定
          const team1Final = calculateFinalScore(match.scores.team1)
          const team2Final = calculateFinalScore(match.scores.team2)
          updateData.winner = team1Final > team2Final ? match.team1 : match.team2
          
          // 次の試合に勝者を進出させる
          await advanceWinner(match, updateData.winner)
          
          // 順位を自動更新
          await updateRankingsAutomatically(match, updateData.winner)
        }
      }

      const response = await fetch(`/api/basketball/matches/${matchId}`, {
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
  const advanceWinner = async (match: BasketballMatch, winner: string) => {
    // 正しいトーナメント進出ロジックを実装
    const advancementMap: { [key: string]: { nextMatch: string, position: 'team1' | 'team2' } } = {
      'BMA1': { nextMatch: 'BMA5', position: 'team2' },
      'BMB1': { nextMatch: 'BMB5', position: 'team1' },
      'BMB2': { nextMatch: 'BMB6', position: 'team1' },
      'BMA2': { nextMatch: 'BMA6', position: 'team2' },
      'BMA3': { nextMatch: 'BMA6', position: 'team1' },
      'BMA4': { nextMatch: 'BMA7', position: 'team2' },
      'BMA5': { nextMatch: 'BMA7', position: 'team1' },
      'BMB3': { nextMatch: 'BMB7', position: 'team1' },
      'BMB4': { nextMatch: 'BMB8', position: 'team1' },
      'BMB5': { nextMatch: 'BMB7', position: 'team2' },
      'BMB6': { nextMatch: 'BMB8', position: 'team2' },
      'BMA6': { nextMatch: 'BMB9', position: 'team2' },
      'BMA7': { nextMatch: 'BMB9', position: 'team1' },
      'BMB7': { nextMatch: 'BMB10', position: 'team1' },
      'BMB8': { nextMatch: 'BMB10', position: 'team2' },
      'BMB9': { nextMatch: 'BMA8', position: 'team1' },
      'BMB10': { nextMatch: 'BMA8', position: 'team2' }
    }

    const advancement = advancementMap[match.matchCode]
    if (advancement) {
      const nextMatch = tournament.matches.find(m => m.matchCode === advancement.nextMatch)
      if (nextMatch) {
        const updateData: any = {}
        updateData[advancement.position] = winner

        try {
          await fetch(`/api/basketball/matches/${nextMatch.id}`, {
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
    if (match.matchCode === 'BMB9' || match.matchCode === 'BMB10') {
      const loser = match.team1 === winner ? match.team2 : match.team1
      await advanceLoserToThirdPlace(match.matchCode, loser)
    }
  }

  // 準決勝敗者を3位決定戦に進出させる
  const advanceLoserToThirdPlace = async (matchCode: string, loser: string) => {
    const thirdPlaceMatch = tournament.matches.find(m => m.matchCode === 'BMB11')
    if (thirdPlaceMatch) {
      const position = matchCode === 'BMB9' ? 'team1' : 'team2'
      const updateData: any = {}
      updateData[position] = loser

      try {
        await fetch(`/api/basketball/matches/${thirdPlaceMatch.id}`, {
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

  // 次の試合が開始されているかチェック
  const isNextMatchStarted = (match: BasketballMatch): boolean => {
    const advancementMap: { [key: string]: string } = {
      'BMA1': 'BMA5',
      'BMB1': 'BMB5',
      'BMB2': 'BMB6',
      'BMA2': 'BMA6',
      'BMA3': 'BMA6',
      'BMA4': 'BMA7',
      'BMA5': 'BMA7',
      'BMB3': 'BMB7',
      'BMB4': 'BMB8',
      'BMB5': 'BMB7',
      'BMB6': 'BMB8',
      'BMA6': 'BMB9',
      'BMA7': 'BMB9',
      'BMB7': 'BMB10',
      'BMB8': 'BMB10',
      'BMB9': 'BMA8',
      'BMB10': 'BMA8'
    }

    const nextMatchCode = advancementMap[match.matchCode]
    if (!nextMatchCode) return false

    const nextMatch = tournament.matches.find(m => m.matchCode === nextMatchCode)
    return nextMatch ? nextMatch.status !== 'waiting' : false
  }

  // 編集モードの切り替え
  const toggleEditMode = async (matchId: string) => {
    const match = tournament.matches.find(m => m.id === matchId)
    if (!match) return

    // 次の試合が開始されている場合は再編集不可
    if (match.status === 'finished' && !match.isEditing && isNextMatchStarted(match)) {
      alert('次の試合が既に開始されているため、この試合は再編集できません。')
      return
    }

    if (match.isEditing) {
      // 編集完了時に勝者を再計算
      const team1Final = calculateFinalScore(match.scores.team1)
      const team2Final = calculateFinalScore(match.scores.team2)
      
      if (team1Final === team2Final) {
        alert('同点のため勝者を決定できません。フリースローを入力してください。')
        return
      }

      const newWinner = team1Final > team2Final ? match.team1 : match.team2
      const oldWinner = match.winner

      try {
        // 勝者を更新
        const response = await fetch(`/api/basketball/matches/${matchId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ winner: newWinner })
        })

        if (response.ok) {
          // 勝者が変わった場合は次の試合も更新
          if (oldWinner !== newWinner) {
            await updateNextMatch(match, oldWinner, newWinner)
            // 順位も再更新
            await updateRankingsAutomatically(match, newWinner)
          }
          
          // ローカル状態の勝者も更新
          setTournament(prev => ({
            matches: prev.matches.map(m => 
              m.id === matchId ? { ...m, winner: newWinner } : m
            )
          }))
        }
      } catch (error) {
        console.error('Error updating winner:', error)
      }
    }

    setTournament(prev => ({
      matches: prev.matches.map(m => {
        if (m.id === matchId) {
          return { ...m, isEditing: !m.isEditing }
        }
        return m
      })
    }))
  }

  // 次の試合の更新処理
  const updateNextMatch = async (match: BasketballMatch, oldWinner: string | null, newWinner: string) => {
    const advancementMap: { [key: string]: { nextMatch: string, position: 'team1' | 'team2' } } = {
      'BMA1': { nextMatch: 'BMA5', position: 'team2' },
      'BMB1': { nextMatch: 'BMB5', position: 'team1' },
      'BMB2': { nextMatch: 'BMB6', position: 'team1' },
      'BMA2': { nextMatch: 'BMA6', position: 'team2' },
      'BMA3': { nextMatch: 'BMA6', position: 'team1' },
      'BMA4': { nextMatch: 'BMA7', position: 'team2' },
      'BMA5': { nextMatch: 'BMA7', position: 'team1' },
      'BMB3': { nextMatch: 'BMB7', position: 'team1' },
      'BMB4': { nextMatch: 'BMB8', position: 'team1' },
      'BMB5': { nextMatch: 'BMB7', position: 'team2' },
      'BMB6': { nextMatch: 'BMB8', position: 'team2' },
      'BMA6': { nextMatch: 'BMB9', position: 'team2' },
      'BMA7': { nextMatch: 'BMB9', position: 'team1' },
      'BMB7': { nextMatch: 'BMB10', position: 'team1' },
      'BMB8': { nextMatch: 'BMB10', position: 'team2' },
      'BMB9': { nextMatch: 'BMA8', position: 'team1' },
      'BMB10': { nextMatch: 'BMA8', position: 'team2' }
    }

    const advancement = advancementMap[match.matchCode]
    if (advancement) {
      const nextMatch = tournament.matches.find(m => m.matchCode === advancement.nextMatch)
      if (nextMatch && nextMatch.status === 'waiting') {
        const updateData: any = {}
        updateData[advancement.position] = newWinner

        try {
          await fetch(`/api/basketball/matches/${nextMatch.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
          })
          
          // ローカル状態も更新
          setTournament(prev => ({
            matches: prev.matches.map(m => 
              m.id === nextMatch.id 
                ? { ...m, [advancement.position]: newWinner }
                : m
            )
          }))
        } catch (error) {
          console.error('Error updating next match:', error)
        }
      }
    }

    // 準決勝の場合は3位決定戦の進出者も更新
    if (match.matchCode === 'BMB9' || match.matchCode === 'BMB10') {
      const newLoser = match.team1 === newWinner ? match.team2 : match.team1
      await updateThirdPlaceMatch(match.matchCode, newLoser)
    }
  }

  // 3位決定戦の進出者を更新
  const updateThirdPlaceMatch = async (matchCode: string, newLoser: string) => {
    const thirdPlaceMatch = tournament.matches.find(m => m.matchCode === 'BMB11')
    if (thirdPlaceMatch && thirdPlaceMatch.status === 'waiting') {
      const position = matchCode === 'BMB9' ? 'team1' : 'team2'
      const updateData: any = {}
      updateData[position] = newLoser

      try {
        await fetch(`/api/basketball/matches/${thirdPlaceMatch.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        })
        
        // ローカル状態も更新
        setTournament(prev => ({
          matches: prev.matches.map(m => 
            m.id === thirdPlaceMatch.id 
              ? { ...m, [position]: newLoser }
              : m
          )
        }))
      } catch (error) {
        console.error('Error updating third place match:', error)
      }
    }
  }

  // 試合データの保存
  const handleSave = async (matchId: string) => {
    const match = tournament.matches.find(m => m.id === matchId)
    if (!match) return

    const team1Total = calculateFinalScore(match.scores.team1)
    const team2Total = calculateFinalScore(match.scores.team2)

    const newLog: SaveLog = {
      timestamp: new Date().toLocaleString('ja-JP'),
      matchCode: match.matchCode,
      action: '試合データ保存',
      details: `${match.team1} vs ${match.team2} - スコア: ${team1Total}-${team2Total}`
    }

    setSaveLogs(prev => [newLog, ...prev])
    setShowSaveMessage(true)
    setTimeout(() => setShowSaveMessage(false), 3000)
  }

  // 予定時刻の更新
  const handleScheduledTimeChange = async (matchId: string, scheduledTime: string) => {
    try {
      const response = await fetch(`/api/basketball/matches/${matchId}`, {
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

  // 順位を自動決定する関数
  const updateRankingsAutomatically = async (finishedMatch: BasketballMatch, winner: string) => {
    try {
      // 敗者の順位を決定
      const loser = finishedMatch.team1 === winner ? finishedMatch.team2 : finishedMatch.team1
      
      // 再編集の場合は、この試合に関連する古い順位データを削除
      if (finishedMatch.status === 'finished') {
        await deleteOldRankings(finishedMatch.team1, finishedMatch.team2)
      }
      
      // 試合コードに基づいて順位を決定
      let rankText = ''
      let rank = null
      
      // 決勝戦の場合
      if (finishedMatch.matchCode === 'BMA8') {
        // 勝者は1位、敗者は2位
        await updateRanking(winner, 1, '1位', null)
        await updateRanking(loser, 2, '2位', finishedMatch.matchCode)
      }
      // 3位決定戦の場合
      else if (finishedMatch.matchCode === 'BMB11') {
        // 勝者は3位、敗者は4位
        await updateRanking(winner, 3, '3位', null)
        await updateRanking(loser, 4, '4位', finishedMatch.matchCode)
      }
      // 準決勝の場合
      else if (finishedMatch.matchCode === 'BMB9' || finishedMatch.matchCode === 'BMB10') {
        // 敗者はベスト4（3位決定戦進出）
        await updateRanking(loser, null, 'ベスト4', finishedMatch.matchCode)
      }
      // 3回戦の場合
      else if (finishedMatch.round === 3) {
        // 敗者はベスト8
        await updateRanking(loser, null, 'ベスト8', finishedMatch.matchCode)
      }
      // 2回戦の場合
      else if (finishedMatch.round === 2) {
        // 敗者はベスト16
        await updateRanking(loser, null, 'ベスト16', finishedMatch.matchCode)
      }
      // 1回戦の場合
      else if (finishedMatch.round === 1) {
        // 敗者はベスト19（1回戦敗退）
        await updateRanking(loser, null, 'ベスト19', finishedMatch.matchCode)
      }
      
    } catch (error) {
      console.error('Error updating rankings automatically:', error)
    }
  }

  // 古い順位データを削除する関数
  const deleteOldRankings = async (team1: string, team2: string) => {
    try {
      // 両チームの既存順位を削除
      await fetch('/api/basketball/rankings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          className: team1,
          gender: 'men',
          rank: null,
          rankText: null,
          eliminatedAt: null
        })
      })
      
      await fetch('/api/basketball/rankings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          className: team2,
          gender: 'men',
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
      const response = await fetch('/api/basketball/rankings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          className,
          gender: 'men',
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
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">🏀 男子バスケットボール</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">シングルエリミネーション式トーナメント</p>
            </div>
            <button
              onClick={resetTournament}
              className="w-full sm:w-auto bg-red-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm sm:text-base"
            >
              🔄 トーナメントリセット
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* 保存成功メッセージ */}
        {showSaveMessage && (
          <div className="fixed top-4 right-2 sm:right-4 bg-green-100 border border-green-400 text-green-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-lg z-50 max-w-xs sm:max-w-sm">
            <p className="font-medium text-sm sm:text-base">✅ 保存しました</p>
          </div>
        )}

        {/* 同点メッセージ */}
        {showTieMessage && (
          <div className="fixed top-4 right-2 sm:right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-lg z-50 max-w-xs sm:max-w-sm">
            <p className="font-medium text-sm sm:text-base">⚠️ 同点です。フリースローを入力してください。</p>
            <button 
              onClick={() => setShowTieMessage(null)}
              className="ml-2 text-yellow-800 hover:text-yellow-900 text-sm sm:text-base"
            >
              ✕
            </button>
          </div>
        )}

        {/* トーナメント表示 */}
        <div className="space-y-8">
          {[1, 2, 3, 4, 5].map(round => {
            const roundMatches = tournament.matches.filter(match => match.round === round)
            if (roundMatches.length === 0) return null

            return (
              <div key={round} className="bg-white rounded-lg shadow-sm border p-3 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 pb-2 border-b">
                  {round === 1 ? '1回戦' : 
                   round === 2 ? '2回戦' : 
                   round === 3 ? '3回戦' : 
                   round === 4 ? '準決勝' : '決勝・3位決定戦'}
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  {roundMatches.map(match => (
                    <div key={match.id} className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                      {/* 試合情報ヘッダー */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3 sm:gap-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                          <span className="font-mono text-xs sm:text-sm bg-gray-100 px-2 py-1 rounded">{match.matchCode}</span>
                          <input
                            type="datetime-local"
                            value={match.scheduledTime}
                            onChange={(e) => handleScheduledTimeChange(match.id, e.target.value)}
                            className="border rounded px-2 py-1 text-xs sm:text-sm w-full sm:w-auto"
                            disabled={!match.isEditing && match.status === 'finished'}
                          />
                          {match.status === 'finished' && match.endTime && (
                            <span className="text-xs sm:text-sm text-gray-500">終了: {match.endTime}</span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto">
                          {match.status === 'waiting' && (
                            <button
                              onClick={() => handleMatchStatus(match.id, 'in_progress')}
                              className={`text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm transition-colors flex-1 sm:flex-none ${
                                !match.team1 || !match.team2 || match.team1.includes('勝者') || match.team2.includes('勝者') || match.team1.includes('敗者') || match.team2.includes('敗者')
                                  ? 'bg-gray-400 cursor-not-allowed'
                                  : 'bg-blue-500 hover:bg-blue-600'
                              }`}
                              disabled={!match.team1 || !match.team2 || match.team1.includes('勝者') || match.team2.includes('勝者') || match.team1.includes('敗者') || match.team2.includes('敗者')}
                            >
                              開始
                            </button>
                          )}
                          {match.status === 'in_progress' && (
                            <>
                              <button
                                onClick={() => handleMatchStatus(match.id, 'finished')}
                                className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm hover:bg-red-600 transition-colors flex-1 sm:flex-none"
                              >
                                終了
                              </button>
                              <button
                                onClick={() => handleSave(match.id)}
                                className="bg-green-500 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm hover:bg-green-600 transition-colors flex-1 sm:flex-none"
                              >
                                保存
                              </button>
                            </>
                          )}
                          {match.status === 'finished' && !match.isEditing && !isNextMatchStarted(match) && (
                            <button
                              onClick={() => toggleEditMode(match.id)}
                              className="bg-yellow-500 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm hover:bg-yellow-600 transition-colors flex-1 sm:flex-none"
                            >
                              再編集
                            </button>
                          )}
                          {match.isEditing && (
                            <>
                              <button
                                onClick={() => handleSave(match.id)}
                                className="bg-green-500 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm hover:bg-green-600 transition-colors flex-1 sm:flex-none"
                              >
                                保存
                              </button>
                              <button
                                onClick={() => toggleEditMode(match.id)}
                                className="bg-gray-500 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm hover:bg-gray-600 transition-colors flex-1 sm:flex-none"
                              >
                                完了
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* 勝者表示 */}
                      {match.winner && (
                        <div className="text-center mb-3 sm:mb-4">
                          <span className="px-2 sm:px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs sm:text-sm font-medium">
                            🏆 勝者: {match.winner}
                          </span>
                        </div>
                      )}

                      {/* スコア入力エリア - モバイル対応 */}
                      <div className="space-y-2 sm:space-y-3">
                        {/* チーム1 */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                          <div className="w-full sm:w-24 text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-0">
                            {match.team1 || '未定'}
                            {match.winner === match.team1 && <span className="ml-1 text-yellow-500">👑</span>}
                          </div>
                          <div className="flex gap-1 sm:gap-2 w-full sm:w-auto">
                            <div className="flex-1 sm:flex-none">
                              <label className="block text-xs text-gray-500 mb-1">前半</label>
                              <input
                                type="number"
                                min="0"
                                value={match.scores.team1.firstHalf}
                                onChange={(e) => handleScoreChange(match.id, 'team1', 'firstHalf', e.target.value)}
                                className="w-full sm:w-12 lg:w-16 h-8 text-center border rounded focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                                disabled={!match.team1 || !match.team2 || (match.status !== 'in_progress' && !match.isEditing)}
                              />
                            </div>
                            <div className="flex-1 sm:flex-none">
                              <label className="block text-xs text-gray-500 mb-1">後半</label>
                              <input
                                type="number"
                                min="0"
                                value={match.scores.team1.secondHalf}
                                onChange={(e) => handleScoreChange(match.id, 'team1', 'secondHalf', e.target.value)}
                                className="w-full sm:w-12 lg:w-16 h-8 text-center border rounded focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                                disabled={!match.team1 || !match.team2 || (match.status !== 'in_progress' && !match.isEditing)}
                              />
                            </div>
                            {(match.isFreeThrowNeeded || (match.scores.team1.freeThrow && match.scores.team1.freeThrow > 0)) && (
                              <div className="flex-1 sm:flex-none">
                                <label className="block text-xs text-gray-500 mb-1">FT</label>
                                <input
                                  type="number"
                                  min="0"
                                  value={match.scores.team1.freeThrow || 0}
                                  onChange={(e) => handleScoreChange(match.id, 'team1', 'freeThrow', e.target.value)}
                                  className="w-full sm:w-12 lg:w-16 h-8 text-center border rounded focus:ring-2 focus:ring-yellow-500 bg-yellow-50 text-xs sm:text-sm"
                                  disabled={!match.team1 || !match.team2 || (match.status !== 'in_progress' && !match.isEditing)}
                                />
                              </div>
                            )}
                            <div className="flex-1 sm:flex-none">
                              <label className="block text-xs text-gray-500 mb-1">合計</label>
                              <div className="w-full sm:w-12 lg:w-16 h-8 flex items-center justify-center font-bold text-blue-600 bg-blue-50 rounded border text-xs sm:text-sm">
                                {calculateFinalScore(match.scores.team1)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* チーム2 */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                          <div className="w-full sm:w-24 text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-0">
                            {match.team2 || '未定'}
                            {match.winner === match.team2 && <span className="ml-1 text-yellow-500">👑</span>}
                          </div>
                          <div className="flex gap-1 sm:gap-2 w-full sm:w-auto">
                            <div className="flex-1 sm:flex-none">
                              <input
                                type="number"
                                min="0"
                                value={match.scores.team2.firstHalf}
                                onChange={(e) => handleScoreChange(match.id, 'team2', 'firstHalf', e.target.value)}
                                className="w-full sm:w-12 lg:w-16 h-8 text-center border rounded focus:ring-2 focus:ring-red-500 text-xs sm:text-sm"
                                disabled={!match.team1 || !match.team2 || (match.status !== 'in_progress' && !match.isEditing)}
                              />
                            </div>
                            <div className="flex-1 sm:flex-none">
                              <input
                                type="number"
                                min="0"
                                value={match.scores.team2.secondHalf}
                                onChange={(e) => handleScoreChange(match.id, 'team2', 'secondHalf', e.target.value)}
                                className="w-full sm:w-12 lg:w-16 h-8 text-center border rounded focus:ring-2 focus:ring-red-500 text-xs sm:text-sm"
                                disabled={!match.team1 || !match.team2 || (match.status !== 'in_progress' && !match.isEditing)}
                              />
                            </div>
                            {(match.isFreeThrowNeeded || (match.scores.team2.freeThrow && match.scores.team2.freeThrow > 0)) && (
                              <div className="flex-1 sm:flex-none">
                                <input
                                  type="number"
                                  min="0"
                                  value={match.scores.team2.freeThrow || 0}
                                  onChange={(e) => handleScoreChange(match.id, 'team2', 'freeThrow', e.target.value)}
                                  className="w-full sm:w-12 lg:w-16 h-8 text-center border rounded focus:ring-2 focus:ring-yellow-500 bg-yellow-50 text-xs sm:text-sm"
                                  disabled={!match.team1 || !match.team2 || (match.status !== 'in_progress' && !match.isEditing)}
                                />
                              </div>
                            )}
                            <div className="flex-1 sm:flex-none">
                              <div className="w-full sm:w-12 lg:w-16 h-8 flex items-center justify-center font-bold text-red-600 bg-red-50 rounded border text-xs sm:text-sm">
                                {calculateFinalScore(match.scores.team2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* 順位表 */}
        <BasketballRankings gender="men" />
      </div>
    </div>
  )
} 