import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { blink } from '../../blink/client'
import { useToast } from '../../hooks/use-toast'

interface EditProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: any
  onProfileUpdated: () => void
}

export function EditProfileModal({ open, onOpenChange, user, onProfileUpdated }: EditProfileModalProps) {
  const [name, setName] = useState(user?.name || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [website, setWebsite] = useState(user?.website || '')
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
      await blink.db.users.update(user.id, {
        name: name.trim(),
        bio: bio.trim(),
        website: website.trim()
      })

      onProfileUpdated()
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Errore",
        description: "Impossibile aggiornare il profilo. Riprova.",
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
          <DialogTitle>Modifica Profilo</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome Azienda/Attività *</Label>
            <Input
              id="name"
              placeholder="Inserisci il nome della tua azienda o attività"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Descrizione della tua Attività</Label>
            <Textarea
              id="bio"
              placeholder="Descrivi la tua azienda agricola, ristorante, agriturismo o la tua attività nel settore agricolo..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Includi parole chiave come "azienda agricola", "ristorante", "chef", "agriturismo" per aiutare gli altri a trovarti
            </p>
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
              {loading ? 'Salvataggio...' : 'Salva Modifiche'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}