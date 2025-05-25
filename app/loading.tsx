export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
        <h2 className="text-2xl font-semibold text-gray-800 mt-4">
          読み込み中...
        </h2>
      </div>
    </div>
  )
}