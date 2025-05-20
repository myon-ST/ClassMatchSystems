import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold text-primary mb-8">クラスマッチ運営システム</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/results" 
          className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-semibold text-primary mb-2">競技別結果</h2>
          <p className="text-gray-600">各競技の試合結果をご覧いただけます</p>
        </Link>

        <Link href="/schedule" 
          className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-semibold text-primary mb-2">日程</h2>
          <p className="text-gray-600">試合日程と進行状況を確認できます</p>
        </Link>

        <Link href="/ranking" 
          className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-semibold text-primary mb-2">ランキング</h2>
          <p className="text-gray-600">クラス別の総合順位を確認できます</p>
        </Link>
      </div>
    </main>
  )
} 