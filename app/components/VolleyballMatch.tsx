'use client'

import React from 'react';
import { Match, Team } from '../types/volleyball';

interface VolleyballMatchProps {
  match: Match;
  onScoreEdit: (matchId: string) => void;
  onStatusChange: (matchId: string, status: 'waiting' | 'in_progress' | 'finished') => void;
}

export function VolleyballMatch({ match, onScoreEdit, onStatusChange }: VolleyballMatchProps) {
  // 勝利条件をチェックする関数
  const checkWinCondition = () => {
    const team1Score = match.scores.team1.score;
    const team2Score = match.scores.team2.score;
    const scoreDiff = Math.abs(team1Score - team2Score);
    const maxScore = Math.max(team1Score, team2Score);

    return (
      // 25点に到達
      team1Score === 25 || team2Score === 25 ||
      // 21点以上で2点差
      (maxScore >= 21 && scoreDiff >= 2)
    );
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'waiting':
        return '待機中';
      case 'in_progress':
        return '試合中';
      case 'finished':
        return '終了';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'bg-gray-100 text-gray-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'finished':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm font-medium text-gray-500">
          試合番号: {match.matchCode}
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(match.status)}`}>
          {getStatusText(match.status)}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 items-center mb-4">
        <div className="text-center">
          <div className="font-medium">{match.team1}</div>
          <div className="text-2xl font-bold">{match.scores.team1.score}</div>
          {match.team1Stats && (
            <div className="text-xs text-gray-500">
              勝: {match.team1Stats.wins} 負: {match.team1Stats.losses}<br />
              得点: {match.team1Stats.scoreFor} 失点: {match.team1Stats.scoreAgainst}
            </div>
          )}
        </div>
        <div className="text-center text-xl font-bold">vs</div>
        <div className="text-center">
          <div className="font-medium">{match.team2}</div>
          <div className="text-2xl font-bold">{match.scores.team2.score}</div>
          {match.team2Stats && (
            <div className="text-xs text-gray-500">
              勝: {match.team2Stats.wins} 負: {match.team2Stats.losses}<br />
              得点: {match.team2Stats.scoreFor} 失点: {match.team2Stats.scoreAgainst}
            </div>
          )}
        </div>
      </div>

      {match.winner && (
        <div className="text-center text-sm font-medium text-green-600 mb-4">
          勝者: {match.winner === 'team1' ? match.team1 : match.team2}
        </div>
      )}

      <div className="flex justify-end space-x-2">
        {match.status === 'waiting' && (
          <button
            onClick={() => onStatusChange(match.id, 'in_progress')}
            className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            試合開始
          </button>
        )}
        
        {match.status === 'in_progress' && (
          <>
            <button
              onClick={() => onScoreEdit(match.id)}
              className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700"
            >
              スコア編集
            </button>
            {checkWinCondition() && (
              <button
                onClick={() => onStatusChange(match.id, 'finished')}
                className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
              >
                試合終了
              </button>
            )}
          </>
        )}

        {match.status === 'finished' && (
          <button
            onClick={() => onScoreEdit(match.id)}
            className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
          >
            スコア修正
          </button>
        )}
      </div>

      {match.startTime && (
        <div className="mt-2 text-xs text-gray-500">
          開始: {new Date(match.startTime).toLocaleString()}
        </div>
      )}
      {match.endTime && (
        <div className="text-xs text-gray-500">
          終了: {new Date(match.endTime).toLocaleString()}
        </div>
      )}
    </div>
  );
} 