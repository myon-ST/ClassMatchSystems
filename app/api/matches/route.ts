import { NextResponse } from 'next/server'
import * as db from '@/app/utils/db'

// スコア更新
export async function PUT(request: Request) {
  try {
    const { matchId, team1Score, team2Score, winner, status } = await request.json()

    // 試合データの更新
    const updatedMatch = await db.prisma.match.update({
      where: { id: matchId },
      data: {
        team1Score,
        team2Score,
        winner,
        status,
        endTime: status === 'finished' ? new Date().toISOString() : null
      },
      include: {
        team1: true,
        team2: true
      }
    })

    return NextResponse.json(updatedMatch)
  } catch (error) {
    console.error('Error updating match score:', error)
    return NextResponse.json(
      { error: 'Failed to update match score' },
      { status: 500 }
    )
  }
}

// 試合状態の更新
export async function PATCH(request: Request) {
  try {
    const { matchId, status, winner, startTime, endTime } = await request.json()

    // 試合データの更新
    const updatedMatch = await db.prisma.match.update({
      where: { id: matchId },
      data: {
        status,
        winner,
        startTime: status === 'in_progress' ? new Date().toISOString() : startTime,
        endTime: status === 'finished' ? new Date().toISOString() : endTime
      },
      include: {
        team1: true,
        team2: true,
        group: true
      }
    })

    // 試合が終了した場合、チームの統計を更新
    if (status === 'finished' && winner) {
      const winningTeamId = winner === 'team1' ? updatedMatch.team1Id : updatedMatch.team2Id
      const losingTeamId = winner === 'team1' ? updatedMatch.team2Id : updatedMatch.team1Id

      // 勝者のチームを更新
      await db.prisma.team.update({
        where: { id: winningTeamId },
        data: {
          wins: { increment: 1 },
          points: { increment: 2 }  // 勝利で2ポイント
        }
      })

      // 敗者のチームを更新
      await db.prisma.team.update({
        where: { id: losingTeamId },
        data: {
          losses: { increment: 1 },
          points: { increment: 1 }  // 敗北で1ポイント
        }
      })
    }

    return NextResponse.json(updatedMatch)
  } catch (error) {
    console.error('Error updating match status:', error)
    return NextResponse.json(
      { error: 'Failed to update match status' },
      { status: 500 }
    )
  }
} 