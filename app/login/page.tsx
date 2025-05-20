'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const [selectedClass, setSelectedClass] = useState('')
  const [password, setPassword] = useState('')

  const classes = Array.from({ length: 18 }, (_, i) => {
    const grade = Math.floor(i / 6) + 1
    const classNum = (i % 6) + 1
    return `${grade}-${classNum}`
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // ここでログイン処理を実装
    localStorage.setItem('selectedClass', selectedClass)
    router.push('/')
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-primary mb-8 text-center">クラス選択</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="class" className="block text-sm font-medium text-gray-700">
                クラスを選択
              </label>
              <select
                id="class"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                required
              >
                <option value="">選択してください</option>
                {classes.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                パスワード
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              ログイン
            </button>
          </form>
        </div>
      </div>
    </main>
  )
} 