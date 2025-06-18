"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Award, PenTool, Heart, Bookmark } from "lucide-react"
import Link from "next/link"

interface UserProfileModalProps {
  isOpen: boolean
  onClose: () => void
  username: string
}

// Mock user data - in real app, this would come from API
const getUserData = (username: string) => ({
  username,
  name: username === "LiteraryMuse" ? "Literary Muse" : username,
  avatar: "/placeholder.svg?height=80&width=80",
  joinedDate: "March 2024",
  totalPosts: 23,
  totalReactions: 456,
  totalBookmarks: 234,
  badges: [
    { name: "First Post", icon: "🎉" },
    { name: "Poet Laureate", icon: "👑" },
    { name: "Popular Writer", icon: "❤️" },
  ],
  bio: "Passionate about transforming everyday thoughts into literary art. Lover of autumn, poetry, and the written word.",
})

export function UserProfileModal({ isOpen, onClose, username }: UserProfileModalProps) {
  const userData = getUserData(username)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>User Profile</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Profile Header */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
              <AvatarFallback className="text-lg">{userData.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900">{userData.name}</h3>
              <p className="text-gray-600">@{userData.username}</p>
              <p className="text-sm text-gray-500">Member since {userData.joinedDate}</p>
            </div>
          </div>

          {/* Bio */}
          {userData.bio && (
            <div>
              <p className="text-sm text-gray-700">{userData.bio}</p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-gray-200">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <PenTool className="h-4 w-4 text-gray-500 mr-1" />
              </div>
              <div className="text-lg font-bold text-gray-900">{userData.totalPosts}</div>
              <div className="text-xs text-gray-600">Posts</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Heart className="h-4 w-4 text-gray-500 mr-1" />
              </div>
              <div className="text-lg font-bold text-gray-900">{userData.totalReactions}</div>
              <div className="text-xs text-gray-600">Reactions</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Bookmark className="h-4 w-4 text-gray-500 mr-1" />
              </div>
              <div className="text-lg font-bold text-gray-900">{userData.totalBookmarks}</div>
              <div className="text-xs text-gray-600">Bookmarks</div>
            </div>
          </div>

          {/* Badges */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Award className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Recent Badges</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {userData.badges.map((badge, index) => (
                <Badge key={index} className="bg-yellow-100 text-yellow-800">
                  <span className="mr-1">{badge.icon}</span>
                  {badge.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2 pt-4">
            <Link href={`/profile/user/${username}`} className="flex-1">
              <Button className="w-full" onClick={onClose}>
                View Full Profile
              </Button>
            </Link>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
