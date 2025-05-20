import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-primary shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link href="/" className="flex items-center text-white hover:text-gray-200">
              クラスマッチ
            </Link>
            <Link href="/results" className="flex items-center text-white hover:text-gray-200">
              競技別結果
            </Link>
            <Link href="/schedule" className="flex items-center text-white hover:text-gray-200">
              日程
            </Link>
            <Link href="/ranking" className="flex items-center text-white hover:text-gray-200">
              ランキング
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link href="/login" className="flex items-center text-white hover:text-gray-200">
              ログイン
            </Link>
            <Link href="/edit" className="flex items-center text-white hover:text-gray-200">
              編集
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
} 