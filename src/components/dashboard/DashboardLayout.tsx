'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Menu, X, TrendingUp, LogOut, PlusCircle, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BRANDING } from '@/lib/branding'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/auth')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: BarChart3 },
    { name: 'Trades', href: '/dashboard/trades', icon: TrendingUp },
    { name: 'Add Trade', href: '/dashboard/trades/add', icon: PlusCircle },
  ]

  return (
    <div className="min-h-screen gradient-bg text-white overflow-hidden">
      {/* Animated background particles - Made truly absolute to avoid layout space */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-md" 
            onClick={() => setSidebarOpen(false)} 
          />
        </div>
      )}

      {/* Sidebar - Glass morphism effect - Fixed positioning */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 transform glass transition-transform duration-300 ease-in-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-20 items-center justify-between px-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img 
                  src={BRANDING.logo.main} 
                  alt={`${BRANDING.companyName} ${BRANDING.appName} Logo`}
                  className="h-8 w-8 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling!.classList.remove('hidden');
                  }}
                />
                <div className="relative hidden">
                  <TrendingUp className="h-8 w-8 text-blue-400 text-glow" />
                  <div className="absolute -inset-1 bg-blue-400/20 rounded-full blur-md animate-pulse" />
                </div>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {BRANDING.appName}
                </span>
                <div className="text-xs text-gray-400 font-mono">PRO TERMINAL</div>
              </div>
            </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="mt-8 px-4 flex-1 overflow-y-auto">
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = typeof window !== 'undefined' && window.location.pathname === item.href
              
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                    "hover:bg-white/10 hover:scale-105",
                    isActive 
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/20 text-white shadow-lg shadow-blue-500/10"
                      : "text-gray-300 hover:text-white"
                  )}
                >
                  <div className={cn(
                    "relative mr-4",
                    isActive && "text-glow"
                  )}>
                    <Icon className={cn(
                      "h-5 w-5 transition-all duration-200",
                      isActive ? "text-blue-400" : "text-gray-400 group-hover:text-white"
                    )} />
                    {isActive && <div className="absolute -inset-1 bg-blue-400/20 rounded-full blur-md animate-pulse" />}
                  </div>
                  <span className="relative">
                    {item.name}
                    {isActive && <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" />}
                  </span>
                </a>
              )
            })}
          </div>
        </nav>

        {/* User section - Improved spacing */}
        <div className="border-t border-white/10 p-6">
          <div className="space-y-4">
            <div className="glass rounded-xl p-4">
            <div className="text-xs text-gray-400 mb-2">Connected</div>
              <div className="text-sm font-mono text-green-400 truncate">
                {user?.email?.split('@')[0]}
              </div>
              <div className="text-xs text-gray-500 mt-1">{user?.email?.split('@')[1]}</div>
              <div className="text-xs text-gray-500 mt-1">
                Support: <a href={`mailto:${BRANDING.supportEmail}`} className="text-blue-400 hover:text-blue-300">{BRANDING.supportEmail}</a>
              </div>
            </div>
            
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-red-500/10 rounded-xl transition-all duration-200 border border-red-500/20 hover:border-red-500/40"
            >
              <LogOut className="h-4 w-4" />
              <span>Disconnect</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content - Fixed layout with margin offset and proper height */}
      <div className="lg:ml-72 relative z-10 flex min-h-screen flex-col">
        {/* Top bar - Glass morphism */}
        <div className="flex-shrink-0 z-40 flex h-20 items-center justify-between glass border-b border-white/10 px-6 backdrop-blur-xl">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex items-center space-x-6">
            <div className="hidden lg:flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-gray-400">{BRANDING.companyName} Terminal</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-xs text-gray-400">{BRANDING.companyName} Account</div>
                <div className="text-sm font-mono text-green-400">
                  {user?.email?.split('@')[0]}
                </div>
                <div className="text-xs text-gray-500">
                  <a href={`mailto:${BRANDING.supportEmail}`} className="text-blue-400 hover:text-blue-300">
                    {BRANDING.supportEmail}
                  </a>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-red-500/10 rounded-xl transition-all duration-200 border border-red-500/20 hover:border-red-500/40 hover:scale-105"
              >
                <LogOut className="h-4 w-4" />
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        </div>

        {/* Page content - Fixed flex layout to prevent gaps */}
        <main className="flex-1 pt-6 px-8 pb-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}