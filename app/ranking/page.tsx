'use client'

import { useState, useEffect } from 'react'

interface Ranking {
  class: string
  points: number
  rank: number
}

export default function Ranking() {
  const [rankings, setRankings] = useState<Ranking[]>([])

  useEffect(() => {
    // ここでランキングデータを取得する処理を実装
    const mockRankings: Ranking[] = Array.from({ length: 18 }, (_, i) => {
      const grade = Math.floor(i / 6) + 1
      const classNum = (i % 6) + 1
      return {
        class: `${grade}-${classNum}`,
        points: Math.floor(Math.random() * 100),
        rank: i + 1,
      }
    }).sort((a, b) => b.points - a.points)

    setRankings(mockRankings)
  }, [])

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-primary mb-8">総合ランキング</h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  順位
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  クラス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ポイント
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rankings.map((ranking, index) => (
                <tr key={ranking.class} className={index < 3 ? 'bg-yellow-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {ranking.rank}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ranking.class}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ranking.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
} 