import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // 卓球試合をすべて削除
    await prisma.tableTennisMatch.deleteMany({})
    
    // 卓球順位をすべて削除
    await prisma.tableTennisRanking.deleteMany({})

    return NextResponse.json({
      message: '卓球トーナメントをリセットしました'
    })

  } catch (error) {
    console.error('Error resetting table tennis tournament:', error)
    return NextResponse.json(
      { error: 'Failed to reset tournament' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 