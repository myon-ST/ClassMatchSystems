'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface SaveLog {
  timestamp: string
  matchCode: string
  action: string
  details: string
}

interface EditHistory {
  timestamp: string
  type: 'score_change' | 'status_change' | 'time_change' | 'save'
  description: string
}

interface Match {
  id: string
  round: number
  matchNumber: number
  team1: string
  team2: string
  scores: {
    team1: number[]
    team2: number[]
  }
  winner: string | null
  startTime: string
  endTime: string
  status: 'waiting' | 'in_progress' | 'finished'
  matchCode: string
  isEditing: boolean
  editHistory: EditHistory[]
}

interface Tournament {
  matches: Match[]
}

export default function SoftballEdit() {
  const router = useRouter()
  const [tournament, setTournament] = useState<Tournament>({
    matches: []
  })
  const [saveLogs, setSaveLogs] = useState<SaveLog[]>([])
  const [showSaveMessage, setShowSaveMessage] = useState(false)
  const [showTieWarning, setShowTieWarning] = useState<string | null>(null)

  // 初期トーナメントデータの生成
  useEffect(() => {
    // 1回戦の試合を生成（8試合）
    const firstRoundMatches: Match[] = [
      { id: '1-1', round: 1, matchNumber: 1, team1: '1-1', team2: '1-2', scores: { team1: [0,0,0,0], team2: [0,0,0,0] }, winner: null, startTime: '', endTime: '', status: 'waiting', matchCode: 'SF101', isEditing: false, editHistory: [] },
      { id: '1-2', round: 1, matchNumber: 2, team1: '1-3', team2: '1-4', scores: { team1: [0,0,0,0], team2: [0,0,0,0] }, winner: null, startTime: '', endTime: '', status: 'waiting', matchCode: 'SF102', isEditing: false, editHistory: [] },
      { id: '1-3', round: 1, matchNumber: 3, team1: '1-5', team2: '1-6', scores: { team1: [0,0,0,0], team2: [0,0,0,0] }, winner: null, startTime: '', endTime: '', status: 'waiting', matchCode: 'SF103', isEditing: false, editHistory: [] },
      { id: '1-4', round: 1, matchNumber: 4, team1: '2-1', team2: '2-2', scores: { team1: [0,0,0,0], team2: [0,0,0,0] }, winner: null, startTime: '', endTime: '', status: 'waiting', matchCode: 'SF104', isEditing: false, editHistory: [] },
      { id: '1-5', round: 1, matchNumber: 5, team1: '2-3', team2: '2-4', scores: { team1: [0,0,0,0], team2: [0,0,0,0] }, winner: null, startTime: '', endTime: '', status: 'waiting', matchCode: 'SF105', isEditing: false, editHistory: [] },
      { id: '1-6', round: 1, matchNumber: 6, team1: '2-5', team2: '2-6', scores: { team1: [0,0,0,0], team2: [0,0,0,0] }, winner: null, startTime: '', endTime: '', status: 'waiting', matchCode: 'SF106', isEditing: false, editHistory: [] },
      { id: '1-7', round: 1, matchNumber: 7, team1: '3-1', team2: '3-2', scores: { team1: [0,0,0,0], team2: [0,0,0,0] }, winner: null, startTime: '', endTime: '', status: 'waiting', matchCode: 'SF107', isEditing: false, editHistory: [] },
      { id: '1-8', round: 1, matchNumber: 8, team1: '3-3', team2: '3-4', scores: { team1: [0,0,0,0], team2: [0,0,0,0] }, winner: null, startTime: '', endTime: '', status: 'waiting', matchCode: 'SF108', isEditing: false, editHistory: [] },
    ]

    // 2回戦の試合を生成（4試合）
    const secondRoundMatches: Match[] = Array(4).fill(null).map((_, i) => ({
      id: `2-${i+1}`,
      round: 2,
      matchNumber: i+1,
      team1: '',
      team2: '',
      scores: { team1: [0,0,0,0], team2: [0,0,0,0] },
      winner: null,
      startTime: '',
      endTime: '',
      status: 'waiting',
      matchCode: `SF2${(i+1).toString().padStart(2, '0')}`,
      isEditing: false,
      editHistory: []
    }))

    // 準決勝の試合を生成（2試合）
    const semifinalMatches: Match[] = Array(2).fill(null).map((_, i) => ({
      id: `3-${i+1}`,
      round: 3,
      matchNumber: i+1,
      team1: '',
      team2: '',
      scores: { team1: [0,0,0,0], team2: [0,0,0,0] },
      winner: null,
      startTime: '',
      endTime: '',
      status: 'waiting',
      matchCode: `SF3${(i+1).toString().padStart(2, '0')}`,
      isEditing: false,
      editHistory: []
    }))

    // 決勝戦を生成
    const finalMatch: Match = {
      id: '4-1',
      round: 4,
      matchNumber: 1,
      team1: '',
      team2: '',
      scores: { team1: [0,0,0,0], team2: [0,0,0,0] },
      winner: null,
      startTime: '',
      endTime: '',
      status: 'waiting',
      matchCode: 'SF401',
      isEditing: false,
      editHistory: []
    }

    setTournament({
      matches: [...firstRoundMatches, ...secondRoundMatches, ...semifinalMatches, finalMatch]
    })
  }, [])

  // 編集モードの切り替え
  const toggleEditMode = (matchId: string) => {
    setTournament(prev => ({
      matches: prev.matches.map(match => {
        if (match.id === matchId) {
          const newHistory: EditHistory = {
            timestamp: new Date().toLocaleString('ja-JP'),
            type: 'status_change',
            description: match.isEditing ? '編集モード終了' : '編集モード開始'
          }
          return {
            ...match,
            isEditing: !match.isEditing,
            editHistory: [...(match.editHistory || []), newHistory]
          }
        }
        return match
      })
    }))
  }

  // スコアの更新処理を修正
  const handleScoreChange = (matchId: string, team: 'team1' | 'team2', inning: number, value: string) => {
    const score = parseInt(value) || 0
    setTournament(prev => {
      const updatedMatches = prev.matches.map(match => {
        if (match.id === matchId) {
          const updatedScores = {
            ...match.scores,
            [team]: match.scores[team].map((s, i) => i === inning ? score : s)
          }
          
          // 編集履歴を追加
          const newHistory: EditHistory = {
            timestamp: new Date().toLocaleString('ja-JP'),
            type: 'score_change',
            description: `${team === 'team1' ? match.team1 : match.team2}の${inning + 1}回の得点を${score}に変更`
          }

          return {
            ...match,
            scores: updatedScores,
            editHistory: [...(match.editHistory || []), newHistory]
          }
        }
        return match
      })

      return {
        ...prev,
        matches: updatedMatches
      }
    })
  }

  // 試合状態の更新を修正
  const handleMatchStatus = (matchId: string, newStatus: 'waiting' | 'in_progress' | 'finished') => {
    const match = tournament.matches.find(m => m.id === matchId)
    if (!match) return

    // 試合終了時に同点チェックと勝者決定
    if (newStatus === 'finished') {
      const team1Total = calculateTotalScore(match.scores.team1)
      const team2Total = calculateTotalScore(match.scores.team2)
      
      if (team1Total === team2Total) {
        setShowTieWarning(matchId)
        setTimeout(() => setShowTieWarning(null), 3000)
        return
      }

      // 勝者を決定
      const winner = team1Total > team2Total ? match.team1 : match.team2

      // 次の試合に勝者を進出させる
      const nextRound = match.round + 1
      const nextMatchNumber = Math.ceil(match.matchNumber / 2)
      const nextMatch = tournament.matches.find(m => 
        m.round === nextRound && m.matchNumber === nextMatchNumber
      )
      
      if (nextMatch) {
        const isFirstTeam = match.matchNumber % 2 === 1
        setTournament(prev => ({
          matches: prev.matches.map(m => {
            if (m.id === nextMatch.id) {
              return {
                ...m,
                team1: isFirstTeam ? winner : m.team1,
                team2: isFirstTeam ? m.team2 : winner
              }
            }
            return m
          })
        }))
      }
    }

    const currentTime = new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })

    setTournament(prev => ({
      matches: prev.matches.map(match => {
        if (match.id === matchId) {
          const startTime = newStatus === 'in_progress'
            ? currentTime
            : match.startTime

          const endTime = newStatus === 'finished' 
            ? currentTime
            : match.endTime || ''

          const team1Total = calculateTotalScore(match.scores.team1)
          const team2Total = calculateTotalScore(match.scores.team2)
          const winner = newStatus === 'finished' 
            ? (team1Total > team2Total ? match.team1 : match.team2)
            : null

          const newHistory: EditHistory = {
            timestamp: new Date().toLocaleString('ja-JP'),
            type: 'status_change',
            description: newStatus === 'finished' 
              ? `試合終了 (${endTime}) - 勝者: ${winner}`
              : newStatus === 'in_progress'
              ? `試合開始 (${startTime})`
              : '試合状態変更'
          }

          return {
            ...match,
            status: newStatus,
            startTime,
            endTime,
            winner,
            editHistory: [...(match.editHistory || []), newHistory]
          }
        }
        return match
      })
    }))
  }

  // 予定時刻の更新
  const handleStartTimeChange = (matchId: string, value: string) => {
    setTournament(prev => ({
      matches: prev.matches.map(match => {
        if (match.id === matchId) {
          const newHistory: EditHistory = {
            timestamp: new Date().toLocaleString('ja-JP'),
            type: 'time_change',
            description: match.status === 'waiting'
              ? `予定時刻を${value}に変更`
              : `開始時刻を${value}に変更`
          }
          return {
            ...match,
            startTime: value,
            editHistory: [...(match.editHistory || []), newHistory]
          }
        }
        return match
      })
    }))
  }

  // スコアの合計を計算する関数
  const calculateTotalScore = (scores: number[]): number => {
    return scores.reduce((a, b) => a + b, 0)
  }

  // 同点かどうかをチェックする関数
  const isTieGame = (match: Match): boolean => {
    const team1Total = calculateTotalScore(match.scores.team1)
    const team2Total = calculateTotalScore(match.scores.team2)
    return team1Total === team2Total
  }

  // 試合データの保存処理
  const handleSave = (matchId: string) => {
    const match = tournament.matches.find(m => m.id === matchId)
    if (!match) return

    // 保存ログの作成
    const newLog: SaveLog = {
      timestamp: new Date().toLocaleString('ja-JP'),
      matchCode: match.matchCode,
      action: '試合データ保存',
      details: `${match.team1} vs ${match.team2} - スコア: ${match.scores.team1.reduce((a,b) => a+b, 0)}-${match.scores.team2.reduce((a,b) => a+b, 0)}`
    }

    // 編集履歴に保存記録を追加
    const newHistory: EditHistory = {
      timestamp: new Date().toLocaleString('ja-JP'),
      type: 'save',
      description: '試合データを保存しました'
    }

    // トーナメントデータの更新
    setTournament(prev => ({
      matches: prev.matches.map(m => 
        m.id === matchId 
          ? { ...m, editHistory: [...m.editHistory, newHistory] }
          : m
      )
    }))

    // 保存ログの更新
    setSaveLogs(prev => [newLog, ...prev])

    // 保存メッセージの表示
    setShowSaveMessage(true)
    setTimeout(() => setShowSaveMessage(false), 3000)
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-primary mb-8">ソフトボール トーナメント</h1>
        
        {/* 保存成功メッセージ */}
        {showSaveMessage && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <p className="font-medium">保存しました</p>
          </div>
        )}

        {/* 同点警告メッセージ */}
        {showTieWarning && (
          <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-medium">同点のため試合を終了できません</p>
          </div>
        )}

        {/* トーナメント表示 */}
        <div className="space-y-8">
          {[1, 2, 3, 4].map(round => (
            <div key={round}>
              <h2 className="text-2xl font-semibold text-primary mb-4 border-b pb-2">
                {round === 1 ? '1回戦' : 
                 round === 2 ? '2回戦' : 
                 round === 3 ? '準決勝' : '決勝'}
              </h2>
              <div className="space-y-4">
                {tournament.matches
                  .filter(match => match.round === round)
                  .map(match => (
                    <div key={match.id} className="bg-white rounded-lg shadow-md p-6">
                      {/* 試合情報ヘッダー */}
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-500">試合コード:</span>
                            <span className="font-mono font-bold text-primary">{match.matchCode}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-500">
                              {match.status === 'waiting' ? '予定:' : '開始:'}
                            </span>
                            <input
                              type="time"
                              value={match.startTime}
                              onChange={(e) => handleStartTimeChange(match.id, e.target.value)}
                              className="border rounded px-2 py-1 text-sm"
                              disabled={!match.isEditing && match.status === 'finished'}
                            />
                          </div>
                          {match.status === 'finished' && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-500">終了:</span>
                              <span className="text-sm font-medium">{match.endTime}</span>
                            </div>
                          )}
                          {match.status === 'finished' && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-500">試合時間:</span>
                              <span className="text-sm">
                                {match.startTime && match.endTime && calculateMatchDuration(match.startTime, match.endTime)}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {match.status === 'waiting' && (
                            <button
                              onClick={() => handleMatchStatus(match.id, 'in_progress')}
                              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                              disabled={!match.team1 || !match.team2}
                            >
                              試合開始
                            </button>
                          )}
                          {match.status === 'in_progress' && (
                            <>
                              <button
                                onClick={() => handleMatchStatus(match.id, 'finished')}
                                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                disabled={isTieGame(match)}
                                title={isTieGame(match) ? "同点の場合は試合を終了できません" : ""}
                              >
                                試合終了
                              </button>
                              {isTieGame(match) && (
                                <span className="text-sm text-red-600">
                                  同点です
                                </span>
                              )}
                              <button
                                onClick={() => handleSave(match.id)}
                                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                              >
                                保存
                              </button>
                            </>
                          )}
                          {match.status === 'finished' && !match.isEditing && (
                            <button
                              onClick={() => toggleEditMode(match.id)}
                              className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors"
                            >
                              再編集
                            </button>
                          )}
                          {match.isEditing && (
                            <>
                              <button
                                onClick={() => handleSave(match.id)}
                                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                              >
                                保存
                              </button>
                              <button
                                onClick={() => toggleEditMode(match.id)}
                                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
                              >
                                編集完了
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* 試合結果 */}
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">試合 {match.matchNumber}</h3>
                        {match.winner && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            勝者: {match.winner}
                          </span>
                        )}
                      </div>
                      
                      {/* チーム1 */}
                      <div className="mb-6">
                        <div className="flex items-center mb-2">
                          <span className={`w-24 font-medium ${match.winner === match.team1 ? 'text-blue-600 bg-blue-50 px-2 py-1 rounded' : 'text-gray-700'}`}>
                            {match.team1 || '未定'}
                          </span>
                          <div className="flex-1 flex items-center">
                            {[0, 1, 2, 3].map(inning => (
                              <div key={inning} className="flex-1 mx-1">
                                <label className="block text-xs text-gray-500 mb-1 text-center">
                                  {inning + 1}回
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  value={match.scores.team1[inning]}
                                  onChange={(e) => handleScoreChange(match.id, 'team1', inning, e.target.value)}
                                  className="w-full h-10 text-center border rounded focus:ring-2 focus:ring-primary focus:border-primary"
                                  disabled={!match.team1 || !match.team2 || (match.status !== 'in_progress' && !match.isEditing)}
                                />
                              </div>
                            ))}
                            <div className="ml-4 w-16">
                              <label className="block text-xs text-gray-500 mb-1 text-center">
                                合計
                              </label>
                              <div className="h-10 flex items-center justify-center font-bold text-lg">
                                {match.scores.team1.reduce((a, b) => a + b, 0)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* チーム2 */}
                      <div>
                        <div className="flex items-center">
                          <span className={`w-24 font-medium ${match.winner === match.team2 ? 'text-blue-600 bg-blue-50 px-2 py-1 rounded' : 'text-gray-700'}`}>
                            {match.team2 || '未定'}
                          </span>
                          <div className="flex-1 flex items-center">
                            {[0, 1, 2, 3].map(inning => (
                              <div key={inning} className="flex-1 mx-1">
                                <input
                                  type="number"
                                  min="0"
                                  value={match.scores.team2[inning]}
                                  onChange={(e) => handleScoreChange(match.id, 'team2', inning, e.target.value)}
                                  className="w-full h-10 text-center border rounded focus:ring-2 focus:ring-primary focus:border-primary"
                                  disabled={!match.team1 || !match.team2 || (match.status !== 'in_progress' && !match.isEditing)}
                                />
                              </div>
                            ))}
                            <div className="ml-4 w-16">
                              <div className="h-10 flex items-center justify-center font-bold text-lg">
                                {match.scores.team2.reduce((a, b) => a + b, 0)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 編集履歴 */}
                      {match.editHistory && match.editHistory.length > 0 && (
                        <div className="mt-6 pt-4 border-t">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">編集履歴</h4>
                          <div className="space-y-1 text-sm text-gray-600 max-h-32 overflow-y-auto">
                            {match.editHistory.map((history, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <span className="text-gray-400">{history.timestamp}</span>
                                <span>{history.description}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* 保存ログ表示 */}
        {saveLogs.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-primary mb-4">保存ログ</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {saveLogs.map((log, index) => (
                <div key={index} className="border-b pb-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{log.timestamp}</span>
                    <span className="font-mono text-primary">{log.matchCode}</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-gray-700">{log.action}</span>
                    <p className="text-sm text-gray-600">{log.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

// 試合時間を計算する関数
function calculateMatchDuration(startTime: string, endTime: string): string {
  const start = new Date(`2000/01/01 ${startTime}`)
  const end = new Date(`2000/01/01 ${endTime}`)
  const diffMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60))
  
  if (diffMinutes < 0) {
    // 日付をまたぐ場合の処理
    end.setDate(end.getDate() + 1)
  }
  
  const hours = Math.floor(diffMinutes / 60)
  const minutes = diffMinutes % 60
  
  if (hours > 0) {
    return `${hours}時間${minutes}分`
  }
  return `${minutes}分`
} 