"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Flag, Users, Settings, Eye, Check, X, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const pendingReports = [
  {
    id: 1,
    type: "post",
    title: "Controversial Literary Piece",
    author: "SomeUser",
    reportCount: 3,
    reasons: ["Inappropriate language", "Hate speech"],
    content: "This is the reported content that needs review...",
    reportedAt: "2 hours ago",
  },
  {
    id: 2,
    type: "post",
    title: "Spam Advertisement",
    author: "SpamUser",
    reportCount: 5,
    reasons: ["Spam/Advertisement"],
    content: "Buy our amazing products now! Visit our website...",
    reportedAt: "4 hours ago",
  },
  {
    id: 3,
    type: "comment",
    postTitle: "Beautiful Poetry",
    author: "BadCommenter",
    reportCount: 2,
    reasons: ["Inappropriate language"],
    content: "This comment contains inappropriate language...",
    reportedAt: "1 hour ago",
  },
]

const processedReports = [
  {
    id: 4,
    type: "post",
    title: "Previously Reported Post",
    author: "ReportedUser",
    reportCount: 2,
    reasons: ["Inappropriate language"],
    status: "accepted",
    content: "This content was found to violate guidelines...",
    reportedAt: "1 day ago",
    processedAt: "1 day ago",
  },
  {
    id: 5,
    type: "comment",
    postTitle: "Some Post Title",
    author: "CommentUser",
    reportCount: 1,
    reasons: ["Spam"],
    status: "rejected",
    content: "This comment was reported but found to be acceptable...",
    reportedAt: "2 days ago",
    processedAt: "2 days ago",
  },
]

const users = [
  {
    id: 1,
    username: "LiteraryMuse",
    email: "user@example.com",
    posts: 23,
    joinDate: "March 2024",
    reports: 0,
  },
  {
    id: 2,
    username: "SpamUser",
    email: "spam@example.com",
    posts: 5,
    joinDate: "December 2024",
    reports: 8,
  },
]

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState("pending-reports")
  const { toast } = useToast()

  const handleReportAction = (id: number, action: "accept" | "reject", type: "post" | "comment") => {
    toast({
      description: `${type} report ${action}ed successfully`,
    })
  }

  const handleUserAction = (id: number, action: "delete") => {
    toast({
      description: `User ${action}d successfully`,
    })
  }

  const ReportCard = ({ report, showActions = true }: { report: any; showActions?: boolean }) => (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">
            {report.type === "post" ? report.title : `Comment on "${report.postTitle}"`}
          </h3>
          <p className="text-sm text-gray-600">
            by {report.author} • {report.reportedAt}
            {report.processedAt && ` • Processed ${report.processedAt}`}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" />
            {report.reportCount} reports
          </Badge>
          {report.status && (
            <Badge variant={report.status === "accepted" ? "destructive" : "default"}>{report.status}</Badge>
          )}
        </div>
      </div>

      <div className="mb-3">
        <p className="text-sm text-gray-700 mb-2">Reported for:</p>
        <div className="flex flex-wrap gap-1">
          {report.reasons.map((reason: string, index: number) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {reason}
            </Badge>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 p-3 rounded mb-3">
        <p className="text-sm text-gray-800">{report.content}</p>
      </div>

      {showActions && (
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={() => handleReportAction(report.id, "accept", report.type)}>
            <Check className="h-4 w-4 mr-1" />
            Accept Report
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleReportAction(report.id, "reject", report.type)}>
            <X className="h-4 w-4 mr-1" />
            Reject Report
          </Button>
          <Button size="sm" variant="outline">
            <Eye className="h-4 w-4 mr-1" />
            View Full {report.type === "post" ? "Post" : "Comment"}
          </Button>
        </div>
      )}
    </div>
  )

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="pending-reports">Pending Reports</TabsTrigger>
        <TabsTrigger value="report-results">Report Results</TabsTrigger>
        <TabsTrigger value="users">User Management</TabsTrigger>
        <TabsTrigger value="ai-prompts">AI Prompts</TabsTrigger>
      </TabsList>

      <TabsContent value="pending-reports" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Flag className="h-5 w-5" />
              <span>Pending Reports</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingReports.map((report) => (
                <ReportCard key={report.id} report={report} showActions={true} />
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="report-results" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Flag className="h-5 w-5" />
              <span>Report Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {processedReports.map((report) => (
                <ReportCard key={report.id} report={report} showActions={false} />
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
                      <Button size="sm" variant="destructive" onClick={() => handleUserAction(user.id, "delete")}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="ai-prompts" className="space-y-6">
        {/* Add New AI Prompt */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Add New AI Prompt Rule</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="profanity">Profanity/Inappropriate Word</Label>
                <Input id="profanity" placeholder="Enter word to filter..." className="w-full" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="replacement">Replacement Word</Label>
                <Input id="replacement" placeholder="Enter replacement..." className="w-full" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="explanation">Explanation</Label>
                <Textarea id="explanation" placeholder="Why this replacement..." className="w-full" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button>Add AI Prompt Rule</Button>
            </div>
          </CardContent>
        </Card>

        {/* Existing AI Prompts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Registered AI Prompt Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  id: 1,
                  profanity: "damn",
                  replacement: "darn",
                  explanation: "Mild profanity replacement",
                  createdAt: "2024-12-17 10:30",
                },
                {
                  id: 2,
                  profanity: "stupid",
                  replacement: "unwise",
                  explanation: "More literary alternative",
                  createdAt: "2024-12-17 09:15",
                },
                {
                  id: 3,
                  profanity: "hate",
                  replacement: "dislike",
                  explanation: "Softer emotional expression",
                  createdAt: "2024-12-17 08:45",
                },
              ].map((rule) => (
                <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Profanity</p>
                        <p className="text-gray-900">{rule.profanity}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Replacement</p>
                        <p className="text-gray-900">{rule.replacement}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Explanation</p>
                        <p className="text-gray-900">{rule.explanation}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <p className="text-xs text-gray-500">{rule.createdAt}</p>
                      <Button size="sm" variant="destructive">
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
