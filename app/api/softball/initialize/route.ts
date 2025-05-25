import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // 既存のソフトボール試合をすべて削除
    await prisma.softballMatch.deleteMany({})

    // ソフトボールの正しい対戦データを作成
    const initialMatches = [
      // 1回戦
      {
        matchCode: 'A1',
        round: 1,
        matchNumber: 1,
        team1: '2-4',
        team2: '2-3',
        team1Scores: '[0,0,0,0,0,0,0]',
        team2Scores: '[0,0,0,0,0,0,0]',
        team1Total: 0,
        team2Total: 0,
        status: 'waiting',
        scheduledTime: new Date().toISOString().slice(0, 16),
        startTime: '',
        endTime: '',
        isJankenNeeded: false,
        isHomeFirst: false
      },
      {
        matchCode: 'B1',
        round: 1,
        matchNumber: 2,
        team1: '3-6',
        team2: '1-2',
        team1Scores: '[0,0,0,0,0,0,0]',
        team2Scores: '[0,0,0,0,0,0,0]',
        team1Total: 0,
        team2Total: 0,
        status: 'waiting',
        scheduledTime: new Date().toISOString().slice(0, 16),
        startTime: '',
        endTime: '',
        isJankenNeeded: false,
        isHomeFirst: false
      },
      {
        matchCode: 'B2',
        round: 1,
        matchNumber: 3,
        team1: '1-1',
        team2: '3-2',
        team1Scores: '[0,0,0,0,0,0,0]',
        team2Scores: '[0,0,0,0,0,0,0]',
        team1Total: 0,
        team2Total: 0,
        status: 'waiting',
        scheduledTime: new Date().toISOString().slice(0, 16),
        startTime: '',
        endTime: '',
        isJankenNeeded: false,
        isHomeFirst: false
      },
      // 2回戦
      {
        matchCode: 'A2',
        round: 2,
        matchNumber: 1,
        team1: '2-6',
        team2: '1-4',
        team1Scores: '[0,0,0,0,0,0,0]',
        team2Scores: '[0,0,0,0,0,0,0]',
        team1Total: 0,
        team2Total: 0,
        status: 'waiting',
        scheduledTime: new Date().toISOString().slice(0, 16),
        startTime: '',
        endTime: '',
        isJankenNeeded: false,
        isHomeFirst: false
      },
      {
        matchCode: 'A3',
        round: 2,
        matchNumber: 2,
        team1: '2-1',
        team2: '1-6',
        team1Scores: '[0,0,0,0,0,0,0]',
        team2Scores: '[0,0,0,0,0,0,0]',
        team1Total: 0,
        team2Total: 0,
        status: 'waiting',
        scheduledTime: new Date().toISOString().slice(0, 16),
        startTime: '',
        endTime: '',
        isJankenNeeded: false,
        isHomeFirst: false
      },
      {
        matchCode: 'A4',
        round: 2,
        matchNumber: 3,
        team1: '3-3',
        team2: '3-5',
        team1Scores: '[0,0,0,0,0,0,0]',
        team2Scores: '[0,0,0,0,0,0,0]',
        team1Total: 0,
        team2Total: 0,
        status: 'waiting',
        scheduledTime: new Date().toISOString().slice(0, 16),
        startTime: '',
        endTime: '',
        isJankenNeeded: false,
        isHomeFirst: false
      },
      {
        matchCode: 'A5',
        round: 2,
        matchNumber: 4,
        team1: '2-2',
        team2: 'A1勝者',
        team1Scores: '[0,0,0,0,0,0,0]',
        team2Scores: '[0,0,0,0,0,0,0]',
        team1Total: 0,
        team2Total: 0,
        status: 'waiting',
        scheduledTime: new Date().toISOString().slice(0, 16),
        startTime: '',
        endTime: '',
        isJankenNeeded: false,
        isHomeFirst: false
      },
      {
        matchCode: 'B3',
        round: 2,
        matchNumber: 5,
        team1: '3-4',
        team2: '3-1',
        team1Scores: '[0,0,0,0,0,0,0]',
        team2Scores: '[0,0,0,0,0,0,0]',
        team1Total: 0,
        team2Total: 0,
        status: 'waiting',
        scheduledTime: new Date().toISOString().slice(0, 16),
        startTime: '',
        endTime: '',
        isJankenNeeded: false,
        isHomeFirst: false
      },
      {
        matchCode: 'B4',
        round: 2,
        matchNumber: 6,
        team1: '1-3',
        team2: '1-5',
        team1Scores: '[0,0,0,0,0,0,0]',
        team2Scores: '[0,0,0,0,0,0,0]',
        team1Total: 0,
        team2Total: 0,
        status: 'waiting',
        scheduledTime: new Date().toISOString().slice(0, 16),
        startTime: '',
        endTime: '',
        isJankenNeeded: false,
        isHomeFirst: false
      },
      {
        matchCode: 'B5',
        round: 2,
        matchNumber: 7,
        team1: 'B1勝者',
        team2: '2-5',
        team1Scores: '[0,0,0,0,0,0,0]',
        team2Scores: '[0,0,0,0,0,0,0]',
        team1Total: 0,
        team2Total: 0,
        status: 'waiting',
        scheduledTime: new Date().toISOString().slice(0, 16),
        startTime: '',
        endTime: '',
        isJankenNeeded: false,
        isHomeFirst: false
      },
      {
        matchCode: 'B6',
        round: 2,
        matchNumber: 8,
        team1: 'B2勝者',
        team2: '教職員',
        team1Scores: '[0,0,0,0,0,0,0]',
        team2Scores: '[0,0,0,0,0,0,0]',
        team1Total: 0,
        team2Total: 0,
        status: 'waiting',
        scheduledTime: new Date().toISOString().slice(0, 16),
        startTime: '',
        endTime: '',
        isJankenNeeded: false,
        isHomeFirst: false
      },
      // 3回戦
      {
        matchCode: 'A6',
        round: 3,
        matchNumber: 1,
        team1: 'A3勝者',
        team2: 'A2勝者',
        team1Scores: '[0,0,0,0,0,0,0]',
        team2Scores: '[0,0,0,0,0,0,0]',
        team1Total: 0,
        team2Total: 0,
        status: 'waiting',
        scheduledTime: new Date().toISOString().slice(0, 16),
        startTime: '',
        endTime: '',
        isJankenNeeded: false,
        isHomeFirst: false
      },
      {
        matchCode: 'A7',
        round: 3,
        matchNumber: 2,
        team1: 'A5勝者',
        team2: 'A4勝者',
        team1Scores: '[0,0,0,0,0,0,0]',
        team2Scores: '[0,0,0,0,0,0,0]',
        team1Total: 0,
        team2Total: 0,
        status: 'waiting',
        scheduledTime: new Date().toISOString().slice(0, 16),
        startTime: '',
        endTime: '',
        isJankenNeeded: false,
        isHomeFirst: false
      },
      {
        matchCode: 'B7',
        round: 3,
        matchNumber: 3,
        team1: 'B3勝者',
        team2: 'B5勝者',
        team1Scores: '[0,0,0,0,0,0,0]',
        team2Scores: '[0,0,0,0,0,0,0]',
        team1Total: 0,
        team2Total: 0,
        status: 'waiting',
        scheduledTime: new Date().toISOString().slice(0, 16),
        startTime: '',
        endTime: '',
        isJankenNeeded: false,
        isHomeFirst: false
      },
      {
        matchCode: 'A8',
        round: 3,
        matchNumber: 4,
        team1: 'B4勝者',
        team2: 'B6勝者',
        team1Scores: '[0,0,0,0,0,0,0]',
        team2Scores: '[0,0,0,0,0,0,0]',
        team1Total: 0,
        team2Total: 0,
        status: 'waiting',
        scheduledTime: new Date().toISOString().slice(0, 16),
        startTime: '',
        endTime: '',
        isJankenNeeded: false,
        isHomeFirst: false
      },
      // 準決勝
      {
        matchCode: 'A9',
        round: 4,
        matchNumber: 1,
        team1: 'A7勝者',
        team2: 'A6勝者',
        team1Scores: '[0,0,0,0,0,0,0]',
        team2Scores: '[0,0,0,0,0,0,0]',
        team1Total: 0,
        team2Total: 0,
        status: 'waiting',
        scheduledTime: new Date().toISOString().slice(0, 16),
        startTime: '',
        endTime: '',
        isJankenNeeded: false,
        isHomeFirst: false
      },
      {
        matchCode: 'B8',
        round: 4,
        matchNumber: 2,
        team1: 'B7勝者',
        team2: 'A8勝者',
        team1Scores: '[0,0,0,0,0,0,0]',
        team2Scores: '[0,0,0,0,0,0,0]',
        team1Total: 0,
        team2Total: 0,
        status: 'waiting',
        scheduledTime: new Date().toISOString().slice(0, 16),
        startTime: '',
        endTime: '',
        isJankenNeeded: false,
        isHomeFirst: false
      },
      // 決勝
      {
        matchCode: 'B9',
        round: 5,
        matchNumber: 1,
        team1: 'A9勝者',
        team2: 'B8勝者',
        team1Scores: '[0,0,0,0,0,0,0]',
        team2Scores: '[0,0,0,0,0,0,0]',
        team1Total: 0,
        team2Total: 0,
        status: 'waiting',
        scheduledTime: new Date().toISOString().slice(0, 16),
        startTime: '',
        endTime: '',
        isJankenNeeded: false,
        isHomeFirst: false
      },
      // 3位決定戦
      {
        matchCode: 'A10',
        round: 5,
        matchNumber: 2,
        team1: 'A9敗者',
        team2: 'B8敗者',
        team1Scores: '[0,0,0,0,0,0,0]',
        team2Scores: '[0,0,0,0,0,0,0]',
        team1Total: 0,
        team2Total: 0,
        status: 'waiting',
        scheduledTime: new Date().toISOString().slice(0, 16),
        startTime: '',
        endTime: '',
        isJankenNeeded: false,
        isHomeFirst: false
      }
    ]

    const createdMatches = await prisma.softballMatch.createMany({
      data: initialMatches
    })

    return NextResponse.json({
      message: 'ソフトボールトーナメントを初期化しました',
      matchesCreated: createdMatches.count
    })

  } catch (error) {
    console.error('Error initializing softball tournament:', error)
    return NextResponse.json(
      { error: 'Failed to initialize tournament' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 