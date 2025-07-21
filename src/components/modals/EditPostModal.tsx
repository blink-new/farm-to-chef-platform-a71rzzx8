import { useState } from 'react'
import { Upload, Link, X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { blink } from '../../blink/client'
import { useToast } from '../../hooks/use-toast'

interface EditPostModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: any
  onPostUpdated: () => void
}

export function EditPostModal({ open, onOpenChange, post, onPostUpdated }: EditPostModalProps) {
  const [content, setContent] = useState(post?.content || '')
  const [externalLink, setExternalLink] = useState(post?.external_link || post?.externalLink || '')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(post?.image_url || post?.imageUrl || null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim()) {
      toast({
        title: "Errore",
        description: "Inserisci del contenuto per il tuo post",
        variant: "destructive"
      })
      return
    }

    setLoading(true)

    try {
      let imageUrl = imagePreview

      // Upload new image if provided
      if (imageFile) {
        const { publicUrl } = await blink.storage.upload(
          imageFile,
          `posts/${Date.now()}_${imageFile.name}`,
          { upsert: true }
        )
        imageUrl = publicUrl
      }

      // Update the post
      await blink.db.posts.update(post.id, {
        content: content.trim(),
        image_url: imageUrl || null,
        external_link: externalLink.trim() || null,
        updated_at: new Date().toISOString()
      })

      onPostUpdated()
    } catch (error) {
      console.error('Error updating post:', error)
      toast({
        title: "Errore",
        description: "Impossibile aggiornare il post. Riprova.",
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
          <DialogTitle>Modifica Post</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Contenuto del Post</Label>
            <Textarea
              id="content"
              placeholder="Condividi aggiornamenti, notizie, offerte o storie con la community..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Immagine (opzionale)</Label>
            {imagePreview ? (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Anteprima" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <Label htmlFor="image-upload" className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                    Clicca per caricare un'immagine
                  </Label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>
            )}
          </div>

          {/* External Link */}
          <div className="space-y-2">
            <Label htmlFor="link">Link Esterno (opzionale)</Label>
            <div className="relative">
              <Link className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="link"
                type="url"
                placeholder="https://esempio.com"
                value={externalLink}
                onChange={(e) => setExternalLink(e.target.value)}
                className="pl-10"
              />
            </div>
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
            <Button type="submit" disabled={loading || !content.trim()}>
              {loading ? 'Aggiornamento...' : 'Aggiorna Post'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}