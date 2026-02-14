'use client'

import Link from 'next/link'

export default function ScanPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 p-4">
      <div className="max-w-md w-full bg-white p-8 shadow-xl border border-purple-100 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">QR Scanner</h1>
        <p className="text-purple-600 mb-6 font-medium">
          This feature will be implemented in Week 2
        </p>

        <div className="bg-purple-50 border border-purple-200 p-4 mb-6 text-left">
          <p className="text-sm font-semibold text-purple-900 mb-2">Coming Soon:</p>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• WebRTC camera access</li>
            <li>• QR code scanning with html5-qrcode</li>
            <li>• Worker validation and sign-in</li>
            <li>• Real-time dashboard updates</li>
          </ul>
        </div>

        <Link
          href="/admin/dashboard"
          className="block w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg shadow-purple-500/30"
        >
          Back to Dashboard
        </Link>
      </div>
    </main>
  )
}
