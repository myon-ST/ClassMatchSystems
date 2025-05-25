import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    // 全試合を取得
    const allMatches = await prisma.basketballMatch.findMany({
      orderBy: { updatedAt: 'desc' }
    })

    // 完了した試合のみ
    const completedMatches = allMatches.filter(match => match.status === 'finished')

    // 最高得点を計算
    let highestScore = { score: 0, team: '', matchCode: '' }
    
    completedMatches.forEach(match => {
      const team1Total = match.team1FirstHalf + match.team1SecondHalf + match.team1FreeThrow
      const team2Total = match.team2FirstHalf + match.team2SecondHalf + match.team2FreeThrow
      
      if (team1Total > highestScore.score) {
        highestScore = {
          score: team1Total,
          team: match.team1,
          matchCode: match.matchCode
        }
      }
      
      if (team2Total > highestScore.score) {
        highestScore = {
          score: team2Total,
          team: match.team2,
          matchCode: match.matchCode
        }
      }
    })

    // フリースロー決着の試合数
    const freeThrowMatches = completedMatches.filter(match => match.isFreeThrowNeeded).length

    // 最終更新日時
    const lastUpdated = allMatches.length > 0 ? allMatches[0].updatedAt.toISOString() : new Date().toISOString()

    const statistics = {
      totalMatches: allMatches.length,
      completedMatches: completedMatches.length,
      highestScore,
      freeThrowMatches,
      lastUpdated
    }

    return NextResponse.json(statistics)
  } catch (error) {
    console.error('Error fetching basketball statistics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
} 