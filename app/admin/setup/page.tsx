'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'

export default function AdminSetupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [createdSiteId, setCreatedSiteId] = useState<string | null>(null)

  const createTestSiteAndAdmin = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)

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

      // Check if user is already an admin
      const { data: existingAdmin } = await supabase
        .from('site_admins')
        .select('site_id')
        .eq('admin_id', user.id)
        .limit(1)

      if (existingAdmin && existingAdmin.length > 0) {
        setError('You are already an admin. Redirecting to dashboard...')
        setTimeout(() => router.push('/admin/dashboard'), 2000)
        return
      }

      // Create a test site
      const { data: siteData, error: siteError } = await supabase
        .from('sites')
        .insert({
          name: 'Test Construction Site',
          address: '123 Test Street, Construction City',
          auto_signout_time: '18:00:00',
        })
        .select()
        .single()

      if (siteError) throw siteError
      if (!siteData) throw new Error('Failed to create site')

      setCreatedSiteId(siteData.id)

      // Add current user as admin
      const { error: adminError } = await supabase
        .from('site_admins')
        .insert({
          site_id: siteData.id,
          admin_id: user.id,
          role: 'admin',
        })

      if (adminError) throw adminError

      setSuccess(true)

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/admin/dashboard')
      }, 3000)
    } catch (err: any) {
      console.error('Setup error:', err)
      setError(err.message || 'Setup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-purple-500/30">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Setup Helper
          </h1>
          <p className="text-purple-600 font-medium">
            Create a test site and grant yourself admin access
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white p-8 shadow-xl border border-purple-100">
          {!success && !loading && (
            <div className="space-y-6">
              {/* Info */}
              <div className="bg-purple-50 border border-purple-200 p-4">
                <div className="flex gap-3">
                  <svg
                    className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5"
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
                  <div className="text-sm text-purple-800">
                    <p className="font-semibold mb-2">Development Tool</p>
                    <p className="text-purple-700">
                      This is a helper tool for MVP development. In production, admins
                      would be invited by super admins or created through a proper
                      onboarding flow.
                    </p>
                  </div>
                </div>
              </div>

              {/* What Will Happen */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  What this will do:
                </h2>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex gap-2">
                    <svg
                      className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
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
                    <span>
                      Create a test construction site called "Test Construction Site"
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <svg
                      className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
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
                    <span>Grant you admin access to this site</span>
                  </li>
                  <li className="flex gap-2">
                    <svg
                      className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
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
                    <span>Redirect you to the admin dashboard</span>
                  </li>
                </ul>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={createTestSiteAndAdmin}
                  disabled={loading}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold hover:from-purple-700 hover:to-purple-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/30"
                >
                  Set Up Admin Access
                </button>
                <Link
                  href="/admin/dashboard"
                  className="px-6 py-3 bg-purple-50 text-purple-700 font-semibold hover:bg-purple-100 transition-all border border-purple-200"
                >
                  Cancel
                </Link>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Creating site and setting up admin access...</p>
            </div>
          )}

          {/* Success State */}
          {success && (
            <div className="text-center py-8">
              <svg
                className="w-16 h-16 text-green-600 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Admin Access Granted!
              </h3>
              <p className="text-gray-600 mb-4">
                You now have admin access to "Test Construction Site"
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to admin dashboard...
              </p>
            </div>
          )}
        </div>

        {/* Manual Option */}
        {!success && (
          <div className="mt-6 bg-white p-6 shadow-md border border-purple-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Prefer Manual Setup?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              You can also create a site and become an admin manually:
            </p>
            <ol className="text-sm text-gray-600 space-y-2 ml-4 list-decimal">
              <li>
                Go to{' '}
                <Link
                  href="/admin/sites/new"
                  className="text-purple-600 hover:underline font-semibold"
                >
                  Create New Site
                </Link>
              </li>
              <li>Fill in the site details</li>
              <li>You'll automatically be added as the site admin</li>
            </ol>
          </div>
        )}

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-purple-600 hover:text-purple-700 hover:underline font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
