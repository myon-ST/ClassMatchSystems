import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export { prisma }

// トーナメントの作成
export async function createTournament(name: string, sport: string) {
  return await prisma.tournament.create({
    data: {
      name,
      sport,
      currentPhase: 'preliminary'
    }
  })
}

// トーナメントの取得
export async function getTournament(id: string) {
  return await prisma.tournament.findUnique({
    where: { id },
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
}

// グループの作成
export async function createGroup(tournamentId: string, name: string) {
  return await prisma.group.create({
    data: {
      name,
      tournament: {
        connect: { id: tournamentId }
      }
    }
  })
}

// チームの作成
export async function createTeam(groupId: string, name: string) {
  return await prisma.team.create({
    data: {
      name,
      group: {
        connect: { id: groupId }
      }
    }
  })
}

// 試合の作成
export async function createMatch(
  groupId: string,
  matchNumber: number,
  matchCode: string,
  team1Id: string,
  team2Id: string
) {
  return await prisma.match.create({
    data: {
      matchNumber,
      matchCode,
      team1: {
        connect: { id: team1Id }
      },
      team2: {
        connect: { id: team2Id }
      },
      group: {
        connect: { id: groupId }
      }
    }
  })
}

// 試合結果の更新
export async function updateMatchScore(
  matchId: string,
  team1Score: number,
  team2Score: number,
  winner: string | null
) {
  const match = await prisma.match.update({
    where: { id: matchId },
    data: {
      team1Score,
      team2Score,
      winner,
      status: winner ? 'finished' : 'in_progress'
    },
    include: {
      team1: true,
      team2: true,
      group: true
    }
  })

  // チームの成績を更新
  if (winner) {
    const winningTeam = winner === match.team1.id ? match.team1 : match.team2
    const losingTeam = winner === match.team1.id ? match.team2 : match.team1

    await prisma.team.update({
      where: { id: winningTeam.id },
      data: {
        wins: { increment: 1 },
        points: { increment: 2 },
        scoreFor: { increment: winner === match.team1.id ? team1Score : team2Score },
        scoreAgainst: { increment: winner === match.team1.id ? team2Score : team1Score }
      }
    })

    await prisma.team.update({
      where: { id: losingTeam.id },
      data: {
        losses: { increment: 1 },
        points: { increment: 1 },
        scoreFor: { increment: winner === match.team1.id ? team2Score : team1Score },
        scoreAgainst: { increment: winner === match.team1.id ? team1Score : team2Score }
      }
    })
  }

  // 編集履歴を記録
  await prisma.editHistory.create({
    data: {
      matchId,
      team1Score,
      team2Score
    }
  })

  return match
}

// 試合状態の更新
export async function updateMatchStatus(
  matchId: string,
  status: 'waiting' | 'in_progress' | 'finished'
) {
  return await prisma.match.update({
    where: { id: matchId },
    data: {
      status,
      startTime: status === 'in_progress' ? new Date() : undefined,
      endTime: status === 'finished' ? new Date() : undefined
    }
  })
}

// グループ優勝者の設定
export async function setGroupWinner(groupId: string, winnerId: string) {
  return await prisma.group.update({
    where: { id: groupId },
    data: {
      winner: winnerId
    }
  })
}

// トーナメントフェーズの更新
export async function updateTournamentPhase(
  tournamentId: string,
  phase: 'preliminary' | 'final'
) {
  return await prisma.tournament.update({
    where: { id: tournamentId },
    data: {
      currentPhase: phase
    }
  })
} 