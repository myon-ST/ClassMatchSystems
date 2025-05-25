'use client'

import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

export default function EditPage() {
  const sportPages = [
    {
      id: 'softball',
      name: 'ソフトボール',
      description: 'トーナメント戦の管理・スコア入力',
      icon: '🥎',
      href: '/edit/softball',
      available: true,
      gradient: 'from-blue-500 to-blue-700'
    },
    {
      id: 'basketball',
      name: 'バスケットボール',
      description: 'リーグ戦・トーナメント戦の管理',
      icon: '🏀',
      href: '/edit/basketball',
      available: true,
      gradient: 'from-orange-500 to-orange-700'
    },
    {
      id: 'tabletennis',
      name: '卓球',
      description: 'トーナメント戦・個人戦の管理',
      icon: '🏓',
      href: '/edit/tabletennis',
      available: true,
      gradient: 'from-green-500 to-green-700'
    },
    {
      id: 'soccer',
      name: 'サッカー',
      description: '準備中',
      icon: '⚽',
      href: '/edit/soccer',
      available: false,
      gradient: 'from-gray-400 to-gray-600'
    },
    {
      id: 'volleyball',
      name: 'バレーボール',
      description: '準備中',
      icon: '🏐',
      href: '/edit/volleyball',
      available: false,
      gradient: 'from-gray-400 to-gray-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* ヘッダー */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-800/20 to-pink-800/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                スポーツ大会
              </span>
              <br />
              <span className="text-white">管理システム</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              各スポーツの試合進行・スコア管理・結果集計を一元管理
            </p>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sportPages.map((sport) => (
            <div key={sport.id} className="group">
              {sport.available ? (
                <Link href={sport.href}>
                  <div className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${sport.gradient} p-1 shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-purple-500/25`}>
                    <div className="relative rounded-lg bg-white/10 backdrop-blur-sm p-8 h-full">
                      {/* アイコン */}
                      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 text-4xl bg-white/20 rounded-full">
                        {sport.icon}
                      </div>
                      
                      {/* コンテンツ */}
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-white mb-3">
                          {sport.name}
                        </h3>
                        <p className="text-gray-200 mb-6">
                          {sport.description}
                        </p>
                        
                        {/* アクションボタン */}
                        <div className="flex items-center justify-center text-white font-medium group-hover:text-yellow-300 transition-colors">
                          編集画面へ
                          <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                      
                      {/* ホバーエフェクト */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${sport.gradient} p-1 shadow-xl opacity-60 cursor-not-allowed`}>
                  <div className="relative rounded-lg bg-white/10 backdrop-blur-sm p-8 h-full">
                    {/* アイコン */}
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 text-4xl bg-white/20 rounded-full">
                      {sport.icon}
                    </div>
                    
                    {/* コンテンツ */}
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-white mb-3">
                        {sport.name}
                      </h3>
                      <p className="text-gray-300 mb-6">
                        {sport.description}
                      </p>
                      
                      {/* 準備中表示 */}
                      <div className="flex items-center justify-center text-gray-400 font-medium">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-500/30">
                          準備中
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 統計情報 */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">システム情報</h2>
            <p className="text-gray-400">現在利用可能な機能</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">利用可能競技</h3>
              <p className="text-gray-400">ソフトボール・バスケ・卓球</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">∞</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">同時管理数</h3>
              <p className="text-gray-400">無制限の試合管理</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">リアルタイム更新</h3>
              <p className="text-gray-400">即座にスコア反映</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 