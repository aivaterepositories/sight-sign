'use client'

import Link from 'next/link'

export default function ScanPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md border border-gray-200 text-center">
        <div className="text-6xl mb-4">📱</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">QR Scanner</h1>
        <p className="text-gray-600 mb-6">
          This feature will be implemented in Week 2
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm font-semibold text-blue-900 mb-2">Coming Soon:</p>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• WebRTC camera access</li>
            <li>• QR code scanning with html5-qrcode</li>
            <li>• Worker validation and sign-in</li>
            <li>• Real-time dashboard updates</li>
          </ul>
        </div>

        <Link
          href="/admin/dashboard"
          className="block w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </main>
  )
}
