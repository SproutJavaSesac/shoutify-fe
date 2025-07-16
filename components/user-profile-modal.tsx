"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Award, BarChart } from "lucide-react";

export function UserProfileModal({ isOpen, onClose, userData }) {
  if (!userData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {userData.name}'s Profile
          </DialogTitle>
        </DialogHeader>
        <div className="mt-6">
          {/* Profile Header */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={userData.avatar || "/placeholder.svg"}
                alt={userData.name}
              />
              <AvatarFallback className="text-lg">
                {userData.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{userData.name}</h2>
                <Button size="sm">Follow</Button>
              </div>
              <p className="text-sm text-gray-500">
                Member since {userData.joinedDate}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xl font-bold">{userData.stats.followers}</p>
              <p className="text-sm text-gray-500">Followers</p>
            </div>
            <div>
              <p className="text-xl font-bold">{userData.stats.following}</p>
              <p className="text-sm text-gray-500">Following</p>
            </div>
            <div>
              <p className="text-xl font-bold">{userData.stats.posts}</p>
              <p className="text-sm text-gray-500">Posts</p>
            </div>
          </div>

          {/* Badges */}
          <div className="mt-6">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Recent Badges
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {userData.badges.map((badge, index) => (
                <Badge key={index} variant="secondary">
                  {badge}
                </Badge>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-6">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Recent Activity
              </span>
            </div>
            <ul className="space-y-2">
              {userData.recentActivity.map((activity, index) => (
                <li key={index} className="text-sm text-gray-600">
                  {activity}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
