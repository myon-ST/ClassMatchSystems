'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-6xl font-bold text-red-600 mb-4">500</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">サーバーエラー</h2>
        <p className="text-gray-600 mb-8">
          申し訳ありませんが、サーバーで問題が発生しました。<br />
          しばらく時間をおいて再度お試しください。
        </p>
        <button
          onClick={() => reset()}
          className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
        >
          再試行
        </button>
      </div>
    </div>
  )
} 