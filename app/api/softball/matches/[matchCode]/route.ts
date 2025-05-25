import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// 個別の試合を取得
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ matchCode: string }> }
) {
  try {
    const params = await context.params
    const { matchCode } = params

        const match = await prisma.softballMatch.findUnique({
      where: { matchCode }
    })

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    const transformedMatch = {
      id: match.id,
      matchCode: match.matchCode,
      round: match.round,
      matchNumber: match.matchNumber,
      team1: match.team1,
      team2: match.team2,
      scores: {
        team1: { innings: JSON.parse(match.team1Scores) },
        team2: { innings: JSON.parse(match.team2Scores) }
      },
      winner: match.winner,
      scheduledTime: match.scheduledTime,
      startTime: match.startTime,
      endTime: match.endTime,
      status: match.status,
      isJankenNeeded: match.isJankenNeeded,
      jankenWinner: match.jankenWinner,
      isHomeFirst: match.isHomeFirst,
      createdAt: match.createdAt,
      updatedAt: match.updatedAt
    }

    return NextResponse.json(transformedMatch)
  } catch (error) {
    console.error('Error fetching softball match:', error)
    return NextResponse.json(
      { error: 'Failed to fetch match' },
      { status: 500 }
    )
  }
}

// 個別の試合を更新
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ matchCode: string }> }
) {
  try {
    const params = await context.params
    const { matchCode } = params
    const body = await request.json()

    const {
      team1,
      team2,
      team1Innings,
      team2Innings,
      scheduledTime,
      startTime,
      endTime,
      status,
      winner,
      isJankenNeeded,
      jankenWinner,
      isHomeFirst
    } = body

    let updateData: any = {}

    // チーム名の更新をサポート
    if (team1 !== undefined) updateData.team1 = team1
    if (team2 !== undefined) updateData.team2 = team2

    if (team1Innings !== undefined) {
      updateData.team1Scores = JSON.stringify(team1Innings)
      updateData.team1Total = team1Innings.reduce((a: number, b: number) => a + b, 0)
    }

    if (team2Innings !== undefined) {
      updateData.team2Scores = JSON.stringify(team2Innings)
      updateData.team2Total = team2Innings.reduce((a: number, b: number) => a + b, 0)
    }

    if (scheduledTime !== undefined) updateData.scheduledTime = scheduledTime
    if (startTime !== undefined) updateData.startTime = startTime
    if (endTime !== undefined) updateData.endTime = endTime
    if (status !== undefined) updateData.status = status
    if (winner !== undefined) updateData.winner = winner
    if (isJankenNeeded !== undefined) updateData.isJankenNeeded = isJankenNeeded
    if (jankenWinner !== undefined) updateData.jankenWinner = jankenWinner
    if (isHomeFirst !== undefined) updateData.isHomeFirst = isHomeFirst

        const match = await prisma.softballMatch.update({
      where: { matchCode },
      data: updateData
    })

    const transformedMatch = {
      id: match.id,
      matchCode: match.matchCode,
      round: match.round,
      matchNumber: match.matchNumber,
      team1: match.team1,
      team2: match.team2,
      scores: {
        team1: { innings: JSON.parse(match.team1Scores) },
        team2: { innings: JSON.parse(match.team2Scores) }
      },
      winner: match.winner,
      scheduledTime: match.scheduledTime,
      startTime: match.startTime,
      endTime: match.endTime,
      status: match.status,
      isJankenNeeded: match.isJankenNeeded,
      jankenWinner: match.jankenWinner,
      isHomeFirst: match.isHomeFirst,
      createdAt: match.createdAt,
      updatedAt: match.updatedAt
    }

    return NextResponse.json(transformedMatch)
  } catch (error) {
    console.error('Error updating softball match:', error)
    return NextResponse.json(
      { error: 'Failed to update match' },
      { status: 500 }
    )
  }
} 