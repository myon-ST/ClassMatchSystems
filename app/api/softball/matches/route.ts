import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// ソフトボールの全試合を取得
export async function GET() {
  try {
        const matches = await prisma.softballMatch.findMany({
      orderBy: [
        { round: 'asc' },
        { matchNumber: 'asc' }
      ]
    })

    const transformedMatches = matches.map((match: any) => ({
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
    }))

    return NextResponse.json(transformedMatches)
  } catch (error) {
    console.error('Error fetching softball matches:', error)
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 }
    )
  }
}

// ソフトボールの試合を作成/更新
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      matchCode,
      round,
      matchNumber,
      team1,
      team2,
      team1Innings = [0,0,0,0,0,0,0],
      team2Innings = [0,0,0,0,0,0,0],
      scheduledTime = '',
      status = 'waiting',
      isHomeFirst = false
    } = body

    const team1Total = team1Innings.reduce((a: number, b: number) => a + b, 0)
    const team2Total = team2Innings.reduce((a: number, b: number) => a + b, 0)

        const match = await prisma.softballMatch.create({
      data: {
        matchCode,
        round,
        matchNumber,
        team1,
        team2,
        team1Scores: JSON.stringify(team1Innings),
        team2Scores: JSON.stringify(team2Innings),
        team1Total,
        team2Total,
        scheduledTime,
        status,
        isHomeFirst
      }
    })

    return NextResponse.json({
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
      jankenWinner: match.jankenWinner
    })
  } catch (error) {
    console.error('Error creating softball match:', error)
    return NextResponse.json(
      { error: 'Failed to create match' },
      { status: 500 }
    )
  }
} 