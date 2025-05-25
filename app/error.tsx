'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('エラーが発生しました:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-6xl font-bold text-red-600 mb-4">Error</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          エラーが発生しました
        </h2>
        <p className="text-gray-600 mb-8">
          申し訳ありませんが、予期せぬエラーが発生しました。
        </p>
        <div className="space-x-4">
          <button
            onClick={reset}
            className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
          >
            もう一度試す
          </button>
          <Link
            href="/"
            className="inline-block bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
          >
            ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  )
} 
