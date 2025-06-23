import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { QuoteTopic } from "@/types"

export class QuoteService {
  static async generateQuote(topic: QuoteTopic): Promise<{ quote: string; author: string }> {
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OpenAI API key not found, using fallback quotes")
      return this.getFallbackQuote(topic)
    }

    try {
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: `Generate an inspiring and meaningful quote about ${topic} from a real historical figure, philosopher, author, or notable person. Return the response in this exact format: "Quote text here" - Author Name`,
        system:
          "You are a knowledgeable curator of inspirational quotes from real people throughout history. Always include proper attribution.",
      })

      console.log("Generated quote text:", text) // Debug log

      const result = this.parseQuoteAndAuthor(text.trim())
      console.log("Parsed result:", result) // Debug log

      // If parsing failed or quote is empty, use fallback
      if (!result.quote || result.quote.trim() === "") {
        console.warn("Generated quote was empty, using fallback")
        return this.getFallbackQuote(topic)
      }

      return result
    } catch (error) {
      console.error("Error generating quote:", error)
      return this.getFallbackQuote(topic)
    }
  }

  private static parseQuoteAndAuthor(text: string): { quote: string; author: string } {
    console.log("Parsing text:", text) // Debug log

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

    // Fallback if everything fails
    return {
      quote: "",
      author: "Unknown",
    }
  }

  private static getFallbackQuote(topic: QuoteTopic): { quote: string; author: string } {
    const fallbackQuotes: Record<QuoteTopic, Array<{ quote: string; author: string }>> = {
      motivation: [
        { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        {
          quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
          author: "Winston Churchill",
        },
        { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
        {
          quote: "The future belongs to those who believe in the beauty of their dreams.",
          author: "Eleanor Roosevelt",
        },
        { quote: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
      ],
      success: [
        { quote: "Success is not the key to happiness. Happiness is the key to success.", author: "Albert Schweitzer" },
        {
          quote: "Success is walking from failure to failure with no loss of enthusiasm.",
          author: "Winston Churchill",
        },
        { quote: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
        {
          quote: "Success is not how high you have climbed, but how you make a positive difference to the world.",
          author: "Roy T. Bennett",
        },
        { quote: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller" },
      ],
      happiness: [
        { quote: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" },
        { quote: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
        {
          quote: "Happiness is when what you think, what you say, and what you do are in harmony.",
          author: "Mahatma Gandhi",
        },
        {
          quote: "Very little is needed to make a happy life; it is all within yourself, in your way of thinking.",
          author: "Marcus Aurelius",
        },
        { quote: "Happiness is not by chance, but by choice.", author: "Jim Rohn" },
      ],
      wisdom: [
        { quote: "The only true wisdom is in knowing you know nothing.", author: "Socrates" },
        {
          quote: "Wisdom is not a product of schooling but of the lifelong attempt to acquire it.",
          author: "Albert Einstein",
        },
        {
          quote: "The fool doth think he is wise, but the wise man knows himself to be a fool.",
          author: "William Shakespeare",
        },
        { quote: "Knowledge speaks, but wisdom listens.", author: "Jimi Hendrix" },
        { quote: "The wise find pleasure in water; the virtuous find pleasure in hills.", author: "Confucius" },
      ],
      love: [
        {
          quote: "Being deeply loved by someone gives you strength, while loving someone deeply gives you courage.",
          author: "Lao Tzu",
        },
        { quote: "Love is composed of a single soul inhabiting two bodies.", author: "Aristotle" },
        { quote: "The best thing to hold onto in life is each other.", author: "Audrey Hepburn" },
        { quote: "Where there is love there is life.", author: "Mahatma Gandhi" },
        { quote: "Love all, trust a few, do wrong to none.", author: "William Shakespeare" },
      ],
      friendship: [
        { quote: "A real friend is one who walks in when the rest of the world walks out.", author: "Walter Winchell" },
        { quote: "Friendship is the only cement that will ever hold the world together.", author: "Woodrow Wilson" },
        { quote: "A friend is someone who knows all about you and still loves you.", author: "Elbert Hubbard" },
        { quote: "True friendship comes when the silence between two people is comfortable.", author: "David Tyson" },
        {
          quote: "Friendship is born at that moment when one person says to another, 'What! You too?'",
          author: "C.S. Lewis",
        },
      ],
      mindfulness: [
        { quote: "The present moment is the only time over which we have dominion.", author: "Thich Nhat Hanh" },
        { quote: "Peace comes from within. Do not seek it without.", author: "Buddha" },
        { quote: "The mind is everything. What you think you become.", author: "Buddha" },
        { quote: "Wherever you are, be there totally.", author: "Eckhart Tolle" },
        { quote: "Mindfulness is about being fully awake in our lives.", author: "Jon Kabat-Zinn" },
      ],
      productivity: [
        { quote: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
        {
          quote: "The key is not to prioritize what's on your schedule, but to schedule your priorities.",
          author: "Stephen Covey",
        },
        {
          quote: "Productivity is never an accident. It is always the result of a commitment to excellence.",
          author: "Paul J. Meyer",
        },
        {
          quote: "Don't confuse motion with progress. A rocking horse keeps moving but doesn't make any progress.",
          author: "Alfred A. Montapert",
        },
        { quote: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
      ],
    }

    const quotes = fallbackQuotes[topic]
    const selectedQuote = quotes[Math.floor(Math.random() * quotes.length)]
    console.log("Using fallback quote:", selectedQuote) // Debug log
    return selectedQuote
  }

  static getTopics(): QuoteTopic[] {
    return ["motivation", "success", "happiness", "wisdom", "love", "friendship", "mindfulness", "productivity"]
  }
}
