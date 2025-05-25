'use client'

import { useState, useEffect } from 'react'
import { SoftballMatch, Tournament, SaveLog } from '@/app/types/softball'

interface Ranking {
  id: number
  className: string
  rank: number | null
  rankText: string | null
  eliminatedAt: string | null
}

export default function SoftballEdit() {
  const [tournament, setTournament] = useState<Tournament>({
    matches: []
  })
  const [error, setError] = useState<string | null>(null)
  const [saveLogs, setSaveLogs] = useState<SaveLog[]>([])
  const [showSaveMessage, setShowSaveMessage] = useState(false)
  const [showJankenModal, setShowJankenModal] = useState(false)
  const [currentJankenMatch, setCurrentJankenMatch] = useState<SoftballMatch | null>(null)
  const [rankings, setRankings] = useState<Ranking[]>([])
  const [showRankings, setShowRankings] = useState(false)

  useEffect(() => {
    loadTournament()
    loadRankings()
  }, [])

  const loadTournament = async () => {
    console.log('🔄 loadTournament開始')
    try {
      console.log('📡 API呼び出し: /api/softball/matches')
      const response = await fetch('/api/softball/matches')
      console.log('📨 レスポンスステータス:', response.status, response.ok)
      
      if (response.ok) {
        const matches = await response.json()
        console.log('✅ 取得した試合データ:', matches?.length, '件')
        console.log('📋 試合データ詳細:', matches)
        setTournament({ matches })
        console.log('✅ tournament stateを更新しました')
      } else {
        console.log('⚠️ APIレスポンスがエラー、初期化を実行します')
        await initializeTournament()
      }
    } catch (error) {
      console.error('❌ データ読み込みエラー:', error)
      await initializeTournament()
    }
  }

  const loadRankings = async () => {
    try {
      const response = await fetch('/api/softball/rankings')
      if (response.ok) {
        const rankingsData = await response.json()
        setRankings(rankingsData)
      }
    } catch (error) {
      console.error('順位データ読み込みエラー:', error)
    }
  }

  const initializeTournament = async () => {
    try {
      const response = await fetch('/api/softball/initialize', {
        method: 'POST'
      })
      
      if (response.ok) {
        await loadTournament()
        // 順位も初期化
        await initializeRankings()
      } else {
        setError('トーナメントの初期化に失敗しました')
      }
    } catch (error) {
      console.error('初期化エラー:', error)
      setError(`初期化エラー: ${error}`)
    }
  }

  const initializeRankings = async () => {
    try {
      const response = await fetch('/api/softball/rankings', {
        method: 'POST'
      })
      if (response.ok) {
        await loadRankings()
      }
    } catch (error) {
      console.error('順位初期化エラー:', error)
    }
  }

  const resetTournament = async () => {
    if (!confirm('本当にトーナメントをリセットしますか？全てのデータが削除されます。')) {
      return
    }
    await initializeTournament()
  }

  const calculateTotal = (scores: number[]): number => {
    return scores.reduce((sum, score) => sum + score, 0)
  }

  const determineWinner = (match: SoftballMatch): string | null => {
    if (match.jankenWinner) return match.jankenWinner
    
    const team1Total = calculateTotal(match.scores.team1.innings)
    const team2Total = calculateTotal(match.scores.team2.innings)
    
    if (team1Total > team2Total) return match.team1
    if (team2Total > team1Total) return match.team2
    
    return null
  }

  const needsJanken = (match: SoftballMatch): boolean => {
    const team1Total = calculateTotal(match.scores.team1.innings)
    const team2Total = calculateTotal(match.scores.team2.innings)
    
    // 同点の場合（0対0を含む）、じゃんけんが必要
    if (team1Total === team2Total) {
      // 何らかのスコアが入力されているか、または0対0でも試合終了しようとしている場合
      const hasAnyScoreInput = match.scores.team1.innings.some(score => score > 0) || 
                              match.scores.team2.innings.some(score => score > 0) ||
                              team1Total === 0 // 0対0でも許可
      return hasAnyScoreInput
    }
    
    return false
  }

  const isDraw = (match: SoftballMatch): boolean => {
    const team1Total = calculateTotal(match.scores.team1.innings)
    const team2Total = calculateTotal(match.scores.team2.innings)
    return team1Total === team2Total && !needsJanken(match)
  }

  // 順位更新
  const updateRanking = async (className: string, rank: number | null, rankText: string, eliminatedAt: string | null = null) => {
    try {
      const response = await fetch('/api/softball/rankings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          className,
          rank,
          rankText,
          eliminatedAt
        })
      })

      if (response.ok) {
        await loadRankings()
      }
    } catch (error) {
      console.error('順位更新エラー:', error)
    }
  }

  // 試合終了時の順位処理
  const processMatchRankings = async (match: SoftballMatch, winner: string) => {
    const loser = match.team1 === winner ? match.team2 : match.team1

    // 各試合の敗者順位処理
    switch (match.matchCode) {
      // 1回戦敗者はベスト19
      case 'A1':
      case 'B1':
      case 'B2':
        await updateRanking(loser, 19, 'ベスト19', match.matchCode)
        break
      
      // 2回戦敗者はベスト16  
      case 'A2':
      case 'A3':
      case 'A4':
      case 'A5':
      case 'B3':
      case 'B4':
      case 'B5':
      case 'B6':
        await updateRanking(loser, 16, 'ベスト16', match.matchCode)
        break
      
      // 3回戦敗者はベスト8
      case 'A6':
      case 'A7':
      case 'B7':
      case 'A8':
        await updateRanking(loser, 8, 'ベスト8', match.matchCode)
        break
      
      // 準決勝敗者は4位（3位決定戦進出）
      case 'A9':
      case 'B8':
        await updateRanking(loser, 4, '4位', match.matchCode)
        break
      
      // 3位決定戦
      case 'A10':
        await updateRanking(loser, 4, '4位', match.matchCode)
        await updateRanking(winner, 3, '3位', match.matchCode)
        break
      
      // 決勝戦
      case 'B9':
        await updateRanking(loser, 2, '2位', match.matchCode)
        await updateRanking(winner, 1, '1位', match.matchCode)
        break
    }
  }

  // 勝ち上がり元の試合が終了しているかチェック
  const isAdvancementSourceCompleted = (teamName: string): boolean => {
    if (!teamName.includes('勝者') && !teamName.includes('敗者')) return true
    
    let matchCode = ''
    if (teamName.includes('勝者')) {
      matchCode = teamName.replace('勝者', '')
    } else if (teamName.includes('敗者')) {
      matchCode = teamName.replace('敗者', '')
    }
    
    const sourceMatch = tournament.matches.find(m => m.matchCode === matchCode)
    
    return sourceMatch ? sourceMatch.status === 'finished' : false
  }

  // 試合開始可能かチェック
  const canStartMatch = (match: SoftballMatch): boolean => {
    if (!match.team1 || !match.team2) return false
    
    return isAdvancementSourceCompleted(match.team1) && 
           isAdvancementSourceCompleted(match.team2)
  }

  // 勝ち上がり先の試合が開始されているかチェック
  const canEditMatch = (match: SoftballMatch): boolean => {
    if (match.status !== 'finished') return false
    
    // この試合の勝者が進む次の試合を探す
    const getNextMatchInfo = (matchCode: string): {nextMatch: string, position: 'team1' | 'team2'} | null => {
      switch (matchCode) {
        case 'A1': return {nextMatch: 'A5', position: 'team2'}
        case 'B1': return {nextMatch: 'B5', position: 'team1'}
        case 'B2': return {nextMatch: 'B6', position: 'team1'}
        case 'A2': return {nextMatch: 'A6', position: 'team2'}
        case 'A3': return {nextMatch: 'A6', position: 'team1'}
        case 'A4': return {nextMatch: 'A7', position: 'team2'}
        case 'A5': return {nextMatch: 'A7', position: 'team1'}
        case 'B3': return {nextMatch: 'B7', position: 'team1'}
        case 'B4': return {nextMatch: 'A8', position: 'team1'}
        case 'B5': return {nextMatch: 'B7', position: 'team2'}
        case 'B6': return {nextMatch: 'A8', position: 'team2'}
        case 'A6': return {nextMatch: 'A9', position: 'team2'}
        case 'A7': return {nextMatch: 'A9', position: 'team1'}
        case 'B7': return {nextMatch: 'B8', position: 'team1'}
        case 'A8': return {nextMatch: 'B8', position: 'team2'}
        case 'A9': return {nextMatch: 'B9', position: 'team1'}
        case 'B8': return {nextMatch: 'B9', position: 'team2'}
        default: return null
      }
    }

    const nextMatchInfo = getNextMatchInfo(match.matchCode)
    if (!nextMatchInfo) return true // 決勝戦の場合は編集可能

    const nextMatch = tournament.matches.find(m => m.matchCode === nextMatchInfo.nextMatch)
    if (!nextMatch) return true

    // 次の試合が開始されていない場合は編集可能
    return nextMatch.status === 'waiting'
  }

  // 先行後攻の切り替え
  const toggleBattingOrder = async (matchCode: string) => {
    setTournament(prev => ({
      matches: prev.matches.map(m => {
        if (m.matchCode === matchCode) {
          return {
            ...m,
            isHomeFirst: !(m.isHomeFirst ?? false)
          }
        }
        return m
      })
    }))

    await saveMatch(matchCode)
  }

  // 再編集（試合終了状態をリセット）
  const resetMatchStatus = async (matchCode: string) => {
    if (!confirm('この試合を再編集可能にしますか？試合結果がリセットされ、勝ち上がり先からも削除されます。')) {
      return
    }

    setTournament(prev => ({
      matches: prev.matches.map(m => {
        if (m.matchCode === matchCode) {
          return {
            ...m,
            status: 'waiting' as const,
            winner: null,
            jankenWinner: null,
            endTime: '',
            scores: {
              team1: { innings: [0, 0, 0, 0, 0, 0, 0] },
              team2: { innings: [0, 0, 0, 0, 0, 0, 0] }
            }
          }
        }
        return m
      })
    }))

    await saveMatch(matchCode)
  }

  const updateNextRoundTeam = async (winnerTeam: string, currentMatchCode: string) => {
    console.log('🏆 勝ち上がり処理開始:', winnerTeam, 'from', currentMatchCode)
    
    const getNextMatchInfo = (matchCode: string): {nextMatch: string, position: 'team1' | 'team2', teamType: 'winner' | 'loser'} | null => {
      switch (matchCode) {
        case 'A1': return {nextMatch: 'A5', position: 'team2', teamType: 'winner'}
        case 'B1': return {nextMatch: 'B5', position: 'team1', teamType: 'winner'}
        case 'B2': return {nextMatch: 'B6', position: 'team1', teamType: 'winner'}
        case 'A2': return {nextMatch: 'A6', position: 'team2', teamType: 'winner'}
        case 'A3': return {nextMatch: 'A6', position: 'team1', teamType: 'winner'}
        case 'A4': return {nextMatch: 'A7', position: 'team2', teamType: 'winner'}
        case 'A5': return {nextMatch: 'A7', position: 'team1', teamType: 'winner'}
        case 'B3': return {nextMatch: 'B7', position: 'team1', teamType: 'winner'}
        case 'B4': return {nextMatch: 'A8', position: 'team1', teamType: 'winner'}
        case 'B5': return {nextMatch: 'B7', position: 'team2', teamType: 'winner'}
        case 'B6': return {nextMatch: 'A8', position: 'team2', teamType: 'winner'}
        case 'A6': return {nextMatch: 'A9', position: 'team2', teamType: 'winner'}
        case 'A7': return {nextMatch: 'A9', position: 'team1', teamType: 'winner'}
        case 'B7': return {nextMatch: 'B8', position: 'team1', teamType: 'winner'}
        case 'A8': return {nextMatch: 'B8', position: 'team2', teamType: 'winner'}
        case 'A9': return {nextMatch: 'B9', position: 'team1', teamType: 'winner'}
        case 'B8': return {nextMatch: 'B9', position: 'team2', teamType: 'winner'}
        default: return null
      }
    }

    // 3位決定戦への敗者進出処理
    const getThirdPlaceMatchInfo = (matchCode: string): {nextMatch: string, position: 'team1' | 'team2'} | null => {
      switch (matchCode) {
        case 'A9': return {nextMatch: 'A10', position: 'team1'} // A9敗者 → A10 team1
        case 'B8': return {nextMatch: 'A10', position: 'team2'} // B8敗者 → A10 team2
        default: return null
      }
    }

    const nextMatchInfo = getNextMatchInfo(currentMatchCode)
    const thirdPlaceInfo = getThirdPlaceMatchInfo(currentMatchCode)

    // 勝者の進出処理
    if (nextMatchInfo) {
      console.log('➡️ 次の試合:', nextMatchInfo.nextMatch, 'position:', nextMatchInfo.position)
      console.log('🔄 勝者設定:', winnerTeam, '→', `${nextMatchInfo.nextMatch}.${nextMatchInfo.position}`)

      setTournament(prev => {
        const updatedMatches = prev.matches.map(m => {
          if (m.matchCode === nextMatchInfo.nextMatch) {
            const updatedMatch = {
              ...m,
              [nextMatchInfo.position]: winnerTeam
            }
            
            setTimeout(() => {
              saveMatchData(updatedMatch).catch(error => {
                console.error('❌ 勝ち上がり保存エラー:', error)
              })
            }, 200)
            
            return updatedMatch
          }
          return m
        })
        
        return { matches: updatedMatches }
      })
    }

    // 3位決定戦への敗者進出処理
    if (thirdPlaceInfo) {
      const loser = tournament.matches.find(m => m.matchCode === currentMatchCode)?.team1 === winnerTeam 
        ? tournament.matches.find(m => m.matchCode === currentMatchCode)?.team2
        : tournament.matches.find(m => m.matchCode === currentMatchCode)?.team1

      if (loser) {
        console.log('🥉 3位決定戦敗者進出:', loser, '→', `${thirdPlaceInfo.nextMatch}.${thirdPlaceInfo.position}`)
        
        setTournament(prev => {
          const updatedMatches = prev.matches.map(m => {
            if (m.matchCode === thirdPlaceInfo.nextMatch) {
              const updatedMatch = {
                ...m,
                [thirdPlaceInfo.position]: loser
              }
              
              setTimeout(() => {
                saveMatchData(updatedMatch).catch(error => {
                  console.error('❌ 3位決定戦進出保存エラー:', error)
                })
              }, 300)
              
              return updatedMatch
            }
            return m
          })
          
          return { matches: updatedMatches }
        })
      }
    }
  }

  const handleScoreChange = async (matchCode: string, team: 'team1' | 'team2', inning: number, value: string) => {
    const score = parseInt(value) || 0
    
    setTournament(prev => ({
      matches: prev.matches.map(m => {
        if (m.matchCode === matchCode) {
          const newInnings = [...m.scores[team].innings]
          newInnings[inning] = score
          
          return {
            ...m,
            scores: {
              ...m.scores,
              [team]: {
                innings: newInnings
              }
            }
          }
        }
        return m
      })
    }))

    await saveMatch(matchCode)
  }

  const handleScheduledTimeChange = async (matchCode: string, scheduledTime: string) => {
    setTournament(prev => ({
      matches: prev.matches.map(m => {
        if (m.matchCode === matchCode) {
          return {
            ...m,
            scheduledTime
          }
        }
        return m
      })
    }))

    await saveMatch(matchCode)
  }

  // 日時を読みやすい形式に変換
  const formatScheduledTime = (scheduledTime: string) => {
    if (!scheduledTime) return '未設定'
    
    try {
      const date = new Date(scheduledTime)
      return date.toLocaleDateString('ja-JP', {
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return scheduledTime
    }
  }

  // datetime-local形式に変換
  const formatDateTimeLocal = (scheduledTime: string) => {
    if (!scheduledTime) return ''
    
    try {
      const date = new Date(scheduledTime)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      
      return `${year}-${month}-${day}T${hours}:${minutes}`
    } catch {
      return ''
    }
  }

  const saveMatchData = async (matchToSave: SoftballMatch) => {
    try {
      console.log('💾 API保存開始:', matchToSave.matchCode)

      const winner = determineWinner(matchToSave)

      const response = await fetch(`/api/softball/matches/${matchToSave.matchCode}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          team1Innings: matchToSave.scores.team1.innings,
          team2Innings: matchToSave.scores.team2.innings,
          status: matchToSave.status,
          winner: matchToSave.status === 'finished' ? winner : null,
          isJankenNeeded: needsJanken(matchToSave),
          jankenWinner: matchToSave.jankenWinner,
          startTime: matchToSave.startTime,
          endTime: matchToSave.endTime,
          scheduledTime: matchToSave.scheduledTime,
          team1: matchToSave.team1,
          team2: matchToSave.team2,
          isHomeFirst: matchToSave.isHomeFirst ?? false
        })
      })

      if (response.ok) {
        console.log('✅ API保存成功')
        const newLog: SaveLog = {
          timestamp: new Date().toLocaleString('ja-JP'),
          matchCode: matchToSave.matchCode,
          action: '試合データ保存',
          details: `${matchToSave.team1} vs ${matchToSave.team2}`
        }
        setSaveLogs(prev => [newLog, ...prev])
        setShowSaveMessage(true)
        setTimeout(() => setShowSaveMessage(false), 3000)
      } else {
        console.error('❌ API保存失敗:', await response.text())
      }
    } catch (error) {
      console.error('❌ API保存エラー:', error)
    }
  }

  const saveMatch = async (matchCode: string) => {
    const match = tournament.matches.find(m => m.matchCode === matchCode)
    if (match) {
      await saveMatchData(match)
    }
  }

  const handleMatchStatus = async (matchCode: string, newStatus: 'waiting' | 'in_progress' | 'finished') => {
    console.log('🔄 試合状態更新:', matchCode, newStatus)
    const currentTime = new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    
    let updatedMatch: SoftballMatch | null = null
    
    setTournament(prev => ({
      matches: prev.matches.map(m => {
        if (m.matchCode === matchCode) {
          const startTime = newStatus === 'in_progress' ? currentTime : m.startTime
          const endTime = newStatus === 'finished' ? currentTime : m.endTime
          
          updatedMatch = {
            ...m,
            status: newStatus,
            startTime,
            endTime: newStatus === 'finished' ? currentTime : endTime
          } as SoftballMatch
          
          return updatedMatch
        }
        return m
      })
    }))

    if (updatedMatch) {
      try {
        if (newStatus === 'in_progress') {
          console.log('🏁 試合開始 - 保存実行')
          await saveMatchData(updatedMatch)
        }

        if (newStatus === 'finished') {
          console.log('🏁 試合終了処理開始:', matchCode)
          
          const winner = determineWinner(updatedMatch)
          console.log('🏆 勝者判定結果:', winner)
          
          const requiresJanken = needsJanken(updatedMatch) && !('jankenWinner' in updatedMatch)
          
          if (requiresJanken) {
            console.log('🎲 じゃんけんが必要です')
            setCurrentJankenMatch(updatedMatch)
            setShowJankenModal(true)
            await saveMatchData(updatedMatch)
          } else {
            console.log('✅ 勝者確定:', winner)
            
            await saveMatchData(updatedMatch)
            
            if (winner) {
              console.log('🚀 勝ち上がり処理実行:', winner, 'from', matchCode)
              await updateNextRoundTeam(winner, matchCode)
              await processMatchRankings(updatedMatch, winner)
            }
          }
        }
        
        setTimeout(() => {
          loadTournament()
        }, 2000)
        
      } catch (error) {
        console.error('❌ 試合状態更新エラー:', error)
      }
    }
  }

  // 強制試合終了処理（リロードなしの再試行）
  const forceFinishMatch = async (matchCode: string) => {
    console.log('🔧 強制試合終了処理:', matchCode)
    
    const match = tournament.matches.find(m => m.matchCode === matchCode)
    if (!match) return

    // すでに終了している場合のメッセージ
    if (match.status === 'finished') {
      alert('試合は正常に終了されました。')
      return
    }

    const winner = determineWinner(match)
    if (!winner && !needsJanken(match)) {
      alert('勝敗が決まっていません')
      return
    }

    const updatedMatch = {
      ...match,
      status: 'finished' as const,
      endTime: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
      winner
    }

    try {
      await saveMatchData(updatedMatch)
      
      if (needsJanken(updatedMatch) && !updatedMatch.jankenWinner) {
        setCurrentJankenMatch(updatedMatch)
        setShowJankenModal(true)
      } else if (winner) {
        await updateNextRoundTeam(winner, matchCode)
        await processMatchRankings(updatedMatch, winner)
      }
      
      setTournament(prev => ({
        matches: prev.matches.map(m => 
          m.matchCode === matchCode ? updatedMatch : m
        )
      }))
      
      setTimeout(() => {
        loadTournament()
      }, 1000)
      
    } catch (error) {
      console.error('❌ 強制試合終了エラー:', error)
    }
  }

  const handleJankenResult = async (winner: string) => {
    if (!currentJankenMatch) return

    const updatedMatch = {
      ...currentJankenMatch,
      jankenWinner: winner,
      winner: winner,
      status: 'finished' as const,
      endTime: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    }

    setTournament(prev => ({
      matches: prev.matches.map(m => {
        if (m.matchCode === currentJankenMatch.matchCode) {
          return updatedMatch
        }
        return m
      })
    }))

    try {
      await saveMatchData(updatedMatch)
      await updateNextRoundTeam(winner, currentJankenMatch.matchCode)
      await processMatchRankings(updatedMatch, winner)
      
      setShowJankenModal(false)
      setCurrentJankenMatch(null)
      
      setTimeout(() => {
        loadTournament()
      }, 2000)
      
    } catch (error) {
      console.error('❌ じゃんけん結果処理エラー:', error)
    }
  }

  const getRoundName = (round: number): string => {
    switch (round) {
      case 1: return '1回戦'
      case 2: return '2回戦'
      case 3: return '3回戦'
      case 4: return '準決勝'
      case 5: return '決勝・3位決定戦'
      default: return `第${round}回戦`
    }
  }

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'waiting': return '待機中'
      case 'in_progress': return '進行中'
      case 'finished': return '終了'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-gray-100 text-gray-700'
      case 'in_progress': return 'bg-blue-100 text-blue-700'
      case 'finished': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const canFinishMatch = (match: SoftballMatch): boolean => {
    const team1Total = calculateTotal(match.scores.team1.innings)
    const team2Total = calculateTotal(match.scores.team2.innings)
    
    // 0対0でも同点でじゃんけんができるため、終了可能
    if (team1Total === team2Total) {
      return true // 同点（0対0含む）の場合はじゃんけんで決着
    }
    
    return true
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ソフトボール大会管理システム</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowRankings(!showRankings)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              {showRankings ? '順位表を非表示' : '順位表を表示'}
            </button>
            <button
              onClick={resetTournament}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              トーナメントリセット
            </button>
          </div>
        </div>
        
        {showSaveMessage && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md z-50">
            <p className="font-medium">保存しました</p>
          </div>
        )}

        {/* 順位表 */}
        {showRankings && (
          <div className="mb-8 bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">現在の順位</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 8, 16, 19].map(rank => (
                <div key={rank} className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-bold text-lg mb-2">
                    {rank <= 4 ? `${rank}位` : `ベスト${rank}`}
                  </h3>
                  <div className="space-y-1">
                    {rankings
                      .filter(r => r.rank === rank)
                      .map(ranking => (
                        <div key={ranking.className} className="text-sm">
                          {ranking.className}
                        </div>
                      ))}
                    {rankings.filter(r => r.rank === rank).length === 0 && (
                      <div className="text-sm text-gray-500">-</div>
                    )}
                  </div>
                </div>
              ))}
              
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-bold text-lg mb-2 text-green-700">参加中</h3>
                <div className="space-y-1">
                  {rankings
                    .filter(r => r.rankText === '参加中')
                    .map(ranking => (
                      <div key={ranking.className} className="text-sm text-green-600">
                        {ranking.className}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 p-4 bg-white border border-gray-200 rounded-md">
          <p className="text-sm text-gray-600">
            試合数: {tournament.matches.length}件 | 
            ステータス: {tournament.matches.length === 0 ? '未読み込み' : '読み込み済み'}
          </p>
          <button
            onClick={loadTournament}
            className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
          >
            手動再読み込み
          </button>
        </div>

        {tournament.matches.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">システムを準備中です...</h2>
            <p className="text-gray-600 mb-4">トーナメントデータを読み込んでいます</p>
            <button
              onClick={loadTournament}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              再読み込み
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {[1, 2, 3, 4, 5].map(round => (
              <div key={round}>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                  {getRoundName(round)}
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {tournament.matches
                    .filter(match => match.round === round)
                    .map(match => {
                      // 先行後攻の表示順序を決定（デフォルトでは先行がteam1）
                      const isHomeFirst = match.isHomeFirst ?? false
                      const displayFirst = isHomeFirst ? 'team2' : 'team1'
                      const displaySecond = isHomeFirst ? 'team1' : 'team2'
                      const firstTeam = match[displayFirst]
                      const secondTeam = match[displaySecond]
                      const firstScores = match.scores[displayFirst]
                      const secondScores = match.scores[displaySecond]

                      return (
                        <div key={match.matchCode} className="bg-white rounded-lg border border-gray-200 p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <span className="font-mono text-blue-600 font-bold text-lg">{match.matchCode}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-500">
                                  {match.startTime || '未開始'}
                                </span>
                                {match.endTime && match.status === 'finished' && (
                                  <>
                                    <span className="text-sm text-gray-400">→</span>
                                    <span className="text-sm font-medium text-gray-500">
                                      {match.endTime}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(match.status)}`}>
                                {getStatusDisplay(match.status)}
                              </span>
                            </div>
                          </div>

                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              予定日時
                            </label>
                            <div className="flex flex-col gap-2">
                              <input
                                type="datetime-local"
                                value={formatDateTimeLocal(match.scheduledTime || '')}
                                onChange={(e) => {
                                  const dateTime = e.target.value ? new Date(e.target.value).toISOString() : ''
                                  handleScheduledTimeChange(match.matchCode, dateTime)
                                }}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                disabled={match.status === 'finished'}
                              />
                              {match.scheduledTime && (
                                <div className="text-xs text-gray-500">
                                  設定済み: {formatScheduledTime(match.scheduledTime)}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* 先行後攻切り替えボタン */}
                          {(match.team1 && match.team2) && (
                            <div className="mb-4 flex justify-between items-center">
                              <span className="text-sm text-gray-600">
                                先攻: {firstTeam} | 後攻: {secondTeam}
                              </span>
                              <button
                                onClick={() => toggleBattingOrder(match.matchCode)}
                                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors"
                                disabled={match.status === 'finished'}
                              >
                                先行後攻入替
                              </button>
                            </div>
                          )}

                          <div className="flex justify-between items-center mb-6">
                            <div className="flex-1 text-center">
                              <span className={`text-xl font-bold ${
                                match.winner === firstTeam || match.jankenWinner === firstTeam ? 'text-blue-600' : ''
                              }`}>
                                {firstTeam || '未定'}
                                {(match.winner === firstTeam || match.jankenWinner === firstTeam) && ' (勝者)'}
                              </span>
                              <div className="text-xs text-gray-500">先攻</div>
                              <div className="text-2xl font-bold text-blue-600 mt-1">
                                {calculateTotal(firstScores.innings)}
                              </div>
                            </div>
                            <div className="px-4">
                              <span className="text-xl font-bold text-gray-400">VS</span>
                            </div>
                            <div className="flex-1 text-center">
                              <span className={`text-xl font-bold ${
                                match.winner === secondTeam || match.jankenWinner === secondTeam ? 'text-blue-600' : ''
                              }`}>
                                {secondTeam || '未定'}
                                {(match.winner === secondTeam || match.jankenWinner === secondTeam) && ' (勝者)'}
                              </span>
                              <div className="text-xs text-gray-500">後攻</div>
                              <div className="text-2xl font-bold text-red-600 mt-1">
                                {calculateTotal(secondScores.innings)}
                              </div>
                            </div>
                          </div>

                          {/* 勝ち上がり待ちのメッセージ */}
                          {!canStartMatch(match) && (
                            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                              <p className="text-sm text-yellow-800 font-medium">
                                勝ち上がりのチームが決まるまでお待ちください
                              </p>
                            </div>
                          )}

                          {(match.team1 && match.team2) && (
                            <div className="mb-6">
                              <div className="grid grid-cols-8 gap-1 text-center text-sm mb-2">
                                <div className="font-medium">チーム</div>
                                {[0, 1, 2, 3, 4, 5, 6].map(inning => (
                                  <div key={inning} className="font-medium">
                                    {inning <= 3 ? `${inning + 1}回` : `延${inning - 3}`}
                                  </div>
                                ))}
                              </div>
                              
                              <div className="grid grid-cols-8 gap-1 mb-2">
                                <div className="text-sm font-medium truncate py-2">
                                  {firstTeam}
                                </div>
                                {[0, 1, 2, 3, 4, 5, 6].map(inning => (
                                  <div key={inning}>
                                    <input
                                      type="number"
                                      min="0"
                                      value={firstScores.innings[inning] || 0}
                                      onChange={(e) => handleScoreChange(match.matchCode, displayFirst, inning, e.target.value)}
                                      className={`w-full text-center border rounded py-1 ${
                                        inning <= 3 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'
                                      }`}
                                      disabled={
                                        !match.team1 || !match.team2 || 
                                        match.status === 'waiting' ||
                                        match.status === 'finished'
                                      }
                                    />
                                  </div>
                                ))}
                              </div>

                              <div className="grid grid-cols-8 gap-1">
                                <div className="text-sm font-medium truncate py-2">
                                  {secondTeam}
                                </div>
                                {[0, 1, 2, 3, 4, 5, 6].map(inning => (
                                  <div key={inning}>
                                    <input
                                      type="number"
                                      min="0"
                                      value={secondScores.innings[inning] || 0}
                                      onChange={(e) => handleScoreChange(match.matchCode, displaySecond, inning, e.target.value)}
                                      className={`w-full text-center border rounded py-1 ${
                                        inning <= 3 ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'
                                      }`}
                                      disabled={
                                        !match.team1 || !match.team2 || 
                                        match.status === 'waiting' ||
                                        match.status === 'finished'
                                      }
                                    />
                                  </div>
                                ))}
                              </div>

                              {needsJanken(match) && !match.jankenWinner && (
                                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                  <p className="text-sm text-yellow-800 font-medium">
                                    {calculateTotal(match.scores.team1.innings) === 0 && calculateTotal(match.scores.team2.innings) === 0 
                                      ? '0対0の同点です。じゃんけんで決着をつけてください。'
                                      : '延長戦でも同点です。じゃんけんで決着をつけてください。'
                                    }
                                  </p>
                                </div>
                              )}

                              {match.jankenWinner && (
                                <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-md">
                                  <p className="text-sm text-purple-800 font-medium">
                                    じゃんけん勝者: {match.jankenWinner}
                                  </p>
                                </div>
                              )}

                              {isDraw(match) && (
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                  <p className="text-sm text-red-800 font-medium">
                                    同点です。延長戦でスコアを入力するか、じゃんけんで決着をつけてください。
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex justify-between items-center">
                            <div className="flex gap-2">
                              {match.status === 'waiting' && (
                                <button
                                  onClick={() => handleMatchStatus(match.matchCode, 'in_progress')}
                                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-300"
                                  disabled={!canStartMatch(match)}
                                  title={!canStartMatch(match) ? "勝ち上がりチームが決まっていません" : ""}
                                >
                                  開始
                                </button>
                              )}
                              {match.status === 'in_progress' && (
                                <>
                                  <button
                                    onClick={() => handleMatchStatus(match.matchCode, 'finished')}
                                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                                  >
                                    終了
                                  </button>
                                  <button
                                    onClick={() => saveMatch(match.matchCode)}
                                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                                  >
                                    保存
                                  </button>
                                </>
                              )}
                              {match.status === 'finished' && canEditMatch(match) && (
                                <button
                                  onClick={() => resetMatchStatus(match.matchCode)}
                                  className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
                                >
                                  再編集
                                </button>
                              )}
                              
                              {/* 強制終了ボタン - 進行中と終了後の両方で表示 */}
                              {(match.status === 'in_progress' || match.status === 'finished') && (
                                <button
                                  onClick={() => forceFinishMatch(match.matchCode)}
                                  className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
                                  title={match.status === 'finished' ? "試合終了状況を確認" : "試合終了に失敗した場合の強制終了"}
                                >
                                  強制終了
                                </button>
                              )}
                            </div>

                            {needsJanken(match) && !match.jankenWinner && match.status === 'in_progress' && (
                              <button
                                onClick={() => {
                                  setCurrentJankenMatch(match)
                                  setShowJankenModal(true)
                                }}
                                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                              >
                                じゃんけん
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            ))}
          </div>
        )}

        {saveLogs.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">保存ログ</h3>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {saveLogs.map((log, index) => (
                  <div key={index} className="text-sm border-b pb-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{log.matchCode}</span>
                      <span className="text-gray-500">{log.timestamp}</span>
                    </div>
                    <div className="text-gray-600">{log.details}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {showJankenModal && currentJankenMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-center mb-6">
              じゃんけん勝負
            </h3>
            
            <div className="text-center mb-6">
              <p className="text-lg font-medium">
                {currentJankenMatch.team1} vs {currentJankenMatch.team2}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {calculateTotal(currentJankenMatch.scores.team1.innings) === 0 && calculateTotal(currentJankenMatch.scores.team2.innings) === 0 
                  ? '0対0の同点のため、じゃんけんで決着をつけます'
                  : '延長戦でも同点のため、じゃんけんで決着をつけます'
                }
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleJankenResult(currentJankenMatch.team1)}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {currentJankenMatch.team1} の勝利
              </button>
              <button
                onClick={() => handleJankenResult(currentJankenMatch.team2)}
                className="w-full px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                {currentJankenMatch.team2} の勝利
              </button>
            </div>

            <div className="mt-4">
              <button
                onClick={() => {
                  setShowJankenModal(false)
                  setCurrentJankenMatch(null)
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}