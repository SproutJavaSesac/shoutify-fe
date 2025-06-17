"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Upload, X, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"

const categories = ["Classical Poetry", "Biblical", "Modern Poem", "Prose", "Haiku", "Sonnet", "Free Verse"]

const emotions = [
  "joyful",
  "melancholy",
  "romantic",
  "contemplative",
  "inspiring",
  "nostalgic",
  "peaceful",
  "passionate",
]

const emotionColors = {
  joyful: "bg-yellow-100 text-yellow-800",
  melancholy: "bg-blue-100 text-blue-800",
  romantic: "bg-pink-100 text-pink-800",
  contemplative: "bg-purple-100 text-purple-800",
  inspiring: "bg-green-100 text-green-800",
  nostalgic: "bg-orange-100 text-orange-800",
  peaceful: "bg-teal-100 text-teal-800",
  passionate: "bg-red-100 text-red-800",
}

export function PostCreationForm() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [emotion, setEmotion] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { user } = useAuth()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
    }
  }

  const removeImage = () => {
    setImage(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !category) {
      toast({
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate AI transformation
    setTimeout(() => {
      toast({
        description: "Your post has been created and transformed!",
      })
      router.push("/post/1") // Redirect to the new post
    }, 2000)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5" />
            <span>Write Your Story</span>
          </CardTitle>
          {user && (
            <p className="text-sm text-gray-600">
              Posting as <span className="font-medium">@{user.username}</span>
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your post title..."
              maxLength={100}
            />
            <p className="text-sm text-gray-500">{100 - title.length} characters remaining</p>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your thoughts here. They will be transformed into beautiful literary prose..."
              className="min-h-[200px]"
              maxLength={2000}
            />
            <p className="text-sm text-gray-500">{2000 - content.length} characters remaining</p>
          </div>

          {/* Emotion Selection */}
          <div className="space-y-2">
            <Label>Emotion (Optional)</Label>
            <p className="text-sm text-gray-600 mb-3">
              Select an emotion to guide the AI transformation, or leave blank for automatic detection
            </p>
            <div className="flex flex-wrap gap-2">
              {emotions.map((emo) => (
                <Badge
                  key={emo}
                  className={`cursor-pointer transition-all ${
                    emotion === emo
                      ? emotionColors[emo as keyof typeof emotionColors]
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setEmotion(emotion === emo ? "" : emo)}
                >
                  {emo}
                </Badge>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Image (Optional)</Label>
            {!image ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Upload an image to accompany your post</p>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <Button type="button" variant="outline" size="sm">
                    Choose File
                  </Button>
                </Label>
              </div>
            ) : (
              <div className="relative">
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{image.name}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={removeImage}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> You cannot edit this post after publishing. Please review your content carefully.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !title.trim() || !content.trim() || !category}
              className="bg-gray-800 hover:bg-gray-900"
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Transforming...
                </>
              ) : (
                "Publish Post"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
