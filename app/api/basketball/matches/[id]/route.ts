import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// 個別試合の取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const match = await prisma.basketballMatch.findUnique({
      where: { id: parseInt(id) }
    })

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

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
      isFreeThrowNeeded: match.isFreeThrowNeeded,
      createdAt: match.createdAt.toISOString(),
      updatedAt: match.updatedAt.toISOString()
    })
  } catch (error) {
    console.error('Error fetching basketball match:', error)
    return NextResponse.json(
      { error: 'Failed to fetch match' },
      { status: 500 }
    )
  }
}

// 個別試合の更新
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const {
      team1FirstHalf,
      team1SecondHalf,
      team1FreeThrow,
      team2FirstHalf,
      team2SecondHalf,
      team2FreeThrow,
      status,
      winner,
      scheduledTime,
      startTime,
      endTime,
      isFreeThrowNeeded
    } = body

    // 合計点を計算
    const team1Total = (team1FirstHalf || 0) + (team1SecondHalf || 0)
    const team2Total = (team2FirstHalf || 0) + (team2SecondHalf || 0)

    const match = await prisma.basketballMatch.update({
      where: { id: parseInt(id) },
      data: {
        ...(team1FirstHalf !== undefined && { team1FirstHalf }),
        ...(team1SecondHalf !== undefined && { team1SecondHalf }),
        ...(team1FreeThrow !== undefined && { team1FreeThrow }),
        ...(team2FirstHalf !== undefined && { team2FirstHalf }),
        ...(team2SecondHalf !== undefined && { team2SecondHalf }),
        ...(team2FreeThrow !== undefined && { team2FreeThrow }),
        ...(status && { status }),
        ...(winner !== undefined && { winner }),
        ...(scheduledTime !== undefined && { scheduledTime }),
        ...(startTime !== undefined && { startTime }),
        ...(endTime !== undefined && { endTime }),
        ...(isFreeThrowNeeded !== undefined && { isFreeThrowNeeded }),
        team1Total,
        team2Total
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
      isFreeThrowNeeded: match.isFreeThrowNeeded,
      createdAt: match.createdAt.toISOString(),
      updatedAt: match.updatedAt.toISOString()
    })
  } catch (error) {
    console.error('Error updating basketball match:', error)
    return NextResponse.json(
      { error: 'Failed to update match' },
      { status: 500 }
    )
  }
} 