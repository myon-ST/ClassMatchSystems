import { NextResponse } from 'next/server'
import * as db from '@/app/utils/db'

export async function GET() {
  try {
    // バレーボールのトーナメントを検索
    const tournament = await db.prisma.tournament.findFirst({
      where: {
        sport: 'volleyball'
      },
      include: {
        groups: {
          include: {
            teams: true,
            matches: {
              include: {
                team1: true,
                team2: true
              }
            }
          }
        }
      }
    })

    if (!tournament) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 })
    }

    return NextResponse.json(tournament)
  } catch (error) {
    console.error('Error fetching volleyball tournament:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tournament' },
      { status: 500 }
    )
  }
} 