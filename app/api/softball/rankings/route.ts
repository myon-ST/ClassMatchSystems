import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 順位一覧取得
export async function GET() {
  try {
    const rankings = await prisma.softballRanking.findMany({
      orderBy: [
        { rank: 'asc' },
        { className: 'asc' }
      ]
    })

    return NextResponse.json(rankings)
  } catch (error) {
    console.error('順位取得エラー:', error)
    return NextResponse.json({ error: '順位データの取得に失敗しました' }, { status: 500 })
  }
}

// 順位更新
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { className, rank, rankText, eliminatedAt } = body

    const ranking = await prisma.softballRanking.upsert({
      where: { className },
      update: {
        rank,
        rankText,
        eliminatedAt
      },
      create: {
        className,
        rank,
        rankText,
        eliminatedAt
      }
    })

    return NextResponse.json(ranking)
  } catch (error) {
    console.error('順位更新エラー:', error)
    return NextResponse.json({ error: '順位の更新に失敗しました' }, { status: 500 })
  }
}

// 順位初期化
export async function POST() {
  try {
    // 既存の順位データを削除
    await prisma.softballRanking.deleteMany()

    // 全クラスを初期状態で作成
    const classes = [
      '1-1', '1-2', '1-3', '1-4', '1-5', '1-6',
      '2-1', '2-2', '2-3', '2-4', '2-5', '2-6',
      '3-1', '3-2', '3-3', '3-4', '3-5', '3-6',
      '教職員'
    ]

    await prisma.softballRanking.createMany({
      data: classes.map(className => ({
        className,
        rank: null,
        rankText: '参加中',
        eliminatedAt: null
      }))
    })

    return NextResponse.json({ message: '順位データを初期化しました' })
  } catch (error) {
    console.error('順位初期化エラー:', error)
    return NextResponse.json({ error: '順位の初期化に失敗しました' }, { status: 500 })
  }
} 