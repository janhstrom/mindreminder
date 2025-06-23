"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Share, Copy, Heart, Trash2 } from "lucide-react"
import { SupabaseQuoteService, type FavoriteQuote } from "@/lib/quotes-supabase"
import { UserPreferencesService } from "@/lib/user-preferences"
import type { QuoteTopic } from "@/types"
import type { AuthUser } from "@/lib/auth-supabase"
import { Analytics } from "@/lib/analytics"

interface QuoteGeneratorProps {
  user?: AuthUser | null
}

export function QuoteGenerator({ user }: QuoteGeneratorProps) {
  const [selectedTopic, setSelectedTopic] = useState<QuoteTopic>("motivation")
  const [currentQuote, setCurrentQuote] = useState<{ quote: string; author: string } | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [favorites, setFavorites] = useState<FavoriteQuote[]>([])

  const supabaseQuoteService = SupabaseQuoteService.getInstance()
  const userPreferencesService = UserPreferencesService.getInstance()

  // Load favorites when user changes
  useEffect(() => {
    if (user) {
      loadFavorites()
    } else {
      setFavorites([])
    }
  }, [user])

  const loadFavorites = async () => {
    if (!user) return
    try {
      const userFavorites = await supabaseQuoteService.getFavoriteQuotes(user.id)
      setFavorites(userFavorites)
    } catch (error) {
      console.error("Error loading favorites:", error)
    }
  }

  const handleGenerateQuote = async () => {
    setIsGenerating(true)
    try {
      const quoteData = await supabaseQuoteService.generateQuote(selectedTopic)
      setCurrentQuote(quoteData)
      Analytics.trackQuoteGenerated(selectedTopic)
    } catch (error) {
      console.error("Failed to generate quote:", error)
      Analytics.trackError("quote_generation", error instanceof Error ? error.message : "Unknown error")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyQuote = (quote?: { quote: string; author: string }) => {
    const quoteText = quote
      ? `"${quote.quote}" - ${quote.author}`
      : currentQuote
        ? `"${currentQuote.quote}" - ${currentQuote.author}`
        : ""
    navigator.clipboard.writeText(quoteText)
    Analytics.trackQuoteShared("copy")
  }

  const handleShareQuote = (quote?: { quote: string; author: string }) => {
    const quoteText = quote
      ? `"${quote.quote}" - ${quote.author}`
      : currentQuote
        ? `"${currentQuote.quote}" - ${currentQuote.author}`
        : ""
    if (navigator.share) {
      navigator.share({
        title: "Inspiring Quote from MindReMinder",
        text: quoteText,
      })
      Analytics.trackQuoteShared("native_share")
    } else {
      handleCopyQuote(quote)
    }
  }

  const handleToggleFavorite = async (quote: string, author: string, topic: string) => {
    if (!user) return

    try {
      const isCurrentlyFavorited = await supabaseQuoteService.isQuoteFavorited(user.id, quote)

      if (isCurrentlyFavorited) {
        const favoriteQuote = favorites.find((f) => f.content === quote)
        if (favoriteQuote) {
          await supabaseQuoteService.removeFavoriteQuote(user.id, favoriteQuote.id)
          setFavorites((prev) => prev.filter((f) => f.id !== favoriteQuote.id))
          Analytics.event("quote_unfavorited", { topic, event_category: "quotes" })
        }
      } else {
        const newFavorite = await supabaseQuoteService.addFavoriteQuote(user.id, quote, author, topic)
        setFavorites((prev) => [newFavorite, ...prev])
        Analytics.event("quote_favorited", { topic, event_category: "quotes" })
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
    }
  }

  const handleRemoveFavorite = async (quoteId: string) => {
    if (!user) return
    try {
      await supabaseQuoteService.removeFavoriteQuote(user.id, quoteId)
      setFavorites((prev) => prev.filter((f) => f.id !== quoteId))
      Analytics.event("favorite_quote_removed", { event_category: "quotes" })
    } catch (error) {
      console.error("Error removing favorite:", error)
    }
  }

  const topics = SupabaseQuoteService.getTopics()

  return (
    <div className="space-y-6">
      <Tabs defaultValue="generator" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generator">Generate Quotes</TabsTrigger>
          <TabsTrigger value="favorites" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Favorites ({favorites.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Quote Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Choose a topic:</label>
                <Select value={selectedTopic} onValueChange={(value) => setSelectedTopic(value as QuoteTopic)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map((topic) => (
                      <SelectItem key={topic} value={topic}>
                        {topic.charAt(0).toUpperCase() + topic.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleGenerateQuote} disabled={isGenerating} className="w-full">
                {isGenerating ? "Generating..." : "Generate Quote"}
              </Button>
            </CardContent>
          </Card>

          {currentQuote && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary" className="capitalize">
                      {selectedTopic}
                    </Badge>
                  </div>

                  <blockquote className="text-lg italic text-center py-4 px-2 border-l-4 border-primary bg-muted/50 rounded-r-lg">
                    <p className="mb-2">"{currentQuote.quote}"</p>
                    <footer className="text-sm font-medium text-muted-foreground">— {currentQuote.author}</footer>
                  </blockquote>

                  <div className="flex gap-2 justify-center">
                    {user && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleFavorite(currentQuote.quote, currentQuote.author, selectedTopic)}
                      >
                        <Heart className="h-4 w-4 mr-1" />
                        Favorite
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => handleCopyQuote()}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleShareQuote()}>
                      <Share className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="favorites" className="space-y-6">
          {!user ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Sign in to save favorites</h3>
                  <p className="text-muted-foreground">Create an account to save and manage your favorite quotes</p>
                </div>
              </CardContent>
            </Card>
          ) : favorites.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No favorite quotes yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Generate some quotes and save your favorites to see them here
                  </p>
                  <Button onClick={() => document.querySelector('[value="generator"]')?.click()}>
                    Generate Your First Quote
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {favorites.map((quote) => (
                <Card key={quote.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <Badge variant="secondary" className="capitalize">
                          {quote.topic}
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                          {userPreferencesService.formatDateTime(quote.createdAt)}
                        </div>
                      </div>

                      <blockquote className="text-base italic py-3 px-2 border-l-4 border-primary bg-muted/50 rounded-r-lg">
                        <p className="mb-2">"{quote.content}"</p>
                        <footer className="text-sm font-medium text-muted-foreground">— {quote.author}</footer>
                      </blockquote>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyQuote({ quote: quote.content, author: quote.author })}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleShareQuote({ quote: quote.content, author: quote.author })}
                        >
                          <Share className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveFavorite(quote.id)}
                          className="text-destructive hover:text-destructive ml-auto"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
