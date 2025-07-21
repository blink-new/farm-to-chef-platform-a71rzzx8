import { useState } from 'react'
import { Header } from './Header'
import { HomeFeed } from '../pages/HomeFeed'
import { UserDirectory } from '../pages/UserDirectory'
import { UserProfile } from '../pages/UserProfile'
import { AdminDashboard } from '../pages/AdminDashboard'

type Page = 'feed' | 'directory' | 'profile' | 'admin'

interface MainLayoutProps {
  user: any
  isAdmin?: boolean
}

export function MainLayout({ user, isAdmin = false }: MainLayoutProps) {
  const [currentPage, setCurrentPage] = useState<Page>('feed')
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  const handlePageChange = (pageOrObject: Page | { page: Page; userId?: string }) => {
    if (typeof pageOrObject === 'string') {
      setCurrentPage(pageOrObject)
    } else {
      setCurrentPage(pageOrObject.page)
      if (pageOrObject.userId) {
        setSelectedUserId(pageOrObject.userId)
      }
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'feed':
        return <HomeFeed user={user} onUserClick={(userId) => {
          setSelectedUserId(userId)
          setCurrentPage('profile')
        }} />
      case 'directory':
        return <UserDirectory onUserClick={(userId) => {
          setSelectedUserId(userId)
          setCurrentPage('profile')
        }} />
      case 'profile':
        return <UserProfile userId={selectedUserId} currentUser={user} onBack={() => setCurrentPage('feed')} />
      case 'admin':
        return <AdminDashboard user={user} />
      default:
        return <HomeFeed user={user} onUserClick={(userId) => {
          setSelectedUserId(userId)
          setCurrentPage('profile')
        }} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={user} 
        currentPage={currentPage} 
        onPageChange={handlePageChange}
        isAdmin={isAdmin}
      />
      <main className="pt-16">
        {renderPage()}
      </main>
    </div>
  )
}