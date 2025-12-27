'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'

export default function NewSitePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    autoSignoutTime: '18:00:00',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

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

      // Create site
      const { data: siteData, error: siteError } = await supabase
        .from('sites')
        .insert({
          name: formData.name,
          address: formData.address || null,
          auto_signout_time: formData.autoSignoutTime,
        })
        .select()
        .single()

      if (siteError) throw siteError
      if (!siteData) throw new Error('Failed to create site')

      // Add current user as admin for this site
      const { error: adminError } = await supabase
        .from('site_admins')
        .insert({
          site_id: siteData.id,
          admin_id: user.id,
          role: 'admin',
        })

      if (adminError) throw adminError

      // Success - redirect to admin dashboard
      router.push('/admin/dashboard')
    } catch (err: any) {
      console.error('Error creating site:', err)
      setError(err.message || 'Failed to create site. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/dashboard"
            className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-4"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create New Site</h1>
          <p className="text-gray-600 mt-2">
            Add a construction site to start managing worker sign-ins
          </p>
        </div>

        {/* Form */}
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Site Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Site Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Downtown Office Building"
              />
              <p className="text-xs text-gray-500 mt-1">
                A descriptive name for this construction site
              </p>
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Address (Optional)
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="123 Main Street, City, State 12345"
              />
              <p className="text-xs text-gray-500 mt-1">
                Physical location of the construction site
              </p>
            </div>

            {/* Auto Sign-Out Time */}
            <div>
              <label
                htmlFor="autoSignoutTime"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Auto Sign-Out Time *
              </label>
              <input
                type="time"
                id="autoSignoutTime"
                name="autoSignoutTime"
                required
                value={formData.autoSignoutTime}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Workers will be automatically signed out at this time daily (default: 6:00 PM)
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <svg
                  className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">What happens next?</p>
                  <ul className="space-y-1 text-blue-700">
                    <li>• You'll be set as the site admin</li>
                    <li>• Workers can sign in using their QR codes</li>
                    <li>• Dashboard will show real-time worker status</li>
                    <li>• Auto sign-out runs daily at the specified time</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Creating Site...' : 'Create Site'}
              </button>
              <Link
                href="/admin/dashboard"
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Site Management Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex gap-3">
              <svg
                className="w-5 h-5 text-green-600 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div>
                <p className="font-medium text-gray-900">QR Code Scanning</p>
                <p className="text-gray-600">Sign workers in/out instantly</p>
              </div>
            </div>

            <div className="flex gap-3">
              <svg
                className="w-5 h-5 text-green-600 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div>
                <p className="font-medium text-gray-900">Real-Time Dashboard</p>
                <p className="text-gray-600">See who's on-site live</p>
              </div>
            </div>

            <div className="flex gap-3">
              <svg
                className="w-5 h-5 text-green-600 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div>
                <p className="font-medium text-gray-900">Safety Quiz</p>
                <p className="text-gray-600">Automatic OSHA compliance</p>
              </div>
            </div>

            <div className="flex gap-3">
              <svg
                className="w-5 h-5 text-green-600 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div>
                <p className="font-medium text-gray-900">Auto Sign-Out</p>
                <p className="text-gray-600">Daily at your specified time</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
