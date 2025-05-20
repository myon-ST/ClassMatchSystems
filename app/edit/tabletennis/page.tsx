'use client'

import { useState, useEffect } from 'react'
import { Match, Tournament, SaveLog, TableTennisScore, EditHistory, CategoryMatch } from '@/app/types/tabletennis'

export default function TableTennisEdit() {
  const [tournament, setTournament] = useState<Tournament>({
    matches: []
  })
  const [saveLogs, setSaveLogs] = useState<SaveLog[]>([])
  const [showSaveMessage, setShowSaveMessage] = useState(false)

  // 初期トーナメントデータの生成
  useEffect(() => {
    const createEmptyCategoryMatch = (): CategoryMatch => ({
      scores: {
        team1: { set1: 0, set2: 0, set3: 0 },
        team2: { set1: 0, set2: 0, set3: 0 }
      },
      setsWon: { team1: 0, team2: 0 },
      winner: null
    })

    // 1回戦の対戦カード
    const firstRoundPairs = [
      ['1-1', '1-2'],
      ['1-3', '1-4'],
      ['1-5', '1-6'],
      ['2-1', '2-2'],
      ['2-3', '2-4'],
      ['2-5', '2-6'],
      ['3-1', '3-2'],
      ['3-3', '3-4']
    ]

    // 1回戦の試合を生成（8試合）
    const firstRoundMatches: Match[] = firstRoundPairs.map((pair, i) => ({
      id: `1-${i+1}`,
      round: 1,
      matchNumber: i + 1,
      team1: pair[0],
      team2: pair[1],
      categories: {
        mens_singles: createEmptyCategoryMatch(),
        womens_singles: createEmptyCategoryMatch(),
        mens_doubles: createEmptyCategoryMatch(),
        womens_doubles: createEmptyCategoryMatch(),
        mixed_doubles: createEmptyCategoryMatch()
      },
      categoryWins: { team1: 0, team2: 0 },
      winner: null,
      startTime: '',
      endTime: '',
      status: 'waiting',
      matchCode: `TT${(i+1).toString().padStart(2, '0')}`,
      isEditing: false,
      editHistory: []
    }))

    // 2回戦の試合を生成（4試合）
    const secondRoundMatches: Match[] = Array(4).fill(null).map((_, i) => ({
      id: `2-${i+1}`,
      round: 2,
      matchNumber: i + 1,
      team1: '',
      team2: '',
      categories: {
        mens_singles: createEmptyCategoryMatch(),
        womens_singles: createEmptyCategoryMatch(),
        mens_doubles: createEmptyCategoryMatch(),
        womens_doubles: createEmptyCategoryMatch(),
        mixed_doubles: createEmptyCategoryMatch()
      },
      categoryWins: { team1: 0, team2: 0 },
      winner: null,
      startTime: '',
      endTime: '',
      status: 'waiting',
      matchCode: `TT${(i+9).toString().padStart(2, '0')}`,
      isEditing: false,
      editHistory: []
    }))

    // 準決勝の試合を生成（2試合）
    const semifinalMatches: Match[] = Array(2).fill(null).map((_, i) => ({
      id: `3-${i+1}`,
      round: 3,
      matchNumber: i + 1,
      team1: '',
      team2: '',
      categories: {
        mens_singles: createEmptyCategoryMatch(),
        womens_singles: createEmptyCategoryMatch(),
        mens_doubles: createEmptyCategoryMatch(),
        womens_doubles: createEmptyCategoryMatch(),
        mixed_doubles: createEmptyCategoryMatch()
      },
      categoryWins: { team1: 0, team2: 0 },
      winner: null,
      startTime: '',
      endTime: '',
      status: 'waiting',
      matchCode: `TT${(i+13).toString().padStart(2, '0')}`,
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
      categories: {
        mens_singles: createEmptyCategoryMatch(),
        womens_singles: createEmptyCategoryMatch(),
        mens_doubles: createEmptyCategoryMatch(),
        womens_doubles: createEmptyCategoryMatch(),
        mixed_doubles: createEmptyCategoryMatch()
      },
      categoryWins: { team1: 0, team2: 0 },
      winner: null,
      startTime: '',
      endTime: '',
      status: 'waiting',
      matchCode: 'TT15',
      isEditing: false,
      editHistory: []
    }

    setTournament({
      matches: [...firstRoundMatches, ...secondRoundMatches, ...semifinalMatches, finalMatch]
    })
  }, [])

  // セットの勝者を判定
  const getSetWinner = (team1Score: number, team2Score: number): 'team1' | 'team2' | null => {
    if (team1Score >= 11 && team1Score - team2Score >= 2) return 'team1'
    if (team2Score >= 11 && team2Score - team1Score >= 2) return 'team2'
    return null
  }

  // カテゴリーの勝者を判定
  const calculateCategoryWinner = (categoryMatch: CategoryMatch): string | null => {
    const { team1, team2 } = categoryMatch.setsWon
    if (team1 >= 2) return 'team1'
    if (team2 >= 2) return 'team2'
    return null
  }

  // 試合の勝者を判定
  const calculateMatchWinner = (match: Match): string | null => {
    const { team1, team2 } = match.categoryWins
    if (team1 > team2) return match.team1
    if (team2 > team1) return match.team2
    return null
  }

  // スコアの更新処理
  const handleScoreChange = (
    matchId: string,
    category: keyof Match['categories'],
    team: 'team1' | 'team2',
    set: keyof TableTennisScore,
    value: string
  ) => {
    const score = parseInt(value) || 0
    setTournament(prev => ({
      matches: prev.matches.map(match => {
        if (match.id === matchId) {
          const updatedCategories = {
            ...match.categories,
            [category]: {
              ...match.categories[category],
              scores: {
                ...match.categories[category].scores,
                [team]: {
                  ...match.categories[category].scores[team],
                  [set]: score
                }
              }
            }
          }

          // セット勝利数を計算
          const categoryMatch = updatedCategories[category]
          const setsWon = {
            team1: 0,
            team2: 0
          }

          ;(['set1', 'set2', 'set3'] as const).forEach(setKey => {
            const winner = getSetWinner(
              categoryMatch.scores.team1[setKey],
              categoryMatch.scores.team2[setKey]
            )
            if (winner === 'team1') setsWon.team1++
            if (winner === 'team2') setsWon.team2++
          })

          updatedCategories[category] = {
            ...categoryMatch,
            setsWon,
            winner: calculateCategoryWinner({
              ...categoryMatch,
              setsWon
            })
          }

          // カテゴリー勝利数を計算
          const categoryWins = {
            team1: 0,
            team2: 0
          }

          Object.values(updatedCategories).forEach(cat => {
            if (cat.winner === 'team1') categoryWins.team1++
            if (cat.winner === 'team2') categoryWins.team2++
          })

          const newHistory: EditHistory = {
            timestamp: new Date().toLocaleString('ja-JP'),
            type: 'score_change',
            description: `${team === 'team1' ? match.team1 : match.team2}の${getCategoryName(category)}${
              set === 'set1' ? '第1セット'
              : set === 'set2' ? '第2セット'
              : '第3セット'
            }の得点を${score}に変更`
          }

          return {
            ...match,
            categories: updatedCategories,
            categoryWins,
            editHistory: [...match.editHistory, newHistory]
          }
        }
        return match
      })
    }))
  }

  // 試合状態の更新
  const handleMatchStatus = (matchId: string, newStatus: 'waiting' | 'in_progress' | 'finished') => {
    const match = tournament.matches.find(m => m.id === matchId)
    if (!match) return

    // 試合終了時の処理
    if (newStatus === 'finished') {
      const winner = calculateMatchWinner(match)
      if (!winner) {
        alert('試合の勝者が決定していません。3種目以上勝利したチームが必要です。')
        return
      }

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

          const winner = newStatus === 'finished'
            ? calculateMatchWinner(match)
            : null

          const newHistory = {
            timestamp: new Date().toLocaleString('ja-JP'),
            type: 'status_change' as const,
            description: newStatus === 'finished' 
              ? `試合終了 (${endTime})${winner ? ` - 勝者: ${winner}` : ''}`
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
            editHistory: [...match.editHistory, newHistory]
          }
        }
        return match
      })
    }))
  }

  // 編集モードの切り替え
  const toggleEditMode = (matchId: string) => {
    setTournament(prev => ({
      matches: prev.matches.map(match => {
        if (match.id === matchId) {
          const newHistory = {
            timestamp: new Date().toLocaleString('ja-JP'),
            type: 'status_change' as const,
            description: match.isEditing ? '編集モード終了' : '編集モード開始'
          }
          return {
            ...match,
            isEditing: !match.isEditing,
            editHistory: [...match.editHistory, newHistory]
          }
        }
        return match
      })
    }))
  }

  // 試合データの保存
  const handleSave = (matchId: string) => {
    const match = tournament.matches.find(m => m.id === matchId)
    if (!match) return

    const newLog: SaveLog = {
      timestamp: new Date().toLocaleString('ja-JP'),
      matchCode: match.matchCode,
      action: '試合データ保存',
      details: `${match.team1} vs ${match.team2} - カテゴリー勝利数: ${match.categoryWins.team1}-${match.categoryWins.team2}`
    }

    const newHistory = {
      timestamp: new Date().toLocaleString('ja-JP'),
      type: 'save' as const,
      description: '試合データを保存しました'
    }

    setTournament(prev => ({
      matches: prev.matches.map(m => 
        m.id === matchId 
          ? { ...m, editHistory: [...m.editHistory, newHistory] }
          : m
      )
    }))

    setSaveLogs(prev => [newLog, ...prev])
    setShowSaveMessage(true)
    setTimeout(() => setShowSaveMessage(false), 3000)
  }

  // カテゴリー名の日本語変換
  const getCategoryName = (category: string): string => {
    const categoryNames = {
      mens_singles: '男子シングルス',
      womens_singles: '女子シングルス',
      mens_doubles: '男子ダブルス',
      womens_doubles: '女子ダブルス',
      mixed_doubles: 'ミックスダブルス'
    }
    return categoryNames[category as keyof typeof categoryNames]
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-primary mb-8">卓球トーナメント</h1>
        
        {/* 保存成功メッセージ */}
        {showSaveMessage && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <p className="font-medium">保存しました</p>
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
              <div className="space-y-8">
                {tournament.matches
                  .filter(match => match.round === round)
                  .map(match => (
                    <div key={match.id} className="bg-white rounded-lg shadow-md p-6">
                      {/* 試合情報ヘッダー */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-primary">{match.matchCode}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-500">
                              {match.status === 'waiting' ? '開始予定:' : '開始:'}
                            </span>
                            <span>{match.startTime || '-'}</span>
                          </div>
                          {match.status === 'finished' && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-500">終了:</span>
                              <span>{match.endTime}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {match.status === 'waiting' && (
                            <button
                              onClick={() => handleMatchStatus(match.id, 'in_progress')}
                              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                              disabled={!match.team1 || !match.team2}
                            >
                              開始
                            </button>
                          )}
                          {match.status === 'in_progress' && (
                            <>
                              <button
                                onClick={() => handleMatchStatus(match.id, 'finished')}
                                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                              >
                                終了
                              </button>
                              <button
                                onClick={() => handleSave(match.id)}
                                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
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
                              編集
                            </button>
                          )}
                          {match.isEditing && (
                            <>
                              <button
                                onClick={() => handleSave(match.id)}
                                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
                              >
                                保存
                              </button>
                              <button
                                onClick={() => toggleEditMode(match.id)}
                                className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
                              >
                                完了
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* 対戦カード */}
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex-1 text-center">
                          <span className={`text-xl font-bold ${match.winner === match.team1 ? 'text-blue-600' : ''}`}>
                            {match.team1 || '未定'}
                          </span>
                        </div>
                        <div className="px-4">
                          <span className="text-2xl font-bold text-gray-400">VS</span>
                        </div>
                        <div className="flex-1 text-center">
                          <span className={`text-xl font-bold ${match.winner === match.team2 ? 'text-blue-600' : ''}`}>
                            {match.team2 || '未定'}
                          </span>
                        </div>
                      </div>

                      {/* カテゴリー別スコア */}
                      <div className="space-y-6">
                        {(Object.entries(match.categories) as [keyof Match['categories'], CategoryMatch][]).map(([category, categoryMatch]) => (
                          <div key={category} className="border rounded-lg p-4">
                            <h3 className="text-lg font-medium mb-4">{getCategoryName(category)}</h3>
                            <div className="grid grid-cols-2 gap-4">
                              {/* チーム1 */}
                              <div>
                                <div className="grid grid-cols-4 gap-2 mb-2">
                                  <div className="text-center">
                                    <div className="text-sm text-gray-500 mb-1">1st</div>
                                    <input
                                      key="set1"
                                      type="number"
                                      min="0"
                                      value={categoryMatch.scores.team1.set1}
                                      onChange={(e) => handleScoreChange(match.id, category, 'team1', 'set1', e.target.value)}
                                      className="w-full text-center border rounded"
                                      disabled={!match.team1 || !match.team2 || (match.status !== 'in_progress' && !match.isEditing)}
                                    />
                                  </div>
                                  <div className="text-center">
                                    <div className="text-sm text-gray-500 mb-1">2nd</div>
                                    <input
                                      key="set2"
                                      type="number"
                                      min="0"
                                      value={categoryMatch.scores.team1.set2}
                                      onChange={(e) => handleScoreChange(match.id, category, 'team1', 'set2', e.target.value)}
                                      className="w-full text-center border rounded"
                                      disabled={!match.team1 || !match.team2 || (match.status !== 'in_progress' && !match.isEditing)}
                                    />
                                  </div>
                                  <div className="text-center">
                                    <div className="text-sm text-gray-500 mb-1">3rd</div>
                                    <input
                                      key="set3"
                                      type="number"
                                      min="0"
                                      value={categoryMatch.scores.team1.set3}
                                      onChange={(e) => handleScoreChange(match.id, category, 'team1', 'set3', e.target.value)}
                                      className="w-full text-center border rounded"
                                      disabled={!match.team1 || !match.team2 || (match.status !== 'in_progress' && !match.isEditing)}
                                    />
                                  </div>
                                  <div className="text-center">
                                    <div className="text-sm text-gray-500 mb-1">セット</div>
                                    <div className="text-center font-bold h-[38px] flex items-center justify-center">
                                      {categoryMatch.setsWon.team1}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* チーム2 */}
                              <div>
                                <div className="grid grid-cols-4 gap-2">
                                  <div className="text-center">
                                    <div className="text-sm text-gray-500 mb-1">1st</div>
                                    <input
                                      key="set1"
                                      type="number"
                                      min="0"
                                      value={categoryMatch.scores.team2.set1}
                                      onChange={(e) => handleScoreChange(match.id, category, 'team2', 'set1', e.target.value)}
                                      className="w-full text-center border rounded"
                                      disabled={!match.team1 || !match.team2 || (match.status !== 'in_progress' && !match.isEditing)}
                                    />
                                  </div>
                                  <div className="text-center">
                                    <div className="text-sm text-gray-500 mb-1">2nd</div>
                                    <input
                                      key="set2"
                                      type="number"
                                      min="0"
                                      value={categoryMatch.scores.team2.set2}
                                      onChange={(e) => handleScoreChange(match.id, category, 'team2', 'set2', e.target.value)}
                                      className="w-full text-center border rounded"
                                      disabled={!match.team1 || !match.team2 || (match.status !== 'in_progress' && !match.isEditing)}
                                    />
                                  </div>
                                  <div className="text-center">
                                    <div className="text-sm text-gray-500 mb-1">3rd</div>
                                    <input
                                      key="set3"
                                      type="number"
                                      min="0"
                                      value={categoryMatch.scores.team2.set3}
                                      onChange={(e) => handleScoreChange(match.id, category, 'team2', 'set3', e.target.value)}
                                      className="w-full text-center border rounded"
                                      disabled={!match.team1 || !match.team2 || (match.status !== 'in_progress' && !match.isEditing)}
                                    />
                                  </div>
                                  <div className="text-center">
                                    <div className="text-sm text-gray-500 mb-1">セット</div>
                                    <div className="text-center font-bold h-[38px] flex items-center justify-center">
                                      {categoryMatch.setsWon.team2}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {categoryMatch.winner && (
                              <div className="mt-2 text-center text-sm">
                                <span className="font-medium">勝者: </span>
                                <span className="text-blue-600">
                                  {categoryMatch.winner === 'team1' ? match.team1 : match.team2}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* 総合結果 */}
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-medium mb-2">総合結果</h3>
                        <div className="flex justify-center items-center gap-8">
                          <div className="text-center">
                            <div className="text-2xl font-bold">{match.categoryWins.team1}</div>
                            <div className="text-sm text-gray-500">{match.team1 || '未定'}</div>
                          </div>
                          <div className="text-xl font-bold text-gray-400">-</div>
                          <div className="text-center">
                            <div className="text-2xl font-bold">{match.categoryWins.team2}</div>
                            <div className="text-sm text-gray-500">{match.team2 || '未定'}</div>
                          </div>
                        </div>
                        {match.winner && (
                          <div className="mt-4 text-center">
                            <span className="font-medium">勝者: </span>
                            <span className="text-blue-600 font-bold">{match.winner}</span>
                          </div>
                        )}
                      </div>

                      {/* 編集履歴 */}
                      {match.editHistory.length > 0 && (
                        <div className="mt-6 pt-4 border-t">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">編集履歴</h4>
                          <div className="space-y-1 text-sm text-gray-600 max-h-32 overflow-y-auto">
                            {match.editHistory.map((history, index) => (
                              <div key={index} className="flex gap-2">
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

        {/* 保存ログ */}
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