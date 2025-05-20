import Link from 'next/link'

const sports = [
  { name: '自クラス結果', href: '/results/my-class' },
  { name: 'バスケットボール', href: '/results/basketball' },
  { name: 'ソフトボール', href: '/results/softball' },
  { name: 'サッカー', href: '/results/soccer' },
  { name: '卓球', href: '/results/table-tennis' },
  { name: 'バレーボール', href: '/results/volleyball' },
]

export default function Results() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-primary mb-8">競技別結果</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sports.map((sport) => (
            <Link
              key={sport.name}
              href={sport.href}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-primary mb-2">{sport.name}</h2>
              <p className="text-gray-600">結果を確認する</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
} 