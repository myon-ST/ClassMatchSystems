import Link from 'next/link'

export default function Home() {
  const cards = [
    {
      href: '/results',
      title: '競技別結果',
      description: '各競技の試合結果をリアルタイムで確認できます。詳細な統計やハイライトもご覧いただけます。',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'from-blue-500 to-purple-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      href: '/schedule',
      title: '試合日程',
      description: '試合のスケジュールと進行状況をリアルタイムで確認。会場や時間の詳細も一目で分かります。',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'from-green-500 to-teal-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      href: '/ranking',
      title: '総合順位',
      description: 'クラス別の総合順位をリアルタイムで更新。獲得ポイントや順位の変動が一目で分かります。',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      href: '/edit',
      title: '編集・管理',
      description: '競技の追加、編集、管理機能。ソフトボールなどの詳細な試合データを管理できます。',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ]

  const features = [
    {
      title: 'リアルタイム更新',
      description: '試合結果が即座に反映され、最新の情報を確認できます',
      icon: '⚡'
    },
    {
      title: '簡単操作',
      description: '直感的なインターフェースで誰でも簡単に操作できます',
      icon: '👆'
    },
    {
      title: 'データ保存',
      description: '全ての試合データが自動で保存され、履歴も確認可能です',
      icon: '💾'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* ヒーローセクション */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200">
                <span className="text-2xl">🏆</span>
                <span className="text-sm font-medium text-blue-700">体育祭・クラスマッチ管理システム</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              <span className="block">ClassMatch</span>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                運営システム
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              体育祭やクラスマッチの運営をスムーズに。<br />
              試合の記録から結果の集計まで、すべてをシンプルに管理できます。
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/edit" 
                className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span>🎯</span>
                <span className="ml-2">管理を開始</span>
              </Link>
              <Link 
                href="/results" 
                className="inline-flex items-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white rounded-full border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <span>📊</span>
                <span className="ml-2">結果を確認</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 機能カードセクション */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            主な機能
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            競技管理に必要な全ての機能を一つのシステムで
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, index) => (
            <Link
              key={card.href}
              href={card.href}
              className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500" 
                   style={{backgroundImage: `linear-gradient(to bottom right, ${card.color.split(' ')[1]}, ${card.color.split(' ')[3]})`}}>
              </div>
              
              <div className="relative p-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 ${card.bgColor} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={card.textColor}>
                    {card.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {card.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {card.description}
                </p>

                <div className="mt-6 flex items-center text-blue-600 font-medium group-hover:translate-x-2 transition-transform duration-300">
                  <span>詳しく見る</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 特徴セクション */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              なぜClassMatchを選ぶのか
            </h2>
            <p className="text-lg text-gray-600">
              運営を効率化する3つの特徴
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-6 group-hover:shadow-xl transition-shadow duration-300 text-3xl">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTAセクション */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              今すぐ始めましょう
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              簡単セットアップで、すぐに競技管理を開始できます
            </p>
            <Link 
              href="/edit" 
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-full hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span className="mr-2">🚀</span>
              管理画面へ
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 

