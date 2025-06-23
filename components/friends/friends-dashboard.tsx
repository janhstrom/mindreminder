"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, UserPlus, Mail, Check, X, Search, Share, Bell, Heart } from "lucide-react"
import {
  FriendsService,
  type Friend,
  type FriendRequest,
  type SharedReminder,
  type FriendNotification,
} from "@/lib/friends-service"
import type { AuthUser } from "@/lib/auth-supabase"
import { Analytics } from "@/lib/analytics"

interface FriendsDashboardProps {
  user: AuthUser
}

export function FriendsDashboard({ user }: FriendsDashboardProps) {
  const [friends, setFriends] = useState<Friend[]>([])
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])
  const [sharedReminders, setSharedReminders] = useState<SharedReminder[]>([])
  const [notifications, setNotifications] = useState<FriendNotification[]>([])
  const [searchEmail, setSearchEmail] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("friends")

  const friendsService = FriendsService.getInstance()

  useEffect(() => {
    loadData()
  }, [user.id])

  const loadData = async () => {
    try {
      const [friendsData, requestsData, sharedData, notificationsData] = await Promise.all([
        friendsService.getFriends(user.id),
        friendsService.getFriendRequests(user.id),
        friendsService.getSharedReminders(user.id),
        friendsService.getNotifications(user.id),
      ])

      setFriends(friendsData)
      setFriendRequests(requestsData)
      setSharedReminders(sharedData)
      setNotifications(notificationsData)
    } catch (error) {
      console.error("Error loading friends data:", error)
    }
  }

  const handleSearchUsers = async () => {
    if (!searchEmail.trim()) return

    setIsLoading(true)
    try {
      const results = await friendsService.searchUsersByEmail(searchEmail)
      setSearchResults(results.filter((result) => result.id !== user.id))
    } catch (error) {
      console.error("Error searching users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendFriendRequest = async (friendEmail: string) => {
    try {
      await friendsService.sendFriendRequest(user.id, friendEmail)
      Analytics.event("friend_request_sent", { event_category: "social" })
      setSearchEmail("")
      setSearchResults([])
      // Optionally show success message
    } catch (error) {
      console.error("Error sending friend request:", error)
      // Show error message to user
    }
  }

  const handleAcceptFriendRequest = async (requestId: string) => {
    try {
      await friendsService.acceptFriendRequest(user.id, requestId)
      Analytics.event("friend_request_accepted", { event_category: "social" })
      loadData()
    } catch (error) {
      console.error("Error accepting friend request:", error)
    }
  }

  const handleDeclineFriendRequest = async (requestId: string) => {
    try {
      await friendsService.declineFriendRequest(user.id, requestId)
      Analytics.event("friend_request_declined", { event_category: "social" })
      loadData()
    } catch (error) {
      console.error("Error declining friend request:", error)
    }
  }

  const handleRemoveFriend = async (friendId: string) => {
    try {
      await friendsService.removeFriend(user.id, friendId)
      Analytics.event("friend_removed", { event_category: "social" })
      loadData()
    } catch (error) {
      console.error("Error removing friend:", error)
    }
  }

  const unreadNotifications = notifications.filter((n) => !n.isRead).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Friends</h2>
          <p className="text-muted-foreground">Connect with friends and share meaningful reminders</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            <Users className="h-3 w-3 mr-1" />
            {friends.length} Friends
          </Badge>
          {unreadNotifications > 0 && (
            <Badge variant="destructive">
              <Bell className="h-3 w-3 mr-1" />
              {unreadNotifications} New
            </Badge>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="friends">Friends ({friends.length})</TabsTrigger>
          <TabsTrigger value="requests">Requests ({friendRequests.length})</TabsTrigger>
          <TabsTrigger value="shared">Shared ({sharedReminders.length})</TabsTrigger>
          <TabsTrigger value="add">Add Friends</TabsTrigger>
        </TabsList>

        <TabsContent value="friends" className="space-y-4">
          {friends.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No friends yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start connecting with friends to share meaningful reminders
                  </p>
                  <Button onClick={() => setActiveTab("add")}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Friends
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {friends.map((friend) => (
                <Card key={friend.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={friend.profileImage || "/placeholder.svg"} />
                        <AvatarFallback>
                          {friend.firstName[0]}
                          {friend.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium">
                          {friend.firstName} {friend.lastName}
                        </h4>
                        <p className="text-sm text-muted-foreground">{friend.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Share className="h-3 w-3 mr-1" />
                        Share
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveFriend(friend.friendId)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          {friendRequests.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No friend requests</h3>
                  <p className="text-muted-foreground">
                    Friend requests will appear here when someone wants to connect with you
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {friendRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={request.fromProfileImage || "/placeholder.svg"} />
                          <AvatarFallback>
                            {request.fromFirstName[0]}
                            {request.fromLastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">
                            {request.fromFirstName} {request.fromLastName}
                          </h4>
                          <p className="text-sm text-muted-foreground">{request.fromEmail}</p>
                          <p className="text-xs text-muted-foreground">
                            Sent {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleAcceptFriendRequest(request.id)}>
                          <Check className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeclineFriendRequest(request.id)}>
                          <X className="h-4 w-4 mr-1" />
                          Decline
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="shared" className="space-y-4">
          {sharedReminders.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No shared reminders</h3>
                  <p className="text-muted-foreground">Reminders shared by your friends will appear here</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {sharedReminders.map((shared) => (
                <Card key={shared.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{shared.reminderTitle}</h4>
                          <p className="text-sm text-muted-foreground">
                            Shared by {shared.sharerFirstName} {shared.sharerLastName}
                          </p>
                        </div>
                        {!shared.isRead && (
                          <Badge variant="destructive" className="text-xs">
                            New
                          </Badge>
                        )}
                      </div>

                      {shared.reminderDescription && <p className="text-sm">{shared.reminderDescription}</p>}

                      {shared.message && (
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <p className="text-sm italic">"{shared.message}"</p>
                        </div>
                      )}

                      {shared.reminderImage && (
                        <img
                          src={shared.reminderImage || "/placeholder.svg"}
                          alt="Shared reminder"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      )}

                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>Shared {new Date(shared.createdAt).toLocaleDateString()}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => friendsService.markSharedReminderAsRead(user.id, shared.id)}
                        >
                          Mark as Read
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="add" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Add Friends
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter friend's email address"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearchUsers()}
                />
                <Button onClick={handleSearchUsers} disabled={isLoading}>
                  <Search className="h-4 w-4 mr-2" />
                  {isLoading ? "Searching..." : "Search"}
                </Button>
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Search Results:</h4>
                  {searchResults.map((result) => (
                    <div key={result.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={result.profileImage || "/placeholder.svg"} />
                          <AvatarFallback>
                            {result.firstName[0]}
                            {result.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {result.firstName} {result.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">{result.email}</p>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => handleSendFriendRequest(result.email)}>
                        <UserPlus className="h-4 w-4 mr-1" />
                        Add Friend
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
