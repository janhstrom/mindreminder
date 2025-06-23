"use client"

export interface FavoriteQuote {
  id: string
  content: string
  author: string
  topic: string
  createdAt: Date
  isFavorite: boolean
}

export class QuoteFavoritesService {
  private static instance: QuoteFavoritesService

  static getInstance(): QuoteFavoritesService {
    if (!QuoteFavoritesService.instance) {
      QuoteFavoritesService.instance = new QuoteFavoritesService()
    }
    return QuoteFavoritesService.instance
  }

  getFavoriteQuotes(): FavoriteQuote[] {
    if (typeof window === "undefined") return []

    const stored = localStorage.getItem("favorite-quotes")
    if (stored) {
      const quotes = JSON.parse(stored)
      return quotes.map((q: any) => ({
        ...q,
        createdAt: new Date(q.createdAt),
      }))
    }
    return []
  }

  addFavoriteQuote(content: string, author: string, topic: string): FavoriteQuote {
    const quote: FavoriteQuote = {
      id: Date.now().toString(),
      content,
      author,
      topic,
      createdAt: new Date(),
      isFavorite: true,
    }

    const favorites = this.getFavoriteQuotes()
    favorites.unshift(quote) // Add to beginning
    this.saveFavorites(favorites)

    return quote
  }

  removeFavoriteQuote(quoteId: string): void {
    const favorites = this.getFavoriteQuotes()
    const filtered = favorites.filter((q) => q.id !== quoteId)
    this.saveFavorites(filtered)
  }

  isQuoteFavorited(content: string): boolean {
    const favorites = this.getFavoriteQuotes()
    return favorites.some((q) => q.content === content)
  }

  private saveFavorites(quotes: FavoriteQuote[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem("favorite-quotes", JSON.stringify(quotes))
  }
}
