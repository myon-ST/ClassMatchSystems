import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface TeamRecord {
  [key: string]: any
}

async function main() {
  // トーナメントの作成
  const tournament = await prisma.tournament.create({
    data: {
      name: 'バレーボールトーナメント',
      sport: 'volleyball',
      currentPhase: 'preliminary',
    },
  })

  // グループの作成
  const groupA = await prisma.group.create({
    data: {
      name: 'A',
      tournamentId: tournament.id,
    },
  })

  const groupB = await prisma.group.create({
    data: {
      name: 'B',
      tournamentId: tournament.id,
    },
  })

  const groupC = await prisma.group.create({
    data: {
      name: 'C',
      tournamentId: tournament.id,
    },
  })

  const groupFinal = await prisma.group.create({
    data: {
      name: 'Final',
      tournamentId: tournament.id,
    },
  })

  // 各グループにチームを追加
  const teamsData = [
    // Aグループのチーム（1年生）
    { name: '1-1', groupId: groupA.id },
    { name: '1-2', groupId: groupA.id },
    { name: '1-3', groupId: groupA.id },
    // Bグループのチーム（2年生）
    { name: '2-1', groupId: groupB.id },
    { name: '2-2', groupId: groupB.id },
    { name: '2-3', groupId: groupB.id },
    // Cグループのチーム（3年生）
    { name: '3-1', groupId: groupC.id },
    { name: '3-2', groupId: groupC.id },
    { name: '3-3', groupId: groupC.id },
  ]

  // チームを作成し、IDを保存
  const teams: TeamRecord = {}
  for (const teamData of teamsData) {
    const team = await prisma.team.create({
      data: teamData,
    })
    teams[team.name] = team
  }

  // 各グループのチームを取得
  const groupATeams = await prisma.team.findMany({
    where: { groupId: groupA.id },
  })
  const groupBTeams = await prisma.team.findMany({
    where: { groupId: groupB.id },
  })
  const groupCTeams = await prisma.team.findMany({
    where: { groupId: groupC.id },
  })

  // 予選リーグの試合を作成
  const createMatchesForGroup = async (group: any, groupTeams: any[]) => {
    const matches = []
    for (let i = 0; i < groupTeams.length; i++) {
      for (let j = i + 1; j < groupTeams.length; j++) {
        matches.push({
          matchNumber: matches.length + 1,
          matchCode: `${group.name}${matches.length + 1}`,
          team1Id: groupTeams[i].id,
          team2Id: groupTeams[j].id,
          groupId: group.id,
        })
      }
    }
    return matches
  }

  const groupAMatches = await createMatchesForGroup(groupA, groupATeams)
  const groupBMatches = await createMatchesForGroup(groupB, groupBTeams)
  const groupCMatches = await createMatchesForGroup(groupC, groupCTeams)

  // 試合データをデータベースに保存
  for (const match of [...groupAMatches, ...groupBMatches, ...groupCMatches]) {
    await prisma.match.create({
      data: match,
    })
  }

  console.log('初期データの設定が完了しました')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 