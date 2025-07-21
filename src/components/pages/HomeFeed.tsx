import { useState, useEffect } from 'react'
import { Plus, Heart, MessageCircle, ExternalLink, Calendar, Edit } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { CreatePostModal } from '../modals/CreatePostModal'
import { EditPostModal } from '../modals/EditPostModal'
import { blink } from '../../blink/client'
import { useToast } from '../../hooks/use-toast'

interface HomeFeedProps {
  user: any
  onUserClick: (userId: string) => void
}

interface Post {
  id: string
  user_id: string
  content: string
  image_url?: string
  external_link?: string
  created_at: string
  userName?: string
  userEmail?: string
}

export function HomeFeed({ user, onUserClick }: HomeFeedProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const { toast } = useToast()

  const loadPosts = async () => {
    try {
      setLoading(true)
      const postsData = await blink.db.posts.list({
        orderBy: { created_at: 'desc' },
        limit: 50
      })

      // Get user data for each post
      const postsWithUsers = await Promise.all(
        postsData.map(async (post) => {
          try {
            const userData = await blink.db.users.list({
              where: { user_id: post.user_id },
              limit: 1
            })
            return {
              ...post,
              userName: userData[0]?.name || 'Utente Sconosciuto',
              userEmail: userData[0]?.email || ''
            }
          } catch (error) {
            return {
              ...post,
              userName: 'Utente Sconosciuto',
              userEmail: ''
            }
          }
        })
      )

      setPosts(postsWithUsers)
    } catch (error) {
      console.error('Error loading posts:', error)
      toast({
        title: "Errore",
        description: "Impossibile caricare i post",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handlePostCreated = () => {
    setShowCreatePost(false)
    loadPosts()
    toast({
      title: "Successo",
      description: "Post creato con successo!"
    })
  }

  const handlePostUpdated = () => {
    setEditingPost(null)
    loadPosts()
    toast({
      title: "Successo",
      description: "Post aggiornato con successo!"
    })
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
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return 'Data non valida'
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-muted rounded-full" />
                  <div className="space-y-1">
                    <div className="w-32 h-4 bg-muted rounded" />
                    <div className="w-24 h-3 bg-muted rounded" />
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
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Create Post Button */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <Button 
            onClick={() => setShowCreatePost(true)}
            className="w-full justify-start text-muted-foreground"
            variant="ghost"
          >
            <Plus className="h-4 w-4 mr-2" />
            Condividi qualcosa con la community...
          </Button>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full mx-auto flex items-center justify-center">
                  <MessageCircle className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">Nessun post ancora</h3>
                  <p className="text-sm text-muted-foreground">
                    Sii il primo a condividere qualcosa con la community!
                  </p>
                </div>
                <Button onClick={() => setShowCreatePost(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Crea il Primo Post
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <Avatar 
                    className="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
                    onClick={() => onUserClick(post.user_id)}
                  >
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {post.userName?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <button
                      onClick={() => onUserClick(post.user_id)}
                      className="font-medium hover:text-primary transition-colors text-left"
                    >
                      {post.userName}
                    </button>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(post.created_at)}
                    </div>
                  </div>
                  {/* Edit button for post owner or admin */}
                  {(post.user_id === user.id || user.email === 'admin@farmtochef.com') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingPost(post)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Post Content */}
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{post.content}</p>
                </div>

                {/* Post Image */}
                {post.image_url && (
                  <div className="rounded-lg overflow-hidden">
                    <img 
                      src={post.image_url} 
                      alt="Immagine del post"
                      className="w-full h-auto max-h-96 object-cover"
                    />
                  </div>
                )}

                {/* External Link */}
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

                {/* Post Actions */}
                <div className="flex items-center space-x-4 pt-2 border-t">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Heart className="h-4 w-4 mr-1" />
                    Mi Piace
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-muted-foreground"
                    onClick={() => onUserClick(post.user_id)}
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Messaggio
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        open={showCreatePost}
        onOpenChange={setShowCreatePost}
        user={user}
        onPostCreated={handlePostCreated}
      />

      {/* Edit Post Modal */}
      {editingPost && (
        <EditPostModal
          open={!!editingPost}
          onOpenChange={(open) => !open && setEditingPost(null)}
          post={editingPost}
          onPostUpdated={handlePostUpdated}
        />
      )}
    </div>
  )
}