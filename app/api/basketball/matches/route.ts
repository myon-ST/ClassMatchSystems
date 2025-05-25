import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// バスケットボールの全試合を取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const gender = searchParams.get('gender') // "men" or "women"
    
    const whereClause = gender ? { gender } : {}
    
    const matches = await prisma.basketballMatch.findMany({
      where: whereClause,
      orderBy: [
        { round: 'asc' },
        { matchNumber: 'asc' }
      ]
    })

    const transformedMatches = matches.map((match: any) => ({
      id: match.id.toString(),
      matchCode: match.matchCode,
      gender: match.gender,
      round: match.round,
      matchNumber: match.matchNumber,
      team1: match.team1,
      team2: match.team2,
      scores: {
        team1: {
          firstHalf: match.team1FirstHalf,
          secondHalf: match.team1SecondHalf,
          freeThrow: match.team1FreeThrow
        },
        team2: {
          firstHalf: match.team2FirstHalf,
          secondHalf: match.team2SecondHalf,
          freeThrow: match.team2FreeThrow
        }
      },
      winner: match.winner,
      scheduledTime: match.scheduledTime,
      startTime: match.startTime,
      endTime: match.endTime,
      status: match.status,
      isFreeThrowNeeded: match.isFreeThrowNeeded,
      createdAt: match.createdAt.toISOString(),
      updatedAt: match.updatedAt.toISOString()
    }))

    return NextResponse.json(transformedMatches)
  } catch (error) {
    console.error('Error fetching basketball matches:', error)
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 }
    )
  }
}

// バスケットボールの試合を作成/更新
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      matchCode,
      gender,
      round,
      matchNumber,
      team1,
      team2,
      team1FirstHalf = 0,
      team1SecondHalf = 0,
      team1FreeThrow = 0,
      team2FirstHalf = 0,
      team2SecondHalf = 0,
      team2FreeThrow = 0,
      scheduledTime = '',
      status = 'waiting'
    } = body

    const team1Total = team1FirstHalf + team1SecondHalf
    const team2Total = team2FirstHalf + team2SecondHalf

    const match = await prisma.basketballMatch.create({
      data: {
        matchCode,
        gender,
        round,
        matchNumber,
        team1,
        team2,
        team1FirstHalf,
        team1SecondHalf,
        team1FreeThrow,
        team2FirstHalf,
        team2SecondHalf,
        team2FreeThrow,
        team1Total,
        team2Total,
        scheduledTime,
        status
      }
    })

    return NextResponse.json({
      id: match.id.toString(),
      matchCode: match.matchCode,
      gender: match.gender,
      round: match.round,
      matchNumber: match.matchNumber,
      team1: match.team1,
      team2: match.team2,
      scores: {
        team1: {
          firstHalf: match.team1FirstHalf,
          secondHalf: match.team1SecondHalf,
          freeThrow: match.team1FreeThrow
        },
        team2: {
          firstHalf: match.team2FirstHalf,
          secondHalf: match.team2SecondHalf,
          freeThrow: match.team2FreeThrow
        }
      },
      winner: match.winner,
      scheduledTime: match.scheduledTime,
      startTime: match.startTime,
      endTime: match.endTime,
      status: match.status,
      isFreeThrowNeeded: match.isFreeThrowNeeded
    })
  } catch (error) {
    console.error('Error creating basketball match:', error)
    return NextResponse.json(
      { error: 'Failed to create match' },
      { status: 500 }
    )
  }
} 