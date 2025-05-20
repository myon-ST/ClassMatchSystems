import { NextResponse } from 'next/server'
import * as db from '@/app/utils/db'

// トーナメントの作成
export async function POST(request: Request) {
  try {
    const { name, sport } = await request.json()
    const tournament = await db.createTournament(name, sport)
    
    // 予選グループを作成
    const groupA = await db.createGroup(tournament.id, 'A')
    const groupB = await db.createGroup(tournament.id, 'B')
    const groupC = await db.createGroup(tournament.id, 'C')

    // 更新されたトーナメントデータを取得
    const updatedTournament = await db.getTournament(tournament.id)
    return NextResponse.json(updatedTournament)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create tournament' }, { status: 500 })
  }
}

// トーナメントの取得
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Tournament ID is required' }, { status: 400 })
    }

    const tournament = await db.getTournament(id)
    if (!tournament) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 })
    }

    return NextResponse.json(tournament)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tournament' }, { status: 500 })
  }
} 