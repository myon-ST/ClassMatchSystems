'use client'

import React, { useState } from 'react'
import { Match } from '../types/volleyball'

interface VolleyballScoreEditProps {
  match: Match
  onSave: (matchId: string, team1Score: number, team2Score: number) => void
  onCancel: () => void
}

export function VolleyballScoreEdit({ match, onSave, onCancel }: VolleyballScoreEditProps) {
  const [team1Score, setTeam1Score] = useState(match.scores.team1.score)
  const [team2Score, setTeam2Score] = useState(match.scores.team2.score)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // スコアのバリデーション
    if (team1Score < 0 || team2Score < 0) {
      setError('スコアは0以上の数値を入力してください')
      return
    }

    // スコアの上限チェック
    if (team1Score > 25 && team2Score > 25) {
      setError('両チームのスコアが25点を超えることはできません')
      return
    }

    // 勝利条件のチェック
    const maxScore = Math.max(team1Score, team2Score)
    const scoreDiff = Math.abs(team1Score - team2Score)

    if (maxScore >= 21) {
      // 21点以上の場合は2点差が必要
      if (scoreDiff < 2 && maxScore !== 25) {
        setError('21点以上の場合は2点差が必要です')
        return
      }
    }

    // スコアを保存
    onSave(match.id, team1Score, team2Score)
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h3 className="text-lg font-bold mb-4">スコア編集</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {match.team1}
            </label>
            <input
              type="number"
              min="0"
              max="25"
              value={team1Score}
              onChange={(e) => setTeam1Score(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="text-center text-xl font-bold">vs</div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {match.team2}
            </label>
            <input
              type="number"
              min="0"
              max="25"
              value={team2Score}
              onChange={(e) => setTeam2Score(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm mt-2">{error}</div>
        )}

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            保存
          </button>
        </div>
      </form>
    </div>
  )
} 