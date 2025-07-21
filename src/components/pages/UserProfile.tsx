import { useState, useEffect } from 'react'
import { ArrowLeft, ExternalLink, Edit, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { EditProfileModal } from '../modals/EditProfileModal'
import { blink } from '../../blink/client'
import { useToast } from '../../hooks/use-toast'

interface UserProfileProps {
  userId: string | null
  currentUser: any
  onBack: () => void
}

interface User {
  id: string
  user_id: string
  name: string
  bio: string
  website: string
  email: string
  created_at: string
}

interface Post {
  id: string
  user_id: string
  content: string
  image_url?: string
  external_link?: string
  created_at: string
}

export function UserProfile({ userId, currentUser, onBack }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const { toast } = useToast()

  const isOwnProfile = userId === currentUser.id

  const loadUserProfile = async () => {
    if (!userId) return

    try {
      setLoading(true)
      
      // Load user data
      const userData = await blink.db.users.list({
        where: { user_id: userId },
        limit: 1
      })

      if (userData.length === 0) {
        // Create profile if viewing own profile and it doesn't exist
        if (isOwnProfile) {
          const newUser = {
            id: `user_${Date.now()}`,
            user_id: currentUser.id,
            name: currentUser.email.split('@')[0],
            email: currentUser.email,
            bio: '',
            website: '',
            created_at: new Date().toISOString()
          }
          await blink.db.users.create(newUser)
          setUser(newUser)
        } else {
          toast({
            title: "Errore",
            description: "Profilo utente non trovato",
            variant: "destructive"
          })
          onBack()
          return
        }
      } else {
        setUser(userData[0])
      }

      // Load user's posts
      const userPosts = await blink.db.posts.list({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
        limit: 20
      })
      setPosts(userPosts)

    } catch (error) {
      console.error('Error loading user profile:', error)
      toast({
        title: "Errore",
        description: "Impossibile caricare il profilo utente",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }



  const getUserType = (bio: string) => {
    const lowerBio = bio.toLowerCase()
    if (lowerBio.includes('farm') || lowerBio.includes('agricol') || lowerBio.includes('produc') || lowerBio.includes('azienda agricola')) {
      return { type: 'Azienda Agricola', color: 'bg-green-100 text-green-800' }
    } else if (lowerBio.includes('restaurant') || lowerBio.includes('chef') || lowerBio.includes('cucina') || lowerBio.includes('ristorante')) {
      return { type: 'Ristorante', color: 'bg-orange-100 text-orange-800' }
    } else if (lowerBio.includes('agriturism') || lowerBio.includes('turism')) {
      return { type: 'Agriturismo', color: 'bg-blue-100 text-blue-800' }
    }
    return { type: 'Membro', color: 'bg-gray-100 text-gray-800' }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'Data non valida'
      }
      return date.toLocaleDateString('it-IT', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    } catch (error) {
      return 'Data non valida'
    }
  }

  useEffect(() => {
    loadUserProfile()
  }, [userId, currentUser.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleProfileUpdated = () => {
    setShowEditProfile(false)
    loadUserProfile()
    toast({
      title: "Successo",
      description: "Profilo aggiornato con successo!"
    })
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-muted rounded" />
            <div className="w-32 h-6 bg-muted rounded" />
          </div>
          <Card>
            <CardHeader className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-muted rounded-full" />
                <div className="space-y-2">
                  <div className="w-48 h-6 bg-muted rounded" />
                  <div className="w-32 h-4 bg-muted rounded" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="w-full h-4 bg-muted rounded" />
                <div className="w-3/4 h-4 bg-muted rounded" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <p>Utente non trovato</p>
          <Button onClick={onBack} className="mt-4">
            Torna Indietro
          </Button>
        </div>
      </div>
    )
  }

  const userType = getUserType(user.bio)

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Indietro
      </Button>

      {/* Profile Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary/10 text-primary font-medium text-2xl">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <Badge variant="secondary" className={`${userType.color}`}>
                    {userType.type}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  Iscritto il {formatDate(user.created_at)}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {isOwnProfile && (
                <Button onClick={() => setShowEditProfile(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifica Profilo
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Bio */}
          {user.bio && (
            <div>
              <h3 className="font-medium mb-2">Informazioni</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{user.bio}</p>
            </div>
          )}

          {/* Website */}
          {user.website && (
            <div>
              <h3 className="font-medium mb-2">Sito Web</h3>
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                <span>{user.website}</span>
              </a>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{posts.length}</div>
              <div className="text-sm text-muted-foreground">Post</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">0</div>
              <div className="text-sm text-muted-foreground">Connessioni</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {Math.floor(Math.random() * 50) + 10}
              </div>
              <div className="text-sm text-muted-foreground">Visualizzazioni</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Post di {user.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nessun post ancora</p>
              {isOwnProfile && (
                <p className="text-sm">Condividi il tuo primo post per iniziare!</p>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="border-b pb-6 last:border-b-0">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(post.created_at)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="whitespace-pre-wrap">{post.content}</p>
                    
                    {post.image_url && (
                      <div className="rounded-lg overflow-hidden">
                        <img 
                          src={post.image_url} 
                          alt="Immagine del post"
                          className="w-full h-auto max-h-96 object-cover"
                        />
                      </div>
                    )}

                    {post.external_link && (
                      <a
                        href={post.external_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-primary hover:underline">
                          {post.external_link}
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Profile Modal */}
      {isOwnProfile && (
        <EditProfileModal
          open={showEditProfile}
          onOpenChange={setShowEditProfile}
          user={user}
          onProfileUpdated={handleProfileUpdated}
        />
      )}
    </div>
  )
}