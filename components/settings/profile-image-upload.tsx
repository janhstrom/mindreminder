"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Camera, X, Check } from "lucide-react"
import { Analytics } from "@/lib/analytics"

interface ProfileImageUploadProps {
  currentImage?: string
  userName: string
  onImageChange: (imageUrl: string) => void
}

export function ProfileImageUpload({ currentImage, userName, onImageChange }: ProfileImageUploadProps) {
  const [imageUrl, setImageUrl] = useState(currentImage || "")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be smaller than 5MB")
      return
    }

    setIsUploading(true)
    setUploadError("")

    try {
      // Convert to base64 for demo purposes
      // In a real app, you'd upload to a service like Supabase Storage, Cloudinary, etc.
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        setImageUrl(base64)
        onImageChange(base64)
        setUploadSuccess(true)
        setTimeout(() => setUploadSuccess(false), 3000)

        Analytics.event("profile_image_uploaded", {
          method: "file_upload",
          file_size: file.size,
          file_type: file.type,
          event_category: "profile",
        })
      }
      reader.readAsDataURL(file)
    } catch (error) {
      setUploadError("Failed to upload image. Please try again.")
      console.error("Upload error:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setImageUrl("")
    onImageChange("")
    Analytics.event("profile_image_removed", {
      event_category: "profile",
    })
  }

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Profile Image
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sleek Profile Image Upload */}
        <div className="flex items-center space-x-4">
          <div className="relative cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
            <Avatar className="h-24 w-24 border-2 border-dashed border-muted-foreground/25 group-hover:border-primary/50 transition-colors">
              <AvatarImage src={imageUrl || "/placeholder.svg"} alt={userName} />
              <AvatarFallback className="text-lg bg-muted group-hover:bg-muted/80">
                {imageUrl ? initials : <Camera className="h-8 w-8 text-muted-foreground" />}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
              <Camera className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-2">Click on the image to upload a new profile picture</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? "Uploading..." : "Choose File"}
              </Button>
              {imageUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveImage}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="h-3 w-3 mr-1" />
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFileUpload(file)
          }}
          className="hidden"
        />

        {/* Status Messages */}
        {uploadError && (
          <Alert className="border-destructive/50 bg-destructive/10">
            <AlertDescription className="text-destructive">{uploadError}</AlertDescription>
          </Alert>
        )}

        {uploadSuccess && (
          <Alert className="border-green-500/50 bg-green-50 dark:bg-green-950/20">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700 dark:text-green-300">
              Profile image updated successfully!
            </AlertDescription>
          </Alert>
        )}

        {/* Guidelines */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Supported formats: JPG, PNG, GIF, WebP</p>
          <p>• Maximum file size: 5MB</p>
          <p>• Recommended size: 400x400 pixels</p>
          <p>• Square images work best</p>
        </div>
      </CardContent>
    </Card>
  )
}
