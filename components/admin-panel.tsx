"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Flag, Users, Settings, Eye, Check, X, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const reportedPosts = [
  {
    id: 1,
    title: "Controversial Literary Piece",
    author: "SomeUser",
    reportCount: 3,
    reasons: ["Inappropriate language", "Hate speech"],
    status: "pending",
    content: "This is the reported content that needs review...",
    reportedAt: "2 hours ago",
  },
  {
    id: 2,
    title: "Spam Advertisement",
    author: "SpamUser",
    reportCount: 5,
    reasons: ["Spam/Advertisement"],
    status: "pending",
    content: "Buy our amazing products now! Visit our website...",
    reportedAt: "4 hours ago",
  },
]

const reportedComments = [
  {
    id: 1,
    postTitle: "Beautiful Poetry",
    author: "BadCommenter",
    reportCount: 2,
    reasons: ["Inappropriate language"],
    status: "pending",
    content: "This comment contains inappropriate language...",
    reportedAt: "1 hour ago",
  },
]

const users = [
  {
    id: 1,
    username: "LiteraryMuse",
    email: "user@example.com",
    posts: 23,
    joinDate: "March 2024",
    status: "active",
    reports: 0,
  },
  {
    id: 2,
    username: "SpamUser",
    email: "spam@example.com",
    posts: 5,
    joinDate: "December 2024",
    status: "suspended",
    reports: 8,
  },
]

const aiPrompts = {
  classical: "Transform the following text into classical poetry style with elegant language and formal structure...",
  biblical: "Rewrite the following in a biblical, reverent tone with spiritual undertones...",
  modern: "Convert this text into modern poetry with contemporary language and free verse...",
}

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState("reports")
  const { toast } = useToast()

  const handleReportAction = (id: number, action: "accept" | "reject", type: "post" | "comment") => {
    toast({
      description: `${type} report ${action}ed successfully`,
    })
  }

  const handleUserAction = (id: number, action: "suspend" | "activate" | "delete") => {
    toast({
      description: `User ${action}d successfully`,
    })
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="reports">Reported Content</TabsTrigger>
        <TabsTrigger value="users">User Management</TabsTrigger>
        <TabsTrigger value="ai">AI Prompts</TabsTrigger>
      </TabsList>

      <TabsContent value="reports" className="space-y-6">
        {/* Reported Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Flag className="h-5 w-5" />
              <span>Reported Posts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportedPosts.map((post) => (
                <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{post.title}</h3>
                      <p className="text-sm text-gray-600">
                        by {post.author} • {post.reportedAt}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="destructive">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {post.reportCount} reports
                      </Badge>
                      <Badge variant="outline">{post.status}</Badge>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-gray-700 mb-2">Reported for:</p>
                    <div className="flex flex-wrap gap-1">
                      {post.reasons.map((reason, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {reason}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded mb-3">
                    <p className="text-sm text-gray-800">{post.content}</p>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleReportAction(post.id, "accept", "post")}>
                      <Check className="h-4 w-4 mr-1" />
                      Accept Report
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleReportAction(post.id, "reject", "post")}>
                      <X className="h-4 w-4 mr-1" />
                      Reject Report
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View Full Post
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reported Comments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Flag className="h-5 w-5" />
              <span>Reported Comments</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportedComments.map((comment) => (
                <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">Comment on "{comment.postTitle}"</h3>
                      <p className="text-sm text-gray-600">
                        by {comment.author} • {comment.reportedAt}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="destructive">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {comment.reportCount} reports
                      </Badge>
                      <Badge variant="outline">{comment.status}</Badge>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-gray-700 mb-2">Reported for:</p>
                    <div className="flex flex-wrap gap-1">
                      {comment.reasons.map((reason, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {reason}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded mb-3">
                    <p className="text-sm text-gray-800">{comment.content}</p>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReportAction(comment.id, "accept", "comment")}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Accept Report
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReportAction(comment.id, "reject", "comment")}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject Report
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="users">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>User Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.username}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>{user.posts} posts</span>
                        <span>Joined {user.joinDate}</span>
                        <span>{user.reports} reports</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={user.status === "active" ? "default" : "destructive"}>{user.status}</Badge>
                      <div className="flex space-x-1">
                        {user.status === "active" ? (
                          <Button size="sm" variant="outline" onClick={() => handleUserAction(user.id, "suspend")}>
                            Suspend
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => handleUserAction(user.id, "activate")}>
                            Activate
                          </Button>
                        )}
                        <Button size="sm" variant="destructive" onClick={() => handleUserAction(user.id, "delete")}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="ai">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>AI Prompting Rules</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(aiPrompts).map(([category, prompt]) => (
              <div key={category} className="space-y-2">
                <label className="text-sm font-medium text-gray-700 capitalize">{category} Poetry Prompt</label>
                <Textarea
                  value={prompt}
                  className="min-h-[100px]"
                  placeholder={`Enter the AI prompt for ${category} style transformation...`}
                />
              </div>
            ))}

            <div className="flex justify-end">
              <Button>Save AI Prompts</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
