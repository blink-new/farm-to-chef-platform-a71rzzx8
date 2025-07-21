import { useState, useEffect } from 'react'
import { Search, ExternalLink, MessageCircle } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { blink } from '../../blink/client'
import { useToast } from '../../hooks/use-toast'

interface UserDirectoryProps {
  onUserClick: (userId: string) => void
}

interface User {
  id: string
  userId: string
  name: string
  bio: string
  website: string
  email: string
  createdAt: string
}

export function UserDirectory({ onUserClick }: UserDirectoryProps) {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const loadUsers = async () => {
    try {
      setLoading(true)
      const usersData = await blink.db.users.list({
        orderBy: { createdAt: 'desc' }
      })
      setUsers(usersData)
      setFilteredUsers(usersData)
    } catch (error) {
      console.error('Error loading users:', error)
      toast({
        title: "Errore",
        description: "Impossibile caricare la directory utenti",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.bio.toLowerCase().includes(query) ||
        (user.email && user.email.toLowerCase().includes(query))
      )
      setFilteredUsers(filtered)
    }
  }, [searchQuery, users])

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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <div className="w-64 h-10 bg-muted rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-muted rounded-full" />
                  <div className="space-y-1">
                    <div className="w-32 h-4 bg-muted rounded" />
                    <div className="w-20 h-3 bg-muted rounded" />
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
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Directory Utenti</h1>
        <p className="text-muted-foreground">
          Scopri aziende agricole, ristoranti, chef e agriturismi nella nostra community
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca per nome, tipo di attività o descrizione..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{users.length}</div>
            <div className="text-sm text-muted-foreground">Membri Totali</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => getUserType(u.bio).type === 'Azienda Agricola').length}
            </div>
            <div className="text-sm text-muted-foreground">Aziende Agricole</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {users.filter(u => getUserType(u.bio).type === 'Ristorante').length}
            </div>
            <div className="text-sm text-muted-foreground">Ristoranti</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {users.filter(u => getUserType(u.bio).type === 'Agriturismo').length}
            </div>
            <div className="text-sm text-muted-foreground">Agriturismi</div>
          </CardContent>
        </Card>
      </div>

      {/* Users Grid */}
      {filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full mx-auto flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-medium">Nessun utente trovato</h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? 'Prova a modificare i termini di ricerca' : 'Nessun utente si è ancora iscritto'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => {
            const userType = getUserType(user.bio)
            return (
              <Card key={user.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar 
                        className="h-12 w-12 group-hover:ring-2 group-hover:ring-primary/20 transition-all"
                        onClick={() => onUserClick(user.userId)}
                      >
                        <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <button
                          onClick={() => onUserClick(user.userId)}
                          className="font-semibold text-left hover:text-primary transition-colors"
                        >
                          {user.name}
                        </button>
                        <Badge variant="secondary" className={`text-xs ${userType.color} mt-1`}>
                          {userType.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Bio */}
                  {user.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {user.bio}
                    </p>
                  )}

                  {/* Website */}
                  {user.website && (
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-sm text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span className="truncate">Visita il Sito</span>
                    </a>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => onUserClick(user.userId)}
                      className="flex-1"
                    >
                      Vedi Profilo
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUserClick(user.userId)}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}