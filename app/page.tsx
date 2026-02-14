import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="max-w-2xl text-center space-y-8">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-purple-500/30">
          <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-5xl font-bold text-gray-900">
          Sight-Sign
        </h1>
        <p className="text-xl text-purple-700 font-medium">
          Construction Site Safety Induction System
        </p>
        <p className="text-purple-600">
          QR code-based digital sign-in for construction workers
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            href="/auth/register"
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg shadow-purple-500/30"
          >
            Register as Worker
          </Link>
          <Link
            href="/auth/login"
            className="px-8 py-4 bg-white text-purple-700 font-semibold hover:bg-purple-50 transition-all border-2 border-purple-200"
          >
            Admin Login
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="p-6 bg-white shadow-md border border-purple-100">
            <div className="text-3xl mb-2">📱</div>
            <h3 className="font-bold text-gray-900 mb-2">QR Code Sign-In</h3>
            <p className="text-sm text-gray-700">
              Workers receive unique QR codes for instant site access
            </p>
          </div>

          <div className="p-6 bg-gradient-to-br from-purple-500 to-purple-700 shadow-lg text-white">
            <div className="text-3xl mb-2">✅</div>
            <h3 className="font-bold mb-2">Safety Quiz</h3>
            <p className="text-sm text-purple-50">
              Interactive OSHA-based quiz ensures safety compliance
            </p>
          </div>

          <div className="p-6 bg-white shadow-md border border-purple-100">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-bold text-gray-900 mb-2">Real-Time Dashboard</h3>
            <p className="text-sm text-gray-700">
              Site managers see live updates of who's on-site
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
