'use client'

import Link from 'next/link'

export default function BasketballEdit() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-pink-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-6">
              🏀 バスケットボール
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              男子・女子のトーナメントを選択してください
            </p>
          </div>
        </div>
      </div>

      {/* Selection Cards */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 男子バスケットボール */}
          <Link
            href="/edit/basketball/men"
            className="group relative transform transition-all duration-300 hover:scale-105"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-orange-500 to-red-600 p-1">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 h-full">
                {/* Icon */}
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 text-5xl transform group-hover:scale-110 transition-transform duration-300">
                  🏀
                </div>
                
                {/* Content */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-red-600 group-hover:bg-clip-text transition-all duration-300">
                    男子バスケットボール
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    シングルエリミネーション式トーナメント<br/>
                    前半・後半制、同点時はフリースロー
                  </p>
                  
                  {/* Button */}
                  <div className="inline-flex items-center justify-center px-6 py-3 rounded-full text-white font-medium bg-gradient-to-r from-orange-500 to-red-600 shadow-lg transform group-hover:shadow-xl transition-all duration-300">
                    編集開始
                    <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-orange-200/30 to-transparent rounded-full transform group-hover:scale-110 transition-transform duration-300"></div>
                <div className="absolute bottom-4 left-4 w-10 h-10 bg-gradient-to-br from-red-200/20 to-transparent rounded-full transform group-hover:scale-90 transition-transform duration-300"></div>
              </div>
            </div>
          </Link>

          {/* 女子バスケットボール */}
          <Link
            href="/edit/basketball/women"
            className="group relative transform transition-all duration-300 hover:scale-105"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-pink-500 to-purple-600 p-1">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 h-full">
                {/* Icon */}
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 text-5xl transform group-hover:scale-110 transition-transform duration-300">
                  🏀
                </div>
                
                {/* Content */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                    女子バスケットボール
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    シングルエリミネーション式トーナメント<br/>
                    前半・後半制、同点時はフリースロー
                  </p>
                  
                  {/* Button */}
                  <div className="inline-flex items-center justify-center px-6 py-3 rounded-full text-white font-medium bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg transform group-hover:shadow-xl transition-all duration-300">
                    編集開始
                    <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-pink-200/30 to-transparent rounded-full transform group-hover:scale-110 transition-transform duration-300"></div>
                <div className="absolute bottom-4 left-4 w-10 h-10 bg-gradient-to-br from-purple-200/20 to-transparent rounded-full transform group-hover:scale-90 transition-transform duration-300"></div>
              </div>
            </div>
          </Link>
        </div>

        {/* 機能説明 */}
        <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">🏆 バスケットボール機能</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="text-3xl mb-3">⏰</div>
              <h3 className="font-bold text-gray-900 mb-2">試合スケジュール</h3>
              <p className="text-sm text-gray-600">予定日時の設定と試合開始・終了時刻の記録</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-bold text-gray-900 mb-2">スコア管理</h3>
              <p className="text-sm text-gray-600">前半・後半のスコア入力とフリースロー対応</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-3">🏅</div>
              <h3 className="font-bold text-gray-900 mb-2">自動進出</h3>
              <p className="text-sm text-gray-600">勝者の自動決定と次回戦への進出処理</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-3">💾</div>
              <h3 className="font-bold text-gray-900 mb-2">データ保存</h3>
              <p className="text-sm text-gray-600">リアルタイムでのデータベース保存</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-3">✏️</div>
              <h3 className="font-bold text-gray-900 mb-2">再編集機能</h3>
              <p className="text-sm text-gray-600">試合終了後の結果修正が可能</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-bold text-gray-900 mb-2">同点処理</h3>
              <p className="text-sm text-gray-600">フリースローによる勝敗決定</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 