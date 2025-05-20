'use client'

import Link from 'next/link'

export default function EditPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">競技編集メニュー</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/edit/volleyball" 
          className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-bold mb-2">バレーボール</h2>
          <p className="text-gray-600">バレーボールトーナメントの管理</p>
        </Link>

        <Link href="/edit/tabletennis"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-bold mb-2">卓球</h2>
          <p className="text-gray-600">卓球トーナメントの管理</p>
        </Link>

        <Link href="/edit/basketball"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-bold mb-2">バスケットボール</h2>
          <p className="text-gray-600">バスケットボールトーナメントの管理</p>
        </Link>

        <Link href="/edit/soccer"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-bold mb-2">サッカー</h2>
          <p className="text-gray-600">サッカートーナメントの管理</p>
        </Link>

        <Link href="/edit/softball"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-bold mb-2">ソフトボール</h2>
          <p className="text-gray-600">ソフトボールトーナメントの管理</p>
        </Link>
      </div>
    </div>
  )
} 