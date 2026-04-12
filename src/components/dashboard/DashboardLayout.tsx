'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Menu, X, TrendingUp, PlusCircle, BarChart3, User } from 'lucide-react'
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
    { name: 'Overview',  href: '/dashboard',             icon: BarChart3   },
    { name: 'Trades',    href: '/dashboard/trades',       icon: TrendingUp  },
    { name: 'Add Trade', href: '/dashboard/trades/add',   icon: PlusCircle  },
    { name: 'Profile',   href: '/dashboard/profile',      icon: User        },
  ]

  return (
    <div className="min-h-screen bg-[#08090F] text-[#DDE4F0] overflow-hidden">

      {/* Subtle ambient orbs — fixed so they don't affect layout */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-16 left-16 w-64 h-64 bg-[#4361EE]/6 rounded-full blur-3xl" />
        <div className="absolute bottom-16 right-16 w-80 h-80 bg-[#2DD4BF]/4 rounded-full blur-3xl" />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* ── Sidebar ──────────────────────────────────────── */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-[#0F1220] border-r border-[#1A2540] transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>

        {/* Logo row */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-[#1A2540]">
          <div className="flex items-center gap-2.5">
            <img
              src={BRANDING.logo.main}
              alt={`${BRANDING.companyName} ${BRANDING.appName} Logo`}
              className="h-7 w-7 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                (e.currentTarget.nextElementSibling as HTMLElement)?.classList.remove('hidden');
              }}
            />
            <div className="hidden">
              <TrendingUp className="h-7 w-7 text-[#4361EE]" />
            </div>
            <span className="text-base font-bold bg-linear-to-r from-[#4361EE] to-[#2DD4BF] bg-clip-text text-transparent">
              {BRANDING.appName}
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-[#7B8BB0] hover:text-[#DDE4F0] hover:bg-[#4361EE]/10 transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = typeof window !== 'undefined' && window.location.pathname === item.href

              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-[#4361EE]/10 text-[#4361EE] border border-[#4361EE]/20"
                      : "text-[#7B8BB0] hover:text-[#DDE4F0] hover:bg-[#4361EE]/6"
                  )}
                >
                  <Icon className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive ? "text-[#4361EE]" : "text-[#4A5880] group-hover:text-[#7B8BB0]"
                  )} />
                  {item.name}
                </a>
              )
            })}
          </div>
        </nav>
      </div>

      {/* ── Main content ─────────────────────────────────── */}
      <div className="lg:ml-72 relative z-10 flex min-h-screen flex-col">

        {/* Top bar */}
        <div className="shrink-0 z-40 flex h-16 items-center justify-between bg-[#08090F]/90 backdrop-blur-md border-b border-[#1A2540] px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-[#7B8BB0] hover:text-[#DDE4F0] hover:bg-[#4361EE]/10 transition-all"
          >
            <Menu className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-3 ml-auto">
            {/* Plan badge */}
            <span className={cn(
              "px-2.5 py-1 text-xs font-medium rounded-full border",
              profile?.plan === 'pro'
                ? "bg-[#4361EE]/10 text-[#4361EE] border-[#4361EE]/25"
                : "bg-[#0F1220] text-[#7B8BB0] border-[#1E2844]"
            )}>
              {profile?.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}
            </span>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 pt-6 px-6 lg:px-8 pb-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
