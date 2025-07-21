import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import { Toaster } from './components/ui/toaster'
import { MainLayout } from './components/layout/MainLayout'
import { LoadingScreen } from './components/LoadingScreen'
import LandingPage from './components/pages/LandingPage'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
      
      // Check if user is admin
      if (state.user?.email === 'italiacrafts@gmail.com') {
        setIsAdmin(true)
      } else {
        setIsAdmin(false)
      }
    })
    return unsubscribe
  }, [])

  const handleSignIn = () => {
    blink.auth.login()
  }

  const handleSignUp = () => {
    blink.auth.login()
  }

  if (loading) {
    return <LoadingScreen />
  }

  if (!user) {
    return (
      <LandingPage 
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
      />
    )
  }

  return (
    <>
      <MainLayout user={user} isAdmin={isAdmin} />
      <Toaster />
    </>
  )
}

export default App