'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { generateQRCodeImage } from '@/lib/utils/qr-code'
import type { Worker } from '@/lib/types/database'

export default function WorkerDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [worker, setWorker] = useState<Worker | null>(null)
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadWorkerData()
  }, [])

  const loadWorkerData = async () => {
    try {
      // Get current user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        router.push('/login')
        return
      }

      // Load worker profile
      const { data: workerData, error: workerError } = await supabase
        .from('workers')
        .select('*')
        .eq('id', user.id)
        .single()

      if (workerError) throw workerError
      if (!workerData) throw new Error('Worker profile not found')

      setWorker(workerData)

      // Generate QR code image
      const qrImage = await generateQRCodeImage(workerData.qr_code_hash)
      setQrCodeImage(qrImage)
    } catch (err: any) {
      console.error('Error loading worker data:', err)
      setError(err.message || 'Failed to load worker data')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const downloadQRCode = () => {
    if (!qrCodeImage || !worker) return

    const link = document.createElement('a')
    link.href = qrCodeImage
    link.download = `${worker.name.replace(/\s+/g, '-')}-QR-Code.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-purple-700 font-medium">Loading your dashboard...</p>
        </div>
      </main>
    )
  }

  if (error || !worker) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 p-4">
        <div className="max-w-md w-full bg-white p-8 shadow-xl border border-purple-100">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="font-bold text-xl text-gray-900 mb-2">Error</p>
            <p className="text-gray-600">{error}</p>
          </div>
          <button
            onClick={() => router.push('/auth/login')}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg shadow-purple-500/30"
          >
            Go to Login
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-md border border-purple-100 p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Worker Dashboard</h1>
              <p className="text-purple-600 mt-1 font-medium">Welcome back, {worker.name}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-6 py-3 text-purple-700 bg-purple-50 hover:bg-purple-100 transition-all font-semibold border border-purple-200"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* QR Code Section */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-8 shadow-xl text-white">
            <h2 className="text-2xl font-bold mb-2">
              Your QR Code
            </h2>
            <p className="text-purple-100 mb-6">
              Show this to site admins when signing in
            </p>

            {qrCodeImage ? (
              <div className="space-y-4">
                <div className="bg-white p-8 flex justify-center shadow-2xl">
                  <img
                    src={qrCodeImage}
                    alt="Worker QR Code"
                    className="w-64 h-64"
                  />
                </div>

                <button
                  onClick={downloadQRCode}
                  className="w-full py-4 px-4 bg-white text-purple-700 font-bold hover:bg-purple-50 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download QR Code
                </button>

                <p className="text-xs text-purple-100 text-center">
                  💾 Save to your phone for quick access
                </p>
              </div>
            ) : (
              <div className="text-center py-8 text-purple-100">
                Failed to generate QR code
              </div>
            )}
          </div>

          {/* Worker Info Section */}
          <div className="bg-white p-8 shadow-md border border-purple-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Your Information
            </h2>

            <div className="space-y-5">
              <div className="bg-purple-50 p-4 border border-purple-100">
                <label className="text-sm font-semibold text-purple-700">Name</label>
                <p className="text-gray-900 mt-1 font-medium">{worker.name}</p>
              </div>

              <div className="bg-purple-50 p-4 border border-purple-100">
                <label className="text-sm font-semibold text-purple-700">Company</label>
                <p className="text-gray-900 mt-1 font-medium">{worker.company}</p>
              </div>

              {worker.phone && (
                <div className="bg-purple-50 p-4 border border-purple-100">
                  <label className="text-sm font-semibold text-purple-700">Phone</label>
                  <p className="text-gray-900 mt-1 font-medium">{worker.phone}</p>
                </div>
              )}

              <div className="bg-purple-50 p-4 border border-purple-100">
                <label className="text-sm font-semibold text-purple-700">
                  Member Since
                </label>
                <p className="text-gray-900 mt-1 font-medium">
                  {new Date(worker.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-purple-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                📱 How to Use Your QR Code
              </h3>
              <ol className="text-sm text-gray-700 space-y-3">
                <li className="flex gap-3 items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <span className="font-medium">Download and save the QR code to your phone</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <span className="font-medium">Show it to the site admin when you arrive</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  <span className="font-medium">Complete the safety quiz if prompted</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    4
                  </span>
                  <span className="font-medium">You'll be automatically signed out at 6 PM</span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Sign-In History (Phase 2 feature) */}
        <div className="mt-6 bg-white p-8 shadow-md border border-purple-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Recent Sign-Ins
            </h2>
          </div>
          <div className="text-center py-12 bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200">
            <p className="text-gray-700 font-medium">📊 Sign-in history coming soon...</p>
            <p className="text-sm text-gray-600 mt-2">Track your site visits and safety quiz scores</p>
          </div>
        </div>
      </div>
    </main>
  )
}
