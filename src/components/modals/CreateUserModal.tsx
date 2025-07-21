import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { blink } from '../../blink/client'
import { useToast } from '../../hooks/use-toast'

interface CreateUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUserCreated: () => void
}

export function CreateUserModal({ open, onOpenChange, onUserCreated }: CreateUserModalProps) {
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [website, setWebsite] = useState('')
  const [email, setEmail] = useState('')
  const [businessType, setBusinessType] = useState('Farm')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      toast({
        title: "Errore",
        description: "Il nome è obbligatorio",
        variant: "destructive"
      })
      return
    }

    setLoading(true)

    try {
      // Generate a unique user_id for admin-created users
      const userId = `admin_user_${Date.now()}`
      
      await blink.db.users.create({
        id: `user_${Date.now()}`,
        user_id: userId,
        name: name.trim(),
        bio: bio.trim(),
        website: website.trim(),
        email: email.trim() || null,
        business_type: businessType,
        is_admin_created: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

      // Reset form
      setName('')
      setBio('')
      setWebsite('')
      setEmail('')
      setBusinessType('Farm')
      
      onUserCreated()
      onOpenChange(false)
      
      toast({
        title: "Successo",
        description: "Utente creato con successo!"
      })
    } catch (error) {
      console.error('Error creating user:', error)
      toast({
        title: "Errore",
        description: "Impossibile creare l'utente. Riprova.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Crea Nuovo Utente</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome Azienda/Attività *</Label>
            <Input
              id="name"
              placeholder="Inserisci il nome della azienda o attività"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email (opzionale)</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@esempio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Lascia vuoto se l'utente non ha un'email
            </p>
          </div>

          {/* Business Type */}
          <div className="space-y-2">
            <Label htmlFor="businessType">Tipo di Attività</Label>
            <Select value={businessType} onValueChange={setBusinessType}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona il tipo di attività" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Farm">Azienda Agricola</SelectItem>
                <SelectItem value="Restaurant">Ristorante</SelectItem>
                <SelectItem value="Agritourism">Agriturismo</SelectItem>
                <SelectItem value="Chef">Chef</SelectItem>
                <SelectItem value="Other">Altro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Descrizione della Attività</Label>
            <Textarea
              id="bio"
              placeholder="Descrivi l'azienda agricola, ristorante, agriturismo o attività nel settore agricolo..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website">Sito Web (opzionale)</Label>
            <Input
              id="website"
              type="url"
              placeholder="https://il-tuo-sito.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annulla
            </Button>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? 'Creazione...' : 'Crea Utente'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}