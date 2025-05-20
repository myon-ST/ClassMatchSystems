import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">ページが見つかりません</h2>
        <p className="text-gray-600 mb-8">
          申し訳ありませんが、お探しのページは存在しないか、移動された可能性があります。
        </p>
        <Link 
          href="/" 
          className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
        >
          ホームに戻る
        </Link>
      </div>
    </div>
  )
} 