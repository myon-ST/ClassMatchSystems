'use client'

import { useState, useEffect } from 'react'
import { Match, Tournament, SaveLog } from '@/app/types/volleyball'
import { VolleyballMatch } from '@/app/components/VolleyballMatch'
import { VolleyballScoreEdit } from '@/app/components/VolleyballScoreEdit'

interface ApiTeam {
  id: string
  name: string
  groupId: string
}

interface ApiMatch {
  id: string
  matchNumber: number
  matchCode: string
  team1: ApiTeam
  team2: ApiTeam
  team1Score: number
  team2Score: number
  winner: string | null
  startTime: string | null
  endTime: string | null
  status: 'waiting' | 'in_progress' | 'finished'
  groupId: string
}

interface ApiGroup {
  id: string
  name: string
  teams: ApiTeam[]
  matches: ApiMatch[]
  winner: string | null
  tournamentId: string
}

interface ApiTournament {
  id: string
  name: string
  sport: string
  currentPhase: 'preliminary' | 'final'
  groups: ApiGroup[]
}

interface FormattedTeam {
  id: string
  name: string
  stats: {
    wins: number
    losses: number
    points: number
    scoreFor: number
    scoreAgainst: number
    pointDifference: number
  }
}

interface FormattedMatch {
  id: string
  matchNumber: number
  matchCode: string
  team1: string
  team2: string
  scores: {
    team1: { score: number }
    team2: { score: number }
  }
  winner: string | null
  startTime: string | null
  endTime: string | null
  status: 'waiting' | 'in_progress' | 'finished'
  isEditing: boolean
}

interface FormattedGroup {
  name: string
  teams: { [key: string]: FormattedTeam }
  matches: FormattedMatch[]
  winner: string | null
}

