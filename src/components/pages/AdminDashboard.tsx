import { useState, useEffect } from 'react'
import { Users, MessageSquare, Trash2, Edit, Shield, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
import { EditUserModal } from '../modals/EditUserModal'
import { EditPostModal } from '../modals/EditPostModal'
import { CreateUserModal } from '../modals/CreateUserModal'
import { blink } from '../../blink/client'
import { useToast } from '../../hooks/use-toast'

interface AdminDashboardProps {
  user: any
}

interface User {
  id: string
  user_id: string
  name: string
  bio: string
  website: string
  email: string
  created_at: string
  business_type?: string
}

interface Post {
  id: string
  user_id: string
  content: string
  image_url?: string
  external_link?: string
  created_at: string
  userName?: string
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const [users, setUsers] = useState<User[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [showCreateUser, setShowCreateUser] = useState(false)
  const { toast } = useToast()

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load all users
      const usersData = await blink.db.users.list({
        orderBy: { created_at: 'desc' }
      })
      setUsers(usersData)

      // Load all posts with user names
      const postsData = await blink.db.posts.list({
        orderBy: { created_at: 'desc' },
        limit: 50
      })

      const postsWithUsers = await Promise.all(
        postsData.map(async (post) => {
          try {
            const userData = await blink.db.users.list({
              where: { user_id: post.user_id },
              limit: 1
            })
            return {
              ...post,
              userName: userData[0]?.name || 'Utente Sconosciuto'
            }
          } catch (error) {
            return {
              ...post,
              userName: 'Utente Sconosciuto'
            }
          }
        })
      )
      setPosts(postsWithUsers)

    } catch (error) {
      console.error('Error loading admin data:', error)
      toast({
        title: "Errore",
        description: "Impossibile caricare i dati amministrativi",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (userId: string) => {
    try {
      // Delete user's posts first
      const userPosts = await blink.db.posts.list({
        where: { user_id: userId }
      })
      for (const post of userPosts) {
        await blink.db.posts.delete(post.id)
      }

      // Delete user profile
      const userProfile = await blink.db.users.list({
        where: { user_id: userId },
        limit: 1
      })
      if (userProfile.length > 0) {
        await blink.db.users.delete(userProfile[0].id)
      }

      await loadData()
      toast({
        title: "Successo",
        description: "Utente e tutti i dati associati eliminati con successo"
      })
    } catch (error) {
      console.error('Error deleting user:', error)
      toast({
        title: "Errore",
        description: "Impossibile eliminare l'utente",
        variant: "destructive"
      })
    }
  }

  const deletePost = async (postId: string) => {
    try {
      await blink.db.posts.delete(postId)
      await loadData()
      toast({
        title: "Successo",
        description: "Post eliminato con successo"
      })
    } catch (error) {
      console.error('Error deleting post:', error)
      toast({
        title: "Errore",
        description: "Impossibile eliminare il post",
        variant: "destructive"
      })
    }
  }

  const handleUserUpdated = () => {
    setEditingUser(null)
    loadData()
  }

  const handlePostUpdated = () => {
    setEditingPost(null)
    loadData()
  }

  const handleUserCreated = () => {
    setShowCreateUser(false)
    loadData()
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
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return 'Data non valida'
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

  useEffect(() => {
    loadData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="w-48 h-8 bg-muted rounded" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="w-16 h-8 bg-muted rounded" />
                    <div className="w-24 h-4 bg-muted rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Dashboard Amministratore</h1>
        </div>
        <p className="text-muted-foreground">
          Gestisci utenti, post e contenuti della piattaforma
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">{users.length}</div>
                <div className="text-sm text-muted-foreground">Utenti Totali</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">{posts.length}</div>
                <div className="text-sm text-muted-foreground">Post Totali</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">Attiva</div>
                <div className="text-sm text-muted-foreground">Stato Piattaforma</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Utenti</TabsTrigger>
          <TabsTrigger value="posts">Post</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>Gestione Utenti</CardTitle>
              <Button onClick={() => setShowCreateUser(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crea Utente
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => {
                  const userType = getUserType(user.bio)
                  return (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <p className="font-medium">{user.name}</p>
                            <Badge variant="secondary" className={`text-xs ${userType.color}`}>
                              {userType.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {user.email || 'Nessuna email'}
                            {Number(user.is_admin_created) > 0 && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                Creato da Admin
                              </Badge>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Iscritto il {formatDate(user.created_at)}
                          </p>
                          {user.bio && (
                            <p className="text-sm text-muted-foreground line-clamp-2 max-w-md">
                              {user.bio}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingUser(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Elimina Utente</AlertDialogTitle>
                              <AlertDialogDescription>
                                Questo eliminerà permanentemente il profilo di {user.name}, tutti i suoi post. Questa azione non può essere annullata.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annulla</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteUser(user.user_id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Elimina Utente
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  )
                })}
                
                {users.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Nessun utente trovato</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Posts Tab */}
        <TabsContent value="posts">
          <Card>
            <CardHeader>
              <CardTitle>Gestione Post</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {posts.map((post) => (
                  <div key={post.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {post.userName?.charAt(0)?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{post.userName}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(post.created_at)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingPost(post)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Elimina Post</AlertDialogTitle>
                              <AlertDialogDescription>
                                Questo eliminerà permanentemente questo post. Questa azione non può essere annullata.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annulla</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deletePost(post.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Elimina Post
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="whitespace-pre-wrap">{post.content}</p>
                      
                      {post.image_url && (
                        <div className="rounded-lg overflow-hidden max-w-md">
                          <img 
                            src={post.image_url} 
                            alt="Immagine del post"
                            className="w-full h-auto max-h-48 object-cover"
                          />
                        </div>
                      )}

                      {post.external_link && (
                        <a
                          href={post.external_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-sm text-primary hover:underline"
                        >
                          <span>{post.external_link}</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
                
                {posts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Nessun post trovato</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit User Modal */}
      {editingUser && (
        <EditUserModal
          open={!!editingUser}
          onOpenChange={(open) => !open && setEditingUser(null)}
          user={editingUser}
          onUserUpdated={handleUserUpdated}
        />
      )}

      {/* Edit Post Modal */}
      {editingPost && (
        <EditPostModal
          open={!!editingPost}
          onOpenChange={(open) => !open && setEditingPost(null)}
          post={editingPost}
          onPostUpdated={handlePostUpdated}
        />
      )}

      {/* Create User Modal */}
      <CreateUserModal
        open={showCreateUser}
        onOpenChange={setShowCreateUser}
        onUserCreated={handleUserCreated}
      />
    </div>
  )
}