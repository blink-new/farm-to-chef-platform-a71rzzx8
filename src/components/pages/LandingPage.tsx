import React from 'react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { ChefHat, Tractor, Users, Search, Shield, Globe } from 'lucide-react'

interface LandingPageProps {
  onSignIn: () => void
  onSignUp: () => void
}

export default function LandingPage({ onSignIn, onSignUp }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-green-700" />
              <span className="text-2xl font-bold text-green-700">Farm to Chef</span>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" onClick={onSignIn}>
                Accedi
              </Button>
              <Button onClick={onSignUp} className="bg-green-700 hover:bg-green-800">
                Registrati
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Connetti la tua
            <span className="text-green-700 block">Cucina con la Terra</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            La directory B2B che unisce produttori locali, aziende agricole e agriturismi 
            con ristoranti e chef per un mercato agricolo trasparente e sostenibile.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={onSignUp}
              className="bg-green-700 hover:bg-green-800 text-lg px-8 py-3"
            >
              Inizia Gratis
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={onSignIn}
              className="text-lg px-8 py-3"
            >
              Accedi al tuo Account
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Perché Scegliere Farm to Chef?
            </h2>
            <p className="text-xl text-gray-600">
              La soluzione completa per il mercato agricolo B2B italiano
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-green-200 transition-colors">
              <CardContent className="p-6 text-center">
                <Tractor className="h-12 w-12 text-green-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Produttori Locali</h3>
                <p className="text-gray-600">
                  Connetti la tua azienda agricola o agriturismo direttamente con ristoranti e chef della tua zona.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors">
              <CardContent className="p-6 text-center">
                <ChefHat className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Ristoranti & Chef</h3>
                <p className="text-gray-600">
                  Trova fornitori di qualità nella tua zona e ordina prodotti freschi direttamente dai produttori.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors">
              <CardContent className="p-6 text-center">
                <Globe className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Rete Nazionale</h3>
                <p className="text-gray-600">
                  Accedi a una rete nazionale di produttori e ristoratori per espandere il tuo business.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors">
              <CardContent className="p-6 text-center">
                <Search className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Directory Completa</h3>
                <p className="text-gray-600">
                  Cerca e filtra produttori per tipo di prodotto, zona geografica e specializzazioni.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Community Attiva</h3>
                <p className="text-gray-600">
                  Condividi aggiornamenti, offerte speciali e novità con tutta la community agricola.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors">
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Sicuro & Affidabile</h3>
                <p className="text-gray-600">
                  Piattaforma sicura con profili verificati e sistema di recensioni integrato.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Come Funziona
            </h2>
            <p className="text-xl text-gray-600">
              Semplice, veloce ed efficace
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-700 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Registrati</h3>
              <p className="text-gray-600">
                Crea il tuo profilo aziendale con descrizione, prodotti e informazioni di contatto.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-amber-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Connetti</h3>
              <p className="text-gray-600">
                Cerca e scopri produttori o ristoranti nella tua zona attraverso la directory completa.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Collabora</h3>
              <p className="text-gray-600">
                Condividi aggiornamenti, scopri nuove opportunità e fai crescere il tuo business nella community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto a Rivoluzionare il tuo Business?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Unisciti a centinaia di produttori e ristoratori che stanno già utilizzando Farm to Chef 
            per scoprire nuove opportunità e far crescere il loro business in modo sostenibile.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={onSignUp}
              className="bg-white text-green-700 hover:bg-gray-100 text-lg px-8 py-3"
            >
              Registrati Gratuitamente
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={onSignIn}
              className="border-white text-white hover:bg-white hover:text-green-700 text-lg px-8 py-3"
            >
              Hai già un account?
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <ChefHat className="h-8 w-8 text-green-400" />
                <span className="text-2xl font-bold">Farm to Chef</span>
              </div>
              <p className="text-gray-400">
                La directory che connette il mondo agricolo con la ristorazione italiana.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Prodotto</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Funzionalità</li>
                <li>Prezzi</li>
                <li>Sicurezza</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Supporto</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Centro Assistenza</li>
                <li>Contatti</li>
                <li>FAQ</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Azienda</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Chi Siamo</li>
                <li>Privacy</li>
                <li>Termini di Servizio</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Farm to Chef. Tutti i diritti riservati.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}