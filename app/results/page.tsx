'use client'

import Link from 'next/link'

const sports = [
  { 
    name: '自クラス結果', 
    href: '/results/my-class',
    icon: '🏆',
    description: 'あなたのクラスの成績を確認',
    gradient: 'from-blue-500 to-purple-600'
  },
  { 
    name: 'バスケットボール', 
    href: '/results/basketball',
    icon: '🏀',
    description: 'バスケットボールの試合結果',
    gradient: 'from-orange-500 to-red-600'
  },
  { 
    name: 'ソフトボール', 
    href: '/results/softball',
    icon: '🥎',
    description: 'ソフトボールの試合結果',
    gradient: 'from-green-500 to-teal-600'
  },
  { 
    name: 'サッカー', 
    href: '/results/soccer',
    icon: '⚽',
    description: 'サッカーの試合結果',
    gradient: 'from-emerald-500 to-blue-600'
  },
  { 
    name: '卓球', 
    href: '/results/table-tennis',
    icon: '🏓',
    description: '卓球の試合結果',
    gradient: 'from-yellow-500 to-orange-600'
  },
  { 
    name: 'バレーボール', 
    href: '/results/volleyball',
    icon: '🏐',
    description: 'バレーボールの試合結果',
    gradient: 'from-pink-500 to-red-600'
  },
]

export default function Results() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              競技別結果
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              各競技の詳細な結果を確認できます。お気に入りの競技を選んでください。
            </p>
          </div>
        </div>
      </div>

      {/* Sports Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sports.map((sport, index) => (
            <Link
              key={sport.name}
              href={sport.href}
              className="group relative transform transition-all duration-300 hover:scale-105 opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className={`
                relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300
                bg-gradient-to-br ${sport.gradient} p-1
              `}>
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 h-full">
                  {/* Icon */}
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 text-4xl transform group-hover:scale-110 transition-transform duration-300">
                    {sport.icon}
                  </div>
                  
                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                      {sport.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                      {sport.description}
                    </p>
                    
                    {/* Button */}
                    <div className={`
                      inline-flex items-center justify-center px-6 py-3 rounded-full text-white font-medium
                      bg-gradient-to-r ${sport.gradient} shadow-lg
                      transform group-hover:shadow-xl transition-all duration-300
                      group-hover:from-blue-600 group-hover:to-purple-600
                    `}>
                      結果を見る
                      <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full transform group-hover:scale-110 transition-transform duration-300"></div>
                  <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-white/10 to-transparent rounded-full transform group-hover:scale-90 transition-transform duration-300"></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 