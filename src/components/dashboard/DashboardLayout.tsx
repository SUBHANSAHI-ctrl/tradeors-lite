'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Menu, X, TrendingUp, LogOut, PlusCircle, BarChart3, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BRANDING } from '@/lib/branding'
import { useUserProfile } from '@/hooks/useUserProfile'


interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, signOut } = useAuth()
  const router = useRouter()
  const { profile } = useUserProfile()

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
  { name: 'Profile', href: '/dashboard/profile', icon: User }, // ✅ NEW
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

        {/* Sidebar ends right after navigation items - no user section */}
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
          
          <div className="flex items-center space-x-4 ml-auto">
            {/* Plan Badge - Right aligned, minimal */}
            <span className={cn(
              "px-3 py-1 text-xs font-medium rounded-full",
              profile?.plan === 'pro' 
                ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 border border-purple-500/30"
                : "bg-white/10 text-gray-300 border border-white/20"
            )}>
              {profile?.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}
            </span>
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