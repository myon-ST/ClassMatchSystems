import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // 既存の卓球試合をすべて削除
    await prisma.tableTennisMatch.deleteMany({})

    // 卓球対戦データを作成
    const initialMatches = [
      // 1回戦
      {
        matchCode: 'TUA1',
        round: 1,
        matchNumber: 1,
        team1: '2-3',
        team2: '3-1',
        scheduledTime: new Date().toISOString().slice(0, 16),
      },
      {
        matchCode: 'TUB1',
        round: 1,
        matchNumber: 2,
        team1: '2-2',
        team2: '3-3',
        scheduledTime: new Date().toISOString().slice(0, 16),
      },
      {
        matchCode: 'TUB2',
        round: 1,
        matchNumber: 3,
        team1: '2-1',
        team2: '1-3',
        scheduledTime: new Date().toISOString().slice(0, 16),
      },
      // 2回戦
      {
        matchCode: 'TUA2',
        round: 2,
        matchNumber: 1,
        team1: '3-5',
        team2: '2-6',
        scheduledTime: new Date().toISOString().slice(0, 16),
      },
      {
        matchCode: 'TUA3',
        round: 2,
        matchNumber: 2,
        team1: '1-2',
        team2: 'TUA1勝者',
        scheduledTime: new Date().toISOString().slice(0, 16),
      },
      {
        matchCode: 'TUA4',
        round: 2,
        matchNumber: 3,
        team1: '3-4',
        team2: '3-6',
        scheduledTime: new Date().toISOString().slice(0, 16),
      },
      {
        matchCode: 'TUA5',
        round: 2,
        matchNumber: 4,
        team1: '1-6',
        team2: '2-5',
        scheduledTime: new Date().toISOString().slice(0, 16),
      },
      {
        matchCode: 'TUB3',
        round: 2,
        matchNumber: 5,
        team1: '1-5',
        team2: '2-4',
        scheduledTime: new Date().toISOString().slice(0, 16),
      },
      {
        matchCode: 'TUB4',
        round: 2,
        matchNumber: 6,
        team1: 'TUB1勝者',
        team2: '3-2',
        scheduledTime: new Date().toISOString().slice(0, 16),
      },
      {
        matchCode: 'TUB5',
        round: 2,
        matchNumber: 7,
        team1: '1-1',
        team2: '1-4',
        scheduledTime: new Date().toISOString().slice(0, 16),
      },
      {
        matchCode: 'TUB6',
        round: 2,
        matchNumber: 8,
        team1: 'TUB2勝者',
        team2: '教職員',
        scheduledTime: new Date().toISOString().slice(0, 16),
      },
      // 3回戦
      {
        matchCode: 'TUA6',
        round: 3,
        matchNumber: 1,
        team1: 'TUA3勝者',
        team2: 'TUA2勝者',
        scheduledTime: new Date().toISOString().slice(0, 16),
      },
      {
        matchCode: 'TUA7',
        round: 3,
        matchNumber: 2,
        team1: 'TUA4勝者',
        team2: 'TUA5勝者',
        scheduledTime: new Date().toISOString().slice(0, 16),
      },
      {
        matchCode: 'TUB7',
        round: 3,
        matchNumber: 3,
        team1: 'TUB3勝者',
        team2: 'TUB4勝者',
        scheduledTime: new Date().toISOString().slice(0, 16),
      },
      {
        matchCode: 'TUB8',
        round: 3,
        matchNumber: 4,
        team1: 'TUB5勝者',
        team2: 'TUB6勝者',
        scheduledTime: new Date().toISOString().slice(0, 16),
      },
      // 準決勝
      {
        matchCode: 'TUA8',
        round: 4,
        matchNumber: 1,
        team1: 'TUA6勝者',
        team2: 'TUA7勝者',
        scheduledTime: new Date().toISOString().slice(0, 16),
      },
      {
        matchCode: 'TUB9',
        round: 4,
        matchNumber: 2,
        team1: 'TUB7勝者',
        team2: 'TUB8勝者',
        scheduledTime: new Date().toISOString().slice(0, 16),
      },
      // 決勝
      {
        matchCode: 'TUA9',
        round: 5,
        matchNumber: 1,
        team1: 'TUA8勝者',
        team2: 'TUB9勝者',
        scheduledTime: new Date().toISOString().slice(0, 16),
      },
      // 3位決定戦
      {
        matchCode: 'TUB10',
        round: 5,
        matchNumber: 2,
        team1: 'TUA8敗者',
        team2: 'TUB9敗者',
        scheduledTime: new Date().toISOString().slice(0, 16),
      }
    ]

    const createdMatches = await prisma.tableTennisMatch.createMany({
      data: initialMatches
    })

    return NextResponse.json({
      message: '卓球トーナメントを初期化しました',
      matchesCreated: createdMatches.count
    })

  } catch (error) {
    console.error('Error initializing table tennis tournament:', error)
    return NextResponse.json(
      { error: 'Failed to initialize tournament' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 