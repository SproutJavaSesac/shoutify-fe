"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Share2, Copy, Facebook, Twitter, MessageCircle } from "lucide-react"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  postTitle: string
  postId: string | number
}

export function ShareModal({ isOpen, onClose, postTitle, postId }: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const postUrl = `${window.location.origin}/post/${postId}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl)
      setCopied(true)
      toast({
        description: "Link copied to clipboard!",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        description: "Failed to copy link",
        variant: "destructive",
      })
    }
  }

  const handleSocialShare = (platform: string) => {
    const encodedTitle = encodeURIComponent(postTitle)
    const encodedUrl = encodeURIComponent(postUrl)

    let shareUrl = ""
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`
        break
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break
      case "kakao":
        // KakaoTalk sharing would require Kakao SDK integration
        toast({
          description: "KakaoTalk sharing will be available soon",
        })
        return
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Share2 className="h-5 w-5" />
            <span>Share Post</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">"{postTitle}"</p>
          </div>

          {/* Copy Link */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Copy Link</label>
            <div className="flex space-x-2">
              <Input value={postUrl} readOnly className="flex-1" />
              <Button onClick={handleCopyLink} variant="outline">
                <Copy className="h-4 w-4 mr-1" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>

          {/* Social Share */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Share on Social Media</label>
            <div className="flex space-x-2">
              <Button
                onClick={() => handleSocialShare("twitter")}
                variant="outline"
                className="flex-1 flex items-center justify-center space-x-2"
              >
                <Twitter className="h-4 w-4" />
                <span>Twitter</span>
              </Button>
              <Button
                onClick={() => handleSocialShare("facebook")}
                variant="outline"
                className="flex-1 flex items-center justify-center space-x-2"
              >
                <Facebook className="h-4 w-4" />
                <span>Facebook</span>
              </Button>
              <Button
                onClick={() => handleSocialShare("kakao")}
                variant="outline"
                className="flex-1 flex items-center justify-center space-x-2 bg-yellow-400 hover:bg-yellow-500 border-yellow-400"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Kakao</span>
              </Button>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