export default function VolleyballEdit() {
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [saveLogs, setSaveLogs] = useState<SaveLog[]>([])
  const [showSaveMessage, setShowSaveMessage] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // トーナメントデータの取得
  useEffect(() => {
    const initializeTournament = async () => {
      try {
        // 既存のトーナメントを検索（volleyballのトーナメントを取得）
        const response = await fetch('/api/tournaments/volleyball')
        const data = await response.json()

        if (!data || data.error) {
          console.log('Creating new tournament...')
          // トーナメントが存在しない場合、新規作成
          const createResponse = await fetch('/api/tournaments', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: 'バレーボールトーナメント',
              sport: 'volleyball'
            })
          })
          
          if (!createResponse.ok) {
            throw new Error('Failed to create tournament')
          }

          const newTournament = await createResponse.json()
          console.log('New tournament created:', newTournament)
          
          // データ構造を変換
          const formattedTournament: Tournament = {
            groups: Object.fromEntries(
              newTournament.groups.map((group: ApiGroup) => [
                group.name,
                {
                  name: group.name,
                  teams: group.teams.reduce((acc: { [key: string]: FormattedTeam }, team: ApiTeam) => ({
                    ...acc,
                    [team.id]: {
                      id: team.id,
                      name: team.name,
                      stats: {
                        wins: 0,
                        losses: 0,
                        points: 0,
                        scoreFor: 0,
                        scoreAgainst: 0,
                        pointDifference: 0
                      }
                    }
                  }), {}),
                  matches: group.matches.map((match: ApiMatch) => ({
                    id: match.id,
                    matchNumber: match.matchNumber,
                    matchCode: match.matchCode,
                    team1: match.team1.name,
                    team2: match.team2.name,
                    scores: {
                      team1: { score: 0 },
                      team2: { score: 0 }
                    },
                    winner: null,
                    startTime: null,
                    endTime: null,
                    status: 'waiting' as const,
                    isEditing: false
                  })),
                  winner: null
                }
              ])
            ),
            currentPhase: 'preliminary' as const
          }
          setTournament(formattedTournament)
        } else {
          console.log('Existing tournament found:', data)
          // データ構造を変換
          const formattedTournament: Tournament = {
            groups: Object.fromEntries(
              data.groups.map((group: ApiGroup) => [
                group.name,
                {
                  name: group.name,
                  teams: group.teams.reduce((acc: { [key: string]: FormattedTeam }, team: ApiTeam) => ({
                    ...acc,
                    [team.id]: {
                      id: team.id,
                      name: team.name,
                      stats: {
                        wins: 0,
                        losses: 0,
                        points: 0,
                        scoreFor: 0,
                        scoreAgainst: 0,
                        pointDifference: 0
                      }
                    }
                  }), {}),
                  matches: group.matches.map((match: ApiMatch) => ({
                    id: match.id,
                    matchNumber: match.matchNumber,
                    matchCode: match.matchCode,
                    team1: match.team1.name,
                    team2: match.team2.name,
                    scores: {
                      team1: { score: match.team1Score || 0 },
                      team2: { score: match.team2Score || 0 }
                    },
                    winner: match.winner,
                    startTime: match.startTime,
                    endTime: match.endTime,
                    status: match.status,
                    isEditing: false
                  })),
                  winner: group.winner
                }
              ])
            ),
            currentPhase: data.currentPhase
          }
          setTournament(formattedTournament)
        }
      } catch (error) {
        console.error('Error in initializeTournament:', error)
        setError('トーナメントデータの読み込みに失敗しました')
      } finally {
        setLoading(false)
      }
    }

    initializeTournament()
  }, [])

  const handleScoreEdit = async (matchId: string) => {
    if (!tournament) return

    setTournament(prev => {
      if (!prev) return prev
      return {
        ...prev,
        groups: Object.fromEntries(
          Object.entries(prev.groups).map(([key, group]) => [
            key,
            {
              ...group,
              matches: group.matches.map(match => ({
                ...match,
                isEditing: match.id === matchId
              }))
            }
          ])
        )
      }
    })
  }

  const handleScoreSave = async (matchId: string, team1Score: number, team2Score: number) => {
    if (!tournament) return

    try {
      // 勝利条件の判定
      let winner = null
      const scoreDiff = Math.abs(team1Score - team2Score)
      
      if (
        // 25点に到達
        team1Score === 25 || team2Score === 25 ||
        // 21点以上で2点差
        (Math.max(team1Score, team2Score) >= 21 && scoreDiff >= 2)
      ) {
        winner = team1Score > team2Score ? 'team1' : 'team2'
      }
      
      const response = await fetch('/api/matches', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchId,
          team1Score,
          team2Score,
          winner,
          status: winner ? 'finished' : 'in_progress'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update match score')
      }

      const updatedMatch = await response.json()
      
      // UIの更新
      setTournament(prev => {
        if (!prev) return prev
        return {
          ...prev,
          groups: Object.fromEntries(
            Object.entries(prev.groups).map(([key, group]) => [
              key,
              {
                ...group,
                matches: group.matches.map(match => 
                  match.id === matchId ? { ...updatedMatch, isEditing: false } : match
                )
              }
            ])
          )
        }
      })

      // 保存ログの更新
      const newLog: SaveLog = {
        timestamp: new Date().toISOString(),
        matchCode: updatedMatch.matchCode,
        action: 'score_update',
        details: `スコアを更新しました: ${team1Score}-${team2Score}${winner ? ' (試合終了)' : ''}`
      }
      setSaveLogs(prev => [newLog, ...prev])
      setShowSaveMessage(true)
      setTimeout(() => setShowSaveMessage(false), 2000)

      // ページをリロード
      window.location.reload()

    } catch (error) {
      setError('Failed to save match score')
    }
  }

  const handleScoreCancel = () => {
    if (!tournament) return

    setTournament(prev => {
      if (!prev) return prev
      return {
        ...prev,
        groups: Object.fromEntries(
          Object.entries(prev.groups).map(([key, group]) => [
            key,
            {
              ...group,
              matches: group.matches.map(match => ({
                ...match,
                isEditing: false
              }))
            }
          ])
        )
      }
    })
  }

  const handleStatusChange = async (matchId: string, status: 'waiting' | 'in_progress' | 'finished') => {
    if (!tournament) return

    try {
      // 試合終了時の処理
      let winner = null
      if (status === 'finished') {
        // 該当する試合を見つける
        const match = Object.values(tournament.groups)
          .flatMap(group => group.matches)
          .find(m => m.id === matchId)

        if (match) {
          const team1Score = match.scores.team1.score
          const team2Score = match.scores.team2.score
          winner = team1Score > team2Score ? 'team1' : 'team2'
        }
      }

      const response = await fetch('/api/matches', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchId,
          status,
          winner,
          startTime: status === 'in_progress' ? new Date().toISOString() : null,
          endTime: status === 'finished' ? new Date().toISOString() : null
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update match status')
      }

      const updatedMatch = await response.json()
      
      // UIの更新
      setTournament(prev => {
        if (!prev) return prev
        return {
          ...prev,
          groups: Object.fromEntries(
            Object.entries(prev.groups).map(([key, group]) => [
              key,
              {
                ...group,
                matches: group.matches.map(match => 
                  match.id === matchId ? updatedMatch : match
                )
              }
            ])
          )
        }
      })

      // 保存ログの更新
      const newLog: SaveLog = {
        timestamp: new Date().toISOString(),
        matchCode: updatedMatch.matchCode,
        action: 'status_update',
        details: `試合状態を更新しました: ${status}${status === 'finished' ? ' (試合終了)' : ''}`
      }
      setSaveLogs(prev => [newLog, ...prev])
      setShowSaveMessage(true)
      setTimeout(() => setShowSaveMessage(false), 2000)

      // ページをリロード
      window.location.reload()

    } catch (error) {
      setError('Failed to update match status')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner spinner-lg"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  if (!tournament) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          トーナメントデータが見つかりません
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">バレーボール トーナメント管理</h1>

      {showSaveMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg fade-in">
          データを保存しました
        </div>
      )}

      {/* 保存ログ */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">保存ログ</h2>
        <div className="bg-white rounded-lg shadow p-4 max-h-40 overflow-y-auto">
          {saveLogs.map((log, index) => (
            <div key={index} className="text-sm text-gray-600 mb-2">
              {new Date(log.timestamp).toLocaleString()} - {log.details}
            </div>
          ))}
        </div>
      </div>

      {/* 予選リーグ */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">予選リーグ</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.entries(tournament.groups)
            .filter(([groupName]) => groupName !== 'Final')
            .map(([groupName, group]) => (
              <div key={groupName} className="space-y-6">
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="text-xl font-bold mb-4">{groupName}グループ</h3>
                  
                  {/* 試合一覧 */}
                  <div className="space-y-4">
                    {group.matches.map(match => {
                      const editingMatch = match.isEditing ? (
                        <VolleyballScoreEdit
                          key={`edit-${match.id}`}
                          match={match}
                          onSave={handleScoreSave}
                          onCancel={handleScoreCancel}
                        />
                      ) : null

                      return (
                        <div key={match.id}>
                          <VolleyballMatch
                            match={match}
                            onScoreEdit={handleScoreEdit}
                            onStatusChange={handleStatusChange}
                          />
                          {editingMatch}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* 決勝リーグ */}
      {tournament.groups.Final && (
        <div>
          <h2 className="text-2xl font-bold mb-4">決勝リーグ</h2>
          <div className="bg-white rounded-lg shadow p-4">
            {/* 試合一覧 */}
            <div className="space-y-4">
              {tournament.groups.Final.matches.map(match => {
                const editingMatch = match.isEditing ? (
                  <VolleyballScoreEdit
                    key={`edit-${match.id}`}
                    match={match}
                    onSave={handleScoreSave}
                    onCancel={handleScoreCancel}
                  />
                ) : null

                return (
                  <div key={match.id}>
                    <VolleyballMatch
                      match={match}
                      onScoreEdit={handleScoreEdit}
                      onStatusChange={handleStatusChange}
                    />
                    {editingMatch}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 