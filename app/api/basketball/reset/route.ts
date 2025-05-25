import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { gender } = await request.json()

    if (!gender || (gender !== 'men' && gender !== 'women')) {
      return NextResponse.json(
        { error: 'Invalid gender parameter' },
        { status: 400 }
      )
    }

    // 該当する性別のバスケットボール試合をすべて削除
    const deleteResult = await prisma.basketballMatch.deleteMany({
      where: {
        gender: gender
      }
    })

    // 該当する性別のバスケットボール順位もすべて削除
    const deleteRankingsResult = await prisma.basketballRanking.deleteMany({
      where: {
        gender: gender
      }
    })

    // 正しいバスケットボール対戦データを再作成
    const prefix = gender === 'men' ? 'BM' : 'BW'
    
    const initialMatches = [
      // 1回戦
      {
        matchCode: `${prefix}A1`,
        round: 1,
        matchNumber: 1,
        team1: '1-5',
        team2: '2-4',
        team1FirstHalf: 0,
        team1SecondHalf: 0,
        team1FreeThrow: 0,
        team2FirstHalf: 0,
        team2SecondHalf: 0,
        team2FreeThrow: 0,
        team1Total: 0,
        team2Total: 0,
        status: 'waiting',
        scheduledTime: new Date().toISOString().slice(0, 16),
        startTime: '',
        endTime: '',
        isFreeThrowNeeded: false,
        gender: gender
      },
      {
        matchCode: `${prefix}B1`,
        round: 1,
        matchNumber: 2,
        team1: '3-6',
        team2: '2-2',
        team1FirstHalf: 0,
        team1SecondHalf: 0,
        team1FreeThrow: 0,
        team2FirstHalf: 0,
        team2SecondHalf: 0,
        team2FreeThrow: 0,
        team1Total: 0,
        team2Total: 0,
        status: 'waiting',
        scheduledTime: new Date().toISOString().slice(0, 16),
        startTime: '',
        endTime: '',
        isFreeThrowNeeded: false,
        gender: gender
      },
      {
        matchCode: `${prefix}B2`,
        round: 1,
        matchNumber: 3,
        team1: '1-4',
        team2: '3-4',
        team1FirstHalf: 0,
        team1SecondHalf: 0,
        team1FreeThrow: 0,
        team2FirstHalf: 0,
        team2SecondHalf: 0,
        team2FreeThrow: 0,
        team1Total: 0,
        team2Total: 0,
        status: 'waiting',
        scheduledTime: new Date().toISOString().slice(0, 16),
        startTime: '',
        endTime: '',
        isFreeThrowNeeded: false,
        gender: gender
      },
      // 2回戦
      {
        matchCode: `${prefix}A2`,
        round: 2,
        matchNumber: 1,
        team1: '1-1',
        team2: '2-5',
        team1FirstHalf: 0,
        team1SecondHalf: 0,
        team1FreeThrow: 0,
        team2FirstHalf: 0,
        team2SecondHalf: 0,
        team2FreeThrow: 0,
        team1Total: 0,
        team2Total: 0,
        status: 'waiting',
        scheduledTime: new Date().toISOString().slice(0, 16),
        startTime: '',
        endTime: '',
        isFreeThrowNeeded: false,
        gender: gender
      },
      {
        matchCode: `${prefix}A3`,
        round: 2,
        matchNumber: 2,
        team1: '3-1',
        team2: '1-2',
        team1FirstHalf: 0,
        team1SecondHalf: 0,
        team1FreeThrow: 0,
        team2FirstHalf: 0,
        team2SecondHalf: 0,
        team2FreeThrow: 0,
        team1Total: 0,
        team2Total: 0,
        status: 'waiting',
        scheduledTime: new Date().toISOString().slice(0, 16),
        startTime: '',
        endTime: '',
        isFreeThrowNeeded: false,
        gender: gender
      },
      {
        matchCode: `${prefix}A4`,
        round: 2,
        matchNumber: 3,
        team1: '2-3',
        team2: '3-5',
        team1FirstHalf: 0,
        team1SecondHalf: 0,
        team1FreeThrow: 0,
        team2FirstHalf: 0,
        team2SecondHalf: 0,
        team2FreeThrow: 0,
        team1Total: 0,
        team2Total: 0,
        status: 'waiting',
        scheduledTime: new Date().toISOString().slice(0, 16),
        startTime: '',
        endTime: '',
        isFreeThrowNeeded: false,
        gender: gender
      },
      {
        matchCode: `${prefix}A5`,
        round: 2,
        matchNumber: 4,
        team1: '1-6',
        team2: `${prefix}A1勝者`,
        team1FirstHalf: 0,
        team1SecondHalf: 0,
        team1FreeThrow: 0,
        team2FirstHalf: 0,
        team2SecondHalf: 0,
        team2FreeThrow: 0,
        team1Total: 0,
        team2Total: 0,
        status: 'waiting',
        scheduledTime: new Date().toISOString().slice(0, 16),
        startTime: '',
        endTime: '',
        isFreeThrowNeeded: false,
        gender: gender
      },
      {
        matchCode: `${prefix}B3`,
        round: 2,
        matchNumber: 5,
        team1: '3-3',
        team2: '2-1',
        team1FirstHalf: 0,
        team1SecondHalf: 0,
        team1FreeThrow: 0,
        team2FirstHalf: 0,
        team2SecondHalf: 0,
        team2FreeThrow: 0,
        team1Total: 0,
        team2Total: 0,
        status: 'waiting',
        scheduledTime: new Date().toISOString().slice(0, 16),
        startTime: '',
        endTime: '',
        isFreeThrowNeeded: false,
        gender: gender
      },
      {
        matchCode: `${prefix}B4`,
        round: 2,
        matchNumber: 6,
        team1: '1-3',
        team2: '2-6',
        team1FirstHalf: 0,
        team1SecondHalf: 0,
        team1FreeThrow: 0,
        team2FirstHalf: 0,
        team2SecondHalf: 0,
        team2FreeThrow: 0,
        team1Total: 0,
        team2Total: 0,
        status: 'waiting',
        scheduledTime: new Date().toISOString().slice(0, 16),
        startTime: '',
        endTime: '',
        isFreeThrowNeeded: false,
        gender: gender
      },
      {
        matchCode: `${prefix}B5`,
        round: 2,
        matchNumber: 7,
        team1: `${prefix}B1勝者`,
        team2: '3-2',
        team1FirstHalf: 0,
        team1SecondHalf: 0,
        team1FreeThrow: 0,
        team2FirstHalf: 0,
        team2SecondHalf: 0,
        team2FreeThrow: 0,
        team1Total: 0,
        team2Total: 0,
        status: 'waiting',
        scheduledTime: new Date().toISOString().slice(0, 16),
        startTime: '',
        endTime: '',
        isFreeThrowNeeded: false,
        gender: gender
      },
      {
        matchCode: `${prefix}B6`,
        round: 2,
        matchNumber: 8,
        team1: `${prefix}B2勝者`,
        team2: '教職員',
        team1FirstHalf: 0,
        team1SecondHalf: 0,
        team1FreeThrow: 0,
        team2FirstHalf: 0,
        team2SecondHalf: 0,
        team2FreeThrow: 0,
        team1Total: 0,
        team2Total: 0,
        status: 'waiting',
        scheduledTime: new Date().toISOString().slice(0, 16),
        startTime: '',
        endTime: '',
        isFreeThrowNeeded: false,
        gender: gender
      },
      // 3回戦
      {
        matchCode: `${prefix}A6`,
        round: 3,
        matchNumber: 1,
        team1: `${prefix}A3勝者`,
        team2: `${prefix}A2勝者`,
        team1FirstHalf: 0,
        team1SecondHalf: 0,
        team1FreeThrow: 0,
        team2FirstHalf: 0,
        team2SecondHalf: 0,
        team2FreeThrow: 0,
        team1Total: 0,
        team2Total: 0,
        status: 'waiting',
        scheduledTime: new Date().toISOString().slice(0, 16),
        startTime: '',
        endTime: '',
        isFreeThrowNeeded: false,
        gender: gender
      },
      {
        matchCode: `${prefix}A7`,
        round: 3,
        matchNumber: 2,
        team1: `${prefix}A5勝者`,
        team2: `${prefix}A4勝者`,
        team1FirstHalf: 0,
        team1SecondHalf: 0,
        team1FreeThrow: 0,
        team2FirstHalf: 0,
        team2SecondHalf: 0,
        team2FreeThrow: 0,
        team1Total: 0,
        team2Total: 0,
        status: 'waiting',
        scheduledTime: new Date().toISOString().slice(0, 16),
        startTime: '',
        endTime: '',
        isFreeThrowNeeded: false,
        gender: gender
      },
      {
        matchCode: `${prefix}B7`,
        round: 3,
        matchNumber: 3,
        team1: `${prefix}B3勝者`,
        team2: `${prefix}B5勝者`,
        team1FirstHalf: 0,
        team1SecondHalf: 0,
        team1FreeThrow: 0,
        team2FirstHalf: 0,
        team2SecondHalf: 0,
        team2FreeThrow: 0,
        team1Total: 0,
        team2Total: 0,
        status: 'waiting',
        scheduledTime: new Date().toISOString().slice(0, 16),
        startTime: '',
        endTime: '',
        isFreeThrowNeeded: false,
        gender: gender
      },
      {
        matchCode: `${prefix}B8`,
        round: 3,
        matchNumber: 4,
        team1: `${prefix}B4勝者`,
        team2: `${prefix}B6勝者`,
        team1FirstHalf: 0,
        team1SecondHalf: 0,
        team1FreeThrow: 0,
        team2FirstHalf: 0,
        team2SecondHalf: 0,
        team2FreeThrow: 0,
        team1Total: 0,
        team2Total: 0,
        status: 'waiting',
        scheduledTime: new Date().toISOString().slice(0, 16),
        startTime: '',
        endTime: '',
        isFreeThrowNeeded: false,
        gender: gender
      },
      // 準決勝
      {
        matchCode: `${prefix}B9`,
        round: 4,
        matchNumber: 1,
        team1: `${prefix}A7勝者`,
        team2: `${prefix}A6勝者`,
        team1FirstHalf: 0,
        team1SecondHalf: 0,
        team1FreeThrow: 0,
        team2FirstHalf: 0,
        team2SecondHalf: 0,
        team2FreeThrow: 0,
        team1Total: 0,
        team2Total: 0,
        status: 'waiting',
        scheduledTime: new Date().toISOString().slice(0, 16),
        startTime: '',
        endTime: '',
        isFreeThrowNeeded: false,
        gender: gender
      },
      {
        matchCode: `${prefix}B10`,
        round: 4,
        matchNumber: 2,
        team1: `${prefix}B7勝者`,
        team2: `${prefix}B8勝者`,
        team1FirstHalf: 0,
        team1SecondHalf: 0,
        team1FreeThrow: 0,
        team2FirstHalf: 0,
        team2SecondHalf: 0,
        team2FreeThrow: 0,
        team1Total: 0,
        team2Total: 0,
        status: 'waiting',
        scheduledTime: new Date().toISOString().slice(0, 16),
        startTime: '',
        endTime: '',
        isFreeThrowNeeded: false,
        gender: gender
      },
      // 決勝
      {
        matchCode: `${prefix}A8`,
        round: 5,
        matchNumber: 1,
        team1: `${prefix}B9勝者`,
        team2: `${prefix}B10勝者`,
        team1FirstHalf: 0,
        team1SecondHalf: 0,
        team1FreeThrow: 0,
        team2FirstHalf: 0,
        team2SecondHalf: 0,
        team2FreeThrow: 0,
        team1Total: 0,
        team2Total: 0,
        status: 'waiting',
        scheduledTime: new Date().toISOString().slice(0, 16),
        startTime: '',
        endTime: '',
        isFreeThrowNeeded: false,
        gender: gender
      },
      // 3位決定戦
      {
        matchCode: `${prefix}B11`,
        round: 5,
        matchNumber: 2,
        team1: `${prefix}B9敗者`,
        team2: `${prefix}B10敗者`,
        team1FirstHalf: 0,
        team1SecondHalf: 0,
        team1FreeThrow: 0,
        team2FirstHalf: 0,
        team2SecondHalf: 0,
        team2FreeThrow: 0,
        team1Total: 0,
        team2Total: 0,
        status: 'waiting',
        scheduledTime: new Date().toISOString().slice(0, 16),
        startTime: '',
        endTime: '',
        isFreeThrowNeeded: false,
        gender: gender
      }
    ]

    const createdMatches = await prisma.basketballMatch.createMany({
      data: initialMatches
    })

    return NextResponse.json({
      message: `${gender === 'men' ? '男子' : '女子'}バスケットボールトーナメントをリセットしました`,
      deletedCount: deleteResult.count,
      deletedRankingsCount: deleteRankingsResult.count,
      matchesCreated: createdMatches.count
    })

  } catch (error) {
    console.error('Error resetting basketball tournament:', error)
    return NextResponse.json(
      { error: 'Failed to reset tournament' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 