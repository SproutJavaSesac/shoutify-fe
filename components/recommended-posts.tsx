import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle } from "lucide-react"
import Link from "next/link"

const recommendedPosts = [
  {
    id: 2,
    title: "Echoes of Joy in Morning's First Light",
    author: "PoetryLover",
    emotion: "happy",
    reactions: 38,
    comments: 8,
  },
  {
    id: 3,
    title: "The Solitude of Stars",
    author: "NightWriter",
    emotion: "sad",
    reactions: 52,
    comments: 15,
  },
  {
    id: 4,
    title: "Love's Gentle Refrain",
    author: "RomanticSoul",
    emotion: "happy",
    reactions: 67,
    comments: 22,
  },
]

const emotionColors = {
  happy: "bg-yellow-100 text-yellow-800",
  sad: "bg-blue-100 text-blue-800",
  angry: "bg-red-100 text-red-800",
}

export function RecommendedPosts() {
  return (
    <section className="mb-8">
      <Card>
        <CardHeader>
          <CardTitle>You may also like</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendedPosts.map((post) => (
              <Link key={post.id} href={`/post/${post.id}`} className="block">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="px-4 py-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{post.title}</h3>
                        <span className="text-sm text-gray-600 whitespace-nowrap">{post.author}</span>
                        <Badge
                          className={`${emotionColors[post.emotion as keyof typeof emotionColors]} whitespace-nowrap`}
                        >
                          {post.emotion}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-gray-500 flex-shrink-0">
                        <span className="flex items-center space-x-1">
                          <Heart className="h-3 w-3" />
                          <span>{post.reactions}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageCircle className="h-3 w-3" />
                          <span>{post.comments}</span>
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
