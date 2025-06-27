"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Heart, Share2 } from "lucide-react"

const inspirationalQuotes = [
  {
    text: "The journey of a thousand miles begins with one step.",
    author: "Lao Tzu",
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    text: "Life is what happens to you while you're busy making other plans.",
    author: "John Lennon",
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
  },
  {
    text: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
  },
  {
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins",
  },
  {
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
  },
  {
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
  },
]

interface QuoteGeneratorProps {
  user?: any
}

export function QuoteGenerator({ user }: QuoteGeneratorProps) {
  const [currentQuote, setCurrentQuote] = useState(inspirationalQuotes[0])
  const [isLiked, setIsLiked] = useState(false)

  const generateNewQuote = () => {
    const randomIndex = Math.floor(Math.random() * inspirationalQuotes.length)
    setCurrentQuote(inspirationalQuotes[randomIndex])
    setIsLiked(false)
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Inspirational Quote",
          text: `"${currentQuote.text}" - ${currentQuote.author}`,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`"${currentQuote.text}" - ${currentQuote.author}`)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Daily Inspiration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <blockquote className="text-lg md:text-xl font-medium italic text-gray-700 dark:text-gray-300">
            "{currentQuote.text}"
          </blockquote>
          <cite className="text-sm text-gray-500 dark:text-gray-400">— {currentQuote.author}</cite>
        </div>

        <div className="flex justify-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={generateNewQuote}
            className="flex items-center space-x-2 bg-transparent"
          >
            <RefreshCw className="h-4 w-4" />
            <span>New Quote</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLike}
            className={`flex items-center space-x-2 ${isLiked ? "text-red-500" : ""}`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            <span>{isLiked ? "Liked" : "Like"}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="flex items-center space-x-2 bg-transparent"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
