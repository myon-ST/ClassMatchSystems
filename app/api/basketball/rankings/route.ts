import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const gender = searchParams.get('gender')

    if (!gender || (gender !== 'men' && gender !== 'women')) {
      return NextResponse.json(
        { error: 'Invalid gender parameter' },
        { status: 400 }
      )
    }

    const rankings = await prisma.basketballRanking.findMany({
      where: { gender },
      orderBy: [
        { rank: 'asc' },
        { className: 'asc' }
      ]
    })

    return NextResponse.json(rankings)

  } catch (error) {
    console.error('Error fetching basketball rankings:', error)
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
    const { className, gender, rank, rankText, eliminatedAt } = await request.json()

    if (!className || !gender || (gender !== 'men' && gender !== 'women')) {
      return NextResponse.json(
        { error: 'Invalid parameters' },
        { status: 400 }
      )
    }

    const ranking = await prisma.basketballRanking.upsert({
      where: {
        className_gender: {
          className,
          gender
        }
      },
      update: {
        rank,
        rankText,
        eliminatedAt
      },
      create: {
        className,
        gender,
        rank,
        rankText,
        eliminatedAt
      }
    })

    return NextResponse.json(ranking)

  } catch (error) {
    console.error('Error updating basketball ranking:', error)
    return NextResponse.json(
      { error: 'Failed to update ranking' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 