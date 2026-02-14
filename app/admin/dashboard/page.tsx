'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import type { Site } from '@/lib/types/database'
import Link from 'next/link'

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [sites, setSites] = useState<Site[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    try {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !authUser) {
        router.push('/login')
        return
      }

      setUser(authUser)

      const { data: adminData, error: adminError } = await supabase
        .from('site_admins')
        .select('site_id, role')
        .eq('admin_id', authUser.id)

      if (adminError) throw adminError

      if (!adminData || adminData.length === 0) {
        setIsAdmin(false)
        setError('You do not have admin access. Please contact your administrator.')
        setLoading(false)
        return
      }

      setIsAdmin(true)

      const siteIds = adminData.map((sa) => sa.site_id)
      const { data: sitesData, error: sitesError } = await supabase
        .from('sites')
        .select('*')
        .in('id', siteIds)
        .order('created_at', { ascending: false })

      if (sitesError) throw sitesError

      setSites(sitesData || [])
    } catch (err: any) {
      console.error('Error checking admin access:', err)
      setError(err.message || 'Failed to load admin dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-purple-700 font-medium">Loading dashboard...</p>
        </div>
      </main>
    )
  }

  if (error || !isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 p-4">
        <div className="max-w-md w-full bg-white p-8 shadow-xl border border-purple-100">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">{error}</p>
          </div>

          <div className="space-y-3">
            <Link
              href="/admin/setup"
              className="block w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-center font-semibold hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg shadow-purple-500/30"
            >
              Set Up Admin Account
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full py-3 px-4 bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Purple Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-purple-700 to-purple-900 text-white flex flex-col">
        {/* Logo/Brand */}
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-wide">SIGHT-SIGN</h1>
          <p className="text-purple-300 text-sm mt-1">Admin Portal</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4">
          <Link
            href="/admin/dashboard"
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 px-4 py-3 mb-2 transition-all ${
              activeTab === 'dashboard'
                ? 'bg-white text-purple-700 shadow-lg'
                : 'text-purple-100 hover:bg-purple-800'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="font-medium">Dashboard</span>
          </Link>

          <Link
            href="/admin/sites/new"
            onClick={() => setActiveTab('sites')}
            className={`flex items-center gap-3 px-4 py-3 mb-2 transition-all ${
              activeTab === 'sites'
                ? 'bg-white text-purple-700 shadow-lg'
                : 'text-purple-100 hover:bg-purple-800'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="font-medium">My Sites</span>
            <span className="ml-auto bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
              {sites.length}
            </span>
          </Link>

          <Link
            href="/admin/scan"
            onClick={() => setActiveTab('scan')}
            className={`flex items-center gap-3 px-4 py-3 mb-2 transition-all ${
              activeTab === 'scan'
                ? 'bg-white text-purple-700 shadow-lg'
                : 'text-purple-100 hover:bg-purple-800'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            <span className="font-medium">Scan QR</span>
          </Link>

          <div className="border-t border-purple-600 my-4"></div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 text-purple-100 hover:bg-purple-800 transition-all w-full"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium">Sign Out</span>
          </button>
        </nav>

        {/* Decorative Element */}
        <div className="p-6 opacity-30">
          <svg viewBox="0 0 200 200" className="w-full">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'rgb(167,139,250)',stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'rgb(139,92,246)',stopOpacity:1}} />
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="80" fill="url(#grad1)" />
            <path d="M60,100 Q100,60 140,100 T100,140" fill="none" stroke="white" strokeWidth="4"/>
          </svg>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
              <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <svg
                  className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Sites Card */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-6 text-white shadow-lg shadow-purple-500/30">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <p className="text-purple-100 text-sm font-medium mb-1">Total Sites</p>
              <p className="text-4xl font-bold">{sites.length}</p>
            </div>

            {/* Workers On-Site Card */}
            <div className="bg-white p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">Workers On-Site</p>
              <p className="text-4xl font-bold text-gray-900">0</p>
              <p className="text-xs text-gray-400 mt-2">Live in Week 2</p>
            </div>

            {/* Today's Sign-Ins Card */}
            <div className="bg-white p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">Today's Sign-Ins</p>
              <p className="text-4xl font-bold text-gray-900">0</p>
              <p className="text-xs text-gray-400 mt-2">Live in Week 2</p>
            </div>
          </div>

          {/* Sites List */}
          <div className="bg-white shadow-md border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">My Sites</h3>
              <Link
                href="/admin/sites/new"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg shadow-purple-500/30 text-sm font-semibold flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Site
              </Link>
            </div>

            <div className="p-6">
              {sites.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No sites yet</h3>
                  <p className="text-gray-500 mb-6">Create your first construction site to start managing workers</p>
                  <Link
                    href="/admin/sites/new"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg shadow-purple-500/30 font-semibold"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create First Site
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {sites.map((site, index) => (
                    <div
                      key={site.id}
                      className="bg-gradient-to-r from-purple-50 to-purple-100/50 p-5 border border-purple-200 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-gray-900">{site.name}</h4>
                              {site.address && (
                                <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  {site.address}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4 mt-3 text-sm">
                            <span className="px-3 py-1 bg-white rounded-full text-purple-700 font-medium border border-purple-200">
                              Auto sign-out: {site.auto_signout_time}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/scan?site=${site.id}`}
                            className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 transition-colors text-sm font-semibold shadow-lg shadow-purple-500/30"
                          >
                            Scan QR
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
