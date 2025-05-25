import './globals.css'
import Header from './components/Header'
import { Suspense } from 'react'
import Loading from './loading'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ClassMatch Systems',
  description: '学校の体育祭やクラスマッチの試合管理システム',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-full">
        <div className="min-h-screen bg-gray-50">
          <Suspense fallback={<Loading />}>
            <Header />
            <main className="pt-16">
              {children}
            </main>
          </Suspense>
        </div>
      </body>
    </html>
  )
}