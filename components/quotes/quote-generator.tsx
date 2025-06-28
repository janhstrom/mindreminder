"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Heart, Share2 } from "lucide-react"

const inspirationalQuotes = [
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
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
  },
  {
    text: "Don't let yesterday take up too much of today.",
    author: "Will Rogers",
  },
  {
    text: "You learn more from failure than from success. Don't let it stop you. Failure builds character.",
    author: "Unknown",
  },
  {
    text: "If you are working on something that you really care about, you don't have to be pushed. The vision pulls you.",
    author: "Steve Jobs",
  },
]

export function QuoteGenerator() {
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
      // Fallback for browsers that don't support Web Share API
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
          <Button onClick={generateNewQuote} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            New Quote
          </Button>

          <Button onClick={handleLike} variant={isLiked ? "default" : "outline"} size="sm">
            <Heart className={`h-4 w-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
            {isLiked ? "Liked" : "Like"}
          </Button>

          <Button onClick={handleShare} variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
