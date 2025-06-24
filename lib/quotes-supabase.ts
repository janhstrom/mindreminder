"use client"

import { supabase } from "./supabase"
import type { Database } from "./supabase"
import type { QuoteTopic } from "@/types"

type QuoteRow = Database["public"]["Tables"]["quotes"]["Row"]
type QuoteInsert = Database["public"]["Tables"]["quotes"]["Insert"]

export interface FavoriteQuote {
  id: string
  content: string
  author: string
  topic: string
  createdAt: Date
  isFavorite: boolean
}

export class SupabaseQuoteService {
  private static instance: SupabaseQuoteService

  static getInstance(): SupabaseQuoteService {
    if (!SupabaseQuoteService.instance) {
      SupabaseQuoteService.instance = new SupabaseQuoteService()
    }
    return SupabaseQuoteService.instance
  }

  async generateQuote(topic: QuoteTopic): Promise<{ quote: string; author: string }> {
    // Always use fallback quotes for now to ensure it works
    console.log("Generating quote for topic:", topic)
    return this.getFallbackQuote(topic)
  }

  async getFavoriteQuotes(userId: string): Promise<FavoriteQuote[]> {
    console.log("Fetching favorite quotes for user:", userId)

    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .eq("user_id", userId) // This is critical - must filter by user_id
      .eq("is_favorite", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching favorite quotes:", error)
      return []
    }

    console.log("Fetched quotes for user:", data)
    return data.map(this.mapRowToFavoriteQuote)
  }

  async addFavoriteQuote(userId: string, content: string, author: string, topic: string): Promise<FavoriteQuote> {
    const insertData: QuoteInsert = {
      user_id: userId,
      content,
      author,
      topic,
      is_favorite: true,
    }

    const { data, error } = await supabase.from("quotes").insert(insertData).select().single()

    if (error) throw error

    return this.mapRowToFavoriteQuote(data)
  }

  async removeFavoriteQuote(userId: string, quoteId: string): Promise<void> {
    const { error } = await supabase.from("quotes").delete().eq("id", quoteId).eq("user_id", userId)

    if (error) throw error
  }

  async isQuoteFavorited(userId: string, content: string): Promise<boolean> {
    console.log("Checking if quote is favorited for user:", userId)

    const { data, error } = await supabase
      .from("quotes")
      .select("id")
      .eq("user_id", userId) // Critical: filter by user
      .eq("content", content)
      .eq("is_favorite", true)
      .maybeSingle()

    if (error) {
      console.log("Quote not found or error:", error)
      return false
    }
    return !!data
  }

  private parseQuoteAndAuthor(text: string): { quote: string; author: string } {
    // Try to parse "Quote" - Author format
    const match = text.match(/^"(.+)"\s*-\s*(.+)$/)
    if (match) {
      return {
        quote: match[1].trim(),
        author: match[2].trim(),
      }
    }

    // Try alternative format without quotes
    const match2 = text.match(/^(.+)\s*-\s*(.+)$/)
    if (match2) {
      return {
        quote: match2[1].trim(),
        author: match2[2].trim(),
      }
    }

    // If no author found, treat entire text as quote
    if (text.trim()) {
      return {
        quote: text.trim(),
        author: "Unknown",
      }
    }

    return {
      quote: "",
      author: "Unknown",
    }
  }

  private getFallbackQuote(topic: QuoteTopic): { quote: string; author: string } {
    const fallbackQuotes: Record<QuoteTopic, Array<{ quote: string; author: string }>> = {
      motivation: [
        { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        {
          quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
          author: "Winston Churchill",
        },
        { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
      ],
      success: [
        { quote: "Success is not the key to happiness. Happiness is the key to success.", author: "Albert Schweitzer" },
        { quote: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
      ],
      happiness: [
        { quote: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" },
        { quote: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
      ],
      wisdom: [
        { quote: "The only true wisdom is in knowing you know nothing.", author: "Socrates" },
        { quote: "Knowledge speaks, but wisdom listens.", author: "Jimi Hendrix" },
      ],
      love: [
        {
          quote: "Being deeply loved by someone gives you strength, while loving someone deeply gives you courage.",
          author: "Lao Tzu",
        },
        { quote: "Love is composed of a single soul inhabiting two bodies.", author: "Aristotle" },
      ],
      friendship: [
        { quote: "A real friend is one who walks in when the rest of the world walks out.", author: "Walter Winchell" },
        { quote: "Friendship is the only cement that will ever hold the world together.", author: "Woodrow Wilson" },
      ],
      mindfulness: [
        { quote: "The present moment is the only time over which we have dominion.", author: "Thich Nhat Hanh" },
        { quote: "Peace comes from within. Do not seek it without.", author: "Buddha" },
      ],
      productivity: [
        { quote: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
        { quote: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
      ],
    }

    const quotes = fallbackQuotes[topic]
    return quotes[Math.floor(Math.random() * quotes.length)]
  }

  private mapRowToFavoriteQuote(row: QuoteRow): FavoriteQuote {
    return {
      id: row.id,
      content: row.content,
      author: row.author,
      topic: row.topic,
      createdAt: new Date(row.created_at),
      isFavorite: row.is_favorite,
    }
  }

  static getTopics(): QuoteTopic[] {
    return ["motivation", "success", "happiness", "wisdom", "love", "friendship", "mindfulness", "productivity"]
  }
}
