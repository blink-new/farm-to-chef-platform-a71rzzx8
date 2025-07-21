import { Users, Home, Settings, LogOut, User } from 'lucide-react'
import { Button } from '../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { blink } from '../../blink/client'

interface HeaderProps {
  user: any
  currentPage: string
  onPageChange: (pageOrObject: string | { page: string; userId?: string }) => void
  isAdmin?: boolean
}

export function Header({ user, currentPage, onPageChange, isAdmin = false }: HeaderProps) {
  const navItems = [
    { id: 'feed', label: 'Feed', icon: Home },
    { id: 'directory', label: 'Directory', icon: Users }
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-primary">Farm to Chef</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
                  onClick={() => onPageChange(item.id)}
                  className="relative"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              )
            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <User className="h-4 w-4 mr-2" />
                  {user.email}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => onPageChange({ page: 'profile', userId: user.id })}>
                  <User className="h-4 w-4 mr-2" />
                  Il Mio Profilo
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem onClick={() => onPageChange('admin')}>
                    <Settings className="h-4 w-4 mr-2" />
                    Dashboard Admin
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => blink.auth.logout()}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Esci
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onPageChange(item.id)}
                  className="relative"
                >
                  <Icon className="h-4 w-4" />
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </header>
  )
}