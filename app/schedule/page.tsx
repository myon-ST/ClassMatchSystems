export default function Schedule() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-primary mb-8">試合日程</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-primary mb-4">1日目</h2>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-medium">午前の部</h3>
              <p className="text-gray-600">9:00 - 12:00 バスケットボール予選</p>
              <p className="text-gray-600">9:00 - 12:00 ソフトボール予選</p>
            </div>
            <div className="border-b pb-4">
              <h3 className="font-medium">午後の部</h3>
              <p className="text-gray-600">13:00 - 16:00 サッカー予選</p>
              <p className="text-gray-600">13:00 - 16:00 卓球予選</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-primary mb-4">2日目</h2>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-medium">午前の部</h3>
              <p className="text-gray-600">9:00 - 12:00 バレーボールリーグ戦</p>
              <p className="text-gray-600">9:00 - 12:00 バスケットボール決勝</p>
            </div>
            <div>
              <h3 className="font-medium">午後の部</h3>
              <p className="text-gray-600">13:00 - 16:00 ソフトボール決勝</p>
              <p className="text-gray-600">13:00 - 16:00 サッカー決勝</p>
              <p className="text-gray-600">13:00 - 16:00 卓球決勝</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <a
            href="/schedule.pdf"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-light"
          >
            詳細日程PDFをダウンロード
          </a>
        </div>
      </div>
    </main>
  )
} 