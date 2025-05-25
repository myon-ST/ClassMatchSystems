import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const rankings = await prisma.tableTennisRanking.findMany({
      orderBy: [
        { rank: 'asc' },
        { className: 'asc' }
      ]
    })

    return NextResponse.json(rankings)

  } catch (error) {
    console.error('Error fetching table tennis rankings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rankings' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // 既存の順位を削除してから新しい順位を作成
    await prisma.tableTennisRanking.deleteMany({
      where: { className: data.className }
    })

    if (data.rank !== null || data.rankText !== null) {
      const ranking = await prisma.tableTennisRanking.create({
        data: {
          className: data.className,
          rank: data.rank,
          rankText: data.rankText,
          eliminatedAt: data.eliminatedAt
        }
      })

      return NextResponse.json(ranking)
    }

    return NextResponse.json({ message: 'Ranking cleared' })

  } catch (error) {
    console.error('Error updating table tennis ranking:', error)
    return NextResponse.json(
      { error: 'Failed to update ranking' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 