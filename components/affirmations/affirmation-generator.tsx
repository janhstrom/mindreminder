"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Copy, Heart, RefreshCw } from "lucide-react"

type AffirmationCategory =
  | "self-love"
  | "confidence"
  | "success"
  | "health"
  | "abundance"
  | "peace"
  | "growth"
  | "relationships"

interface AffirmationGeneratorProps {
  user?: any
}

export function AffirmationGenerator({ user }: AffirmationGeneratorProps) {
  const [selectedCategory, setSelectedCategory] = useState<AffirmationCategory>("self-love")
  const [currentAffirmation, setCurrentAffirmation] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const affirmations: Record<AffirmationCategory, string[]> = {
    "self-love": [
      "I am worthy of love and respect exactly as I am",
      "I choose to be kind and patient with myself today",
      "I celebrate my unique qualities and embrace my authentic self",
      "I am enough, and I have everything I need within me",
      "I treat myself with the same compassion I show others",
    ],
    confidence: [
      "I trust in my abilities and believe in my potential",
      "I am capable of handling whatever comes my way",
      "I speak my truth with confidence and clarity",
      "I am brave enough to step outside my comfort zone",
      "I radiate confidence and attract positive opportunities",
    ],
    success: [
      "I am creating the life I desire through my daily actions",
      "Success flows to me naturally and effortlessly",
      "I am focused, determined, and committed to my goals",
      "Every challenge is an opportunity for growth and learning",
      "I celebrate my progress and acknowledge my achievements",
    ],
    health: [
      "My body is strong, healthy, and full of vitality",
      "I nourish my body with healthy choices and self-care",
      "I listen to my body and give it what it needs",
      "I am grateful for my body and all it does for me",
      "I choose habits that support my physical and mental well-being",
    ],
    abundance: [
      "I am open to receiving all the good life has to offer",
      "Abundance flows to me from expected and unexpected sources",
      "I am grateful for the prosperity in my life",
      "I attract opportunities that align with my highest good",
      "I deserve to live a life of abundance and joy",
    ],
    peace: [
      "I am calm, centered, and at peace with myself",
      "I release what I cannot control and focus on what I can",
      "I choose peace over worry in every situation",
      "I breathe deeply and let go of stress and tension",
      "I create a peaceful environment within and around me",
    ],
    growth: [
      "I am constantly growing and evolving into my best self",
      "I embrace change as an opportunity for growth",
      "I learn something valuable from every experience",
      "I am open to new perspectives and possibilities",
      "I trust the process of my personal development",
    ],
    relationships: [
      "I attract loving, supportive relationships into my life",
      "I communicate with love, honesty, and respect",
      "I am surrounded by people who appreciate and value me",
      "I give and receive love freely and openly",
      "I create meaningful connections with others",
    ],
  }

  const handleGenerateAffirmation = () => {
    setIsGenerating(true)

    // Simulate generation delay
    setTimeout(() => {
      const categoryAffirmations = affirmations[selectedCategory]
      const randomAffirmation = categoryAffirmations[Math.floor(Math.random() * categoryAffirmations.length)]
      setCurrentAffirmation(randomAffirmation)
      setIsGenerating(false)
    }, 800)
  }

  const handleCopyAffirmation = () => {
    if (currentAffirmation) {
      navigator.clipboard.writeText(currentAffirmation)
    }
  }

  const categories: { value: AffirmationCategory; label: string; emoji: string }[] = [
    { value: "self-love", label: "Self-Love", emoji: "💖" },
    { value: "confidence", label: "Confidence", emoji: "💪" },
    { value: "success", label: "Success", emoji: "🌟" },
    { value: "health", label: "Health", emoji: "🌱" },
    { value: "abundance", label: "Abundance", emoji: "✨" },
    { value: "peace", label: "Peace", emoji: "🕊️" },
    { value: "growth", label: "Growth", emoji: "🌿" },
    { value: "relationships", label: "Relationships", emoji: "🤝" },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-pink-500" />
            Personal Affirmations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Choose a focus area:</label>
            <Select
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value as AffirmationCategory)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <span className="flex items-center gap-2">
                      <span>{category.emoji}</span>
                      <span>{category.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleGenerateAffirmation} disabled={isGenerating} className="w-full">
            <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
            {isGenerating ? "Creating your affirmation..." : "Generate Affirmation"}
          </Button>
        </CardContent>
      </Card>

      {currentAffirmation && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <Badge variant="secondary" className="capitalize">
                  {categories.find((c) => c.value === selectedCategory)?.emoji} {selectedCategory.replace("-", " ")}
                </Badge>
              </div>

              <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg border-l-4 border-pink-400">
                <p className="text-lg font-medium text-center text-gray-800 leading-relaxed">{currentAffirmation}</p>
              </div>

              <div className="flex gap-2 justify-center">
                {user && (
                  <Button size="sm" variant="outline">
                    <Heart className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={handleCopyAffirmation}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
                <Button size="sm" variant="outline" onClick={handleGenerateAffirmation}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  New One
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
