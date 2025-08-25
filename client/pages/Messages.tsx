import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  MessageCircle,
  Users,
  UserPlus,
  Send,
  Search,
  Heart,
  Star,
  Gift,
  Sparkles,
  Zap,
  Online,
  UserCheck,
  UserMinus,
  Plus,
  Hash,
  Crown,
  Loader2,
  MessageSquare,
  Globe,
} from "lucide-react";
import { supabase, type Profile } from "@/lib/supabase";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  sender_name?: string;
  sender_avatar?: string;
}

interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
  following_name?: string;
  following_avatar?: string;
}

interface Community {
  id: string;
  name: string;
  description: string;
  member_count: number;
  is_member: boolean;
  created_at: string;
}

export default function Messages() {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState<
    "messages" | "following" | "communities"
  >("messages");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Messages state
  const [conversations, setConversations] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  // Following state
  const [following, setFollowing] = useState<Follow[]>([]);
  const [followers, setFollowers] = useState<Follow[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Communities state
  const [communities, setCommunities] = useState<Community[]>([]);
  const [showCreateCommunity, setShowCreateCommunity] = useState(false);
  const [newCommunity, setNewCommunity] = useState({
    name: "",
    description: "",
  });

  // Check authentication
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      setUser(session.user);
      await loadData(session.user.id);
    } catch (error: any) {
      console.error(
        "Auth check error:",
        error.message || JSON.stringify(error),
      );
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const loadData = async (userId: string) => {
    await Promise.all([
      loadConversations(userId),
      loadFollowing(userId),
      loadCommunities(userId),
      loadSuggestedUsers(userId),
    ]);
  };

  const loadConversations = async (userId: string) => {
    try {
      // In a real implementation, you'd have a messages table
      // For demo, we'll use mock data
      setConversations([]);
    } catch (error: any) {
      console.error(
        "Error loading conversations:",
        error.message || JSON.stringify(error),
      );
    }
  };

  const loadFollowing = async (userId: string) => {
    try {
      // Mock following data - in real implementation, you'd have follows table
      setFollowing([]);
      setFollowers([]);
    } catch (error: any) {
      console.error(
        "Error loading following:",
        error.message || JSON.stringify(error),
      );
    }
  };

  const loadCommunities = async (userId: string) => {
    try {
      // Mock communities data
      setCommunities([
        {
          id: "1",
          name: "Red Flag Support Group",
          description: "Share and discuss red flag experiences",
          member_count: 156,
          is_member: true,
          created_at: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Green Flag Appreciation",
          description: "Celebrate wholesome relationship moments",
          member_count: 89,
          is_member: false,
          created_at: new Date().toISOString(),
        },
        {
          id: "3",
          name: "First Date Stories",
          description: "Share your first date experiences",
          member_count: 203,
          is_member: true,
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (error: any) {
      console.error(
        "Error loading communities:",
        error.message || JSON.stringify(error),
      );
    }
  };

  const loadSuggestedUsers = async (userId: string) => {
    try {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", userId)
        .limit(6);

      setSuggestedUsers(profiles || []);
    } catch (error: any) {
      console.error(
        "Error loading suggested users:",
        error.message || JSON.stringify(error),
      );
    }
  };

  const followUser = async (targetUserId: string) => {
    if (!user) return;

    try {
      // In real implementation, you'd insert into follows table
      console.log("Following user:", targetUserId);

      // Update UI optimistically
      const targetUser = suggestedUsers.find((u) => u.id === targetUserId);
      if (targetUser) {
        setFollowing((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            follower_id: user.id,
            following_id: targetUserId,
            created_at: new Date().toISOString(),
            following_name: targetUser.name,
            following_avatar: targetUser.avatar_url,
          },
        ]);
      }
    } catch (error: any) {
      console.error(
        "Error following user:",
        error.message || JSON.stringify(error),
      );
    }
  };

  const unfollowUser = async (targetUserId: string) => {
    try {
      setFollowing((prev) =>
        prev.filter((f) => f.following_id !== targetUserId),
      );
    } catch (error: any) {
      console.error(
        "Error unfollowing user:",
        error.message || JSON.stringify(error),
      );
    }
  };

  const joinCommunity = async (communityId: string) => {
    try {
      setCommunities((prev) =>
        prev.map((c) =>
          c.id === communityId
            ? { ...c, is_member: true, member_count: c.member_count + 1 }
            : c,
        ),
      );
    } catch (error: any) {
      console.error(
        "Error joining community:",
        error.message || JSON.stringify(error),
      );
    }
  };

  const leaveCommunity = async (communityId: string) => {
    try {
      setCommunities((prev) =>
        prev.map((c) =>
          c.id === communityId
            ? { ...c, is_member: false, member_count: c.member_count - 1 }
            : c,
        ),
      );
    } catch (error: any) {
      console.error(
        "Error leaving community:",
        error.message || JSON.stringify(error),
      );
    }
  };

  const createCommunity = async () => {
    if (!newCommunity.name.trim()) return;

    try {
      const community: Community = {
        id: Date.now().toString(),
        name: newCommunity.name,
        description: newCommunity.description,
        member_count: 1,
        is_member: true,
        created_at: new Date().toISOString(),
      };

      setCommunities((prev) => [community, ...prev]);
      setNewCommunity({ name: "", description: "" });
      setShowCreateCommunity(false);
    } catch (error: any) {
      console.error(
        "Error creating community:",
        error.message || JSON.stringify(error),
      );
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    setSendingMessage(true);
    try {
      // In real implementation, you'd insert into messages table
      const message: Message = {
        id: Date.now().toString(),
        sender_id: user.id,
        receiver_id: selectedConversation,
        content: newMessage,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, message]);
      setNewMessage("");
    } catch (error: any) {
      console.error(
        "Error sending message:",
        error.message || JSON.stringify(error),
      );
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tea-pink-50 via-tea-green-50 to-tea-mint-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-tea-pink-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-tea-pink-50 via-tea-green-50 to-tea-mint-50">
      {/* Floating decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 text-tea-pink-300 opacity-40 animate-pulse">
          <MessageCircle size={28} />
        </div>
        <div className="absolute top-40 right-20 text-tea-green-400 opacity-50 animate-bounce">
          <Heart size={24} className="animate-pulse delay-100" />
        </div>
        <div className="absolute bottom-32 left-16 text-tea-neutral-400 opacity-60">
          <Sparkles size={20} className="animate-pulse delay-200" />
        </div>
        <div className="absolute top-64 left-1/3 text-tea-pink-200 opacity-30">
          <Star size={16} className="animate-pulse delay-300" />
        </div>
        <div className="absolute bottom-20 right-32 text-tea-green-300 opacity-45">
          <Users size={22} className="animate-pulse delay-75" />
        </div>
        <div className="absolute top-32 left-2/3 text-tea-neutral-300 opacity-35">
          <Gift size={18} className="animate-pulse delay-150" />
        </div>
      </div>

      {/* Navigation */}
      <header className="relative z-10 border-b border-tea-neutral-200 bg-white/95 backdrop-blur-lg shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-tea-neutral-600 hover:text-tea-pink-600 transition-colors p-2 rounded-lg hover:bg-tea-pink-50"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-tea-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-tea-neutral-800">
                  Tea Time
                </h1>
              </div>
              <Badge className="bg-tea-green-100 text-tea-green-700 border-tea-green-300 px-3 py-1">
                <MessageCircle className="w-4 h-4 mr-1" />
                Messages
              </Badge>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className="text-tea-neutral-600 hover:text-tea-pink-600 font-medium transition-colors duration-300 relative group"
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-tea-pink-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                to="/feed"
                className="text-tea-neutral-600 hover:text-tea-pink-600 font-medium transition-colors duration-300 relative group"
              >
                Feed
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-tea-pink-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                to="/trending"
                className="text-tea-neutral-600 hover:text-tea-pink-600 font-medium transition-colors duration-300 relative group"
              >
                Trending
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-tea-pink-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                to="/messages"
                className="text-tea-pink-600 font-medium border-b-2 border-tea-pink-500 pb-1"
              >
                Messages
              </Link>
              <Link
                to="/profile"
                className="text-tea-neutral-600 hover:text-tea-pink-600 font-medium transition-colors duration-300 relative group"
              >
                Profile
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-tea-pink-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-tea-neutral-800 mb-4">
              Connect & Chat 💬
            </h2>
            <p className="text-lg text-tea-neutral-600 max-w-2xl mx-auto">
              Follow users, join communities, and have private conversations
              about your stories
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-2 shadow-lg">
              <div className="flex gap-2">
                <Button
                  variant={currentTab === "messages" ? "default" : "ghost"}
                  onClick={() => setCurrentTab("messages")}
                  className={
                    currentTab === "messages"
                      ? "bg-tea-pink-600 hover:bg-tea-pink-700 text-white"
                      : "text-tea-neutral-600 hover:text-tea-pink-600"
                  }
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Messages
                </Button>
                <Button
                  variant={currentTab === "following" ? "default" : "ghost"}
                  onClick={() => setCurrentTab("following")}
                  className={
                    currentTab === "following"
                      ? "bg-tea-pink-600 hover:bg-tea-pink-700 text-white"
                      : "text-tea-neutral-600 hover:text-tea-pink-600"
                  }
                >
                  <Users className="w-4 h-4 mr-2" />
                  Following
                </Button>
                <Button
                  variant={currentTab === "communities" ? "default" : "ghost"}
                  onClick={() => setCurrentTab("communities")}
                  className={
                    currentTab === "communities"
                      ? "bg-tea-pink-600 hover:bg-tea-pink-700 text-white"
                      : "text-tea-neutral-600 hover:text-tea-pink-600"
                  }
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Communities
                </Button>
              </div>
            </div>
          </div>

          {/* Messages Tab */}
          {currentTab === "messages" && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Conversations List */}
              <Card className="bg-white/85 backdrop-blur-md border-tea-neutral-200 shadow-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-tea-neutral-800 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Conversations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {conversations.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 text-tea-neutral-400 mx-auto mb-4" />
                      <p className="text-tea-neutral-600">
                        No conversations yet
                      </p>
                      <p className="text-sm text-tea-neutral-500 mt-2">
                        Follow users to start messaging!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {conversations.map((conversation) => (
                        <div
                          key={conversation.id}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-tea-pink-50 cursor-pointer transition-colors"
                          onClick={() =>
                            setSelectedConversation(conversation.sender_id)
                          }
                        >
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={conversation.sender_avatar} />
                            <AvatarFallback className="bg-tea-pink-100 text-tea-pink-700">
                              {conversation.sender_name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-tea-neutral-800 truncate">
                              {conversation.sender_name}
                            </p>
                            <p className="text-sm text-tea-neutral-500 truncate">
                              {conversation.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Chat Area */}
              <div className="lg:col-span-2">
                <Card className="bg-white/85 backdrop-blur-md border-tea-neutral-200 shadow-xl rounded-2xl h-[500px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-tea-neutral-800">
                      {selectedConversation ? "Chat" : "Select a conversation"}
                    </CardTitle>
                  </CardHeader>
                  {selectedConversation ? (
                    <>
                      <CardContent className="flex-1 overflow-y-auto">
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.sender_id === user?.id ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[80%] p-3 rounded-2xl ${
                                  message.sender_id === user?.id
                                    ? "bg-tea-pink-600 text-white"
                                    : "bg-tea-neutral-100 text-tea-neutral-800"
                                }`}
                              >
                                <p>{message.content}</p>
                                <p
                                  className={`text-xs mt-1 ${
                                    message.sender_id === user?.id
                                      ? "text-tea-pink-100"
                                      : "text-tea-neutral-500"
                                  }`}
                                >
                                  {new Date(
                                    message.created_at,
                                  ).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <div className="p-4 border-t border-tea-neutral-200">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) =>
                              e.key === "Enter" && sendMessage()
                            }
                            className="flex-1"
                          />
                          <Button
                            onClick={sendMessage}
                            disabled={sendingMessage || !newMessage.trim()}
                            className="bg-tea-pink-600 hover:bg-tea-pink-700 text-white"
                          >
                            {sendingMessage ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Send className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <CardContent className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <MessageCircle className="w-16 h-16 text-tea-neutral-400 mx-auto mb-4" />
                        <p className="text-tea-neutral-600">
                          Select a conversation to start chatting
                        </p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            </div>
          )}

          {/* Following Tab */}
          {currentTab === "following" && (
            <div className="space-y-8">
              {/* Search Users */}
              <Card className="bg-white/85 backdrop-blur-md border-tea-neutral-200 shadow-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-tea-neutral-800 flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Find Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tea-neutral-400 h-5 w-5" />
                    <Input
                      placeholder="Search for users to follow..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suggestedUsers.map((suggestedUser) => {
                      const isFollowing = following.some(
                        (f) => f.following_id === suggestedUser.id,
                      );
                      return (
                        <div
                          key={suggestedUser.id}
                          className="p-4 bg-tea-neutral-50 rounded-xl border border-tea-neutral-200 hover:border-tea-pink-300 transition-colors"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar className="w-12 h-12">
                              <AvatarImage
                                src={suggestedUser.avatar_url || undefined}
                              />
                              <AvatarFallback className="bg-tea-pink-100 text-tea-pink-700">
                                {suggestedUser.name?.charAt(0) || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-tea-neutral-800 truncate">
                                {suggestedUser.name || "Tea Community Member"}
                              </p>
                              <p className="text-sm text-tea-neutral-500">
                                {suggestedUser.email}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() =>
                              isFollowing
                                ? unfollowUser(suggestedUser.id)
                                : followUser(suggestedUser.id)
                            }
                            className={
                              isFollowing
                                ? "w-full bg-tea-neutral-600 hover:bg-tea-neutral-700 text-white"
                                : "w-full bg-tea-pink-600 hover:bg-tea-pink-700 text-white"
                            }
                          >
                            {isFollowing ? (
                              <>
                                <UserMinus className="w-4 h-4 mr-2" />
                                Unfollow
                              </>
                            ) : (
                              <>
                                <UserPlus className="w-4 h-4 mr-2" />
                                Follow
                              </>
                            )}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Following List */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-white/85 backdrop-blur-md border-tea-neutral-200 shadow-xl rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-tea-neutral-800 flex items-center gap-2">
                      <UserCheck className="w-5 h-5" />
                      Following ({following.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {following.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-tea-neutral-400 mx-auto mb-4" />
                        <p className="text-tea-neutral-600">
                          Not following anyone yet
                        </p>
                        <p className="text-sm text-tea-neutral-500 mt-2">
                          Follow users to see their stories and start
                          conversations
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {following.map((follow) => (
                          <div
                            key={follow.id}
                            className="flex items-center gap-3 p-3 bg-tea-neutral-50 rounded-xl"
                          >
                            <Avatar className="w-10 h-10">
                              <AvatarImage
                                src={follow.following_avatar || undefined}
                              />
                              <AvatarFallback className="bg-tea-pink-100 text-tea-pink-700">
                                {follow.following_name?.charAt(0) || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-medium text-tea-neutral-800">
                                {follow.following_name}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                setSelectedConversation(follow.following_id)
                              }
                              className="border-tea-pink-300 text-tea-pink-600 hover:bg-tea-pink-50"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-white/85 backdrop-blur-md border-tea-neutral-200 shadow-xl rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-tea-neutral-800 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Followers ({followers.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {followers.length === 0 ? (
                      <div className="text-center py-8">
                        <Heart className="w-12 h-12 text-tea-neutral-400 mx-auto mb-4" />
                        <p className="text-tea-neutral-600">No followers yet</p>
                        <p className="text-sm text-tea-neutral-500 mt-2">
                          Share engaging stories to gain followers
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {followers.map((follower) => (
                          <div
                            key={follower.id}
                            className="flex items-center gap-3 p-3 bg-tea-neutral-50 rounded-xl"
                          >
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-tea-green-100 text-tea-green-700">
                                F
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-medium text-tea-neutral-800">
                                Follower
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Communities Tab */}
          {currentTab === "communities" && (
            <div className="space-y-6">
              {/* Create Community */}
              <Card className="bg-white/85 backdrop-blur-md border-tea-neutral-200 shadow-xl rounded-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-tea-neutral-800 flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Create Community
                    </CardTitle>
                    <Button
                      size="sm"
                      onClick={() =>
                        setShowCreateCommunity(!showCreateCommunity)
                      }
                      className="bg-tea-green-600 hover:bg-tea-green-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Community
                    </Button>
                  </div>
                </CardHeader>
                {showCreateCommunity && (
                  <CardContent>
                    <div className="space-y-4">
                      <Input
                        placeholder="Community name"
                        value={newCommunity.name}
                        onChange={(e) =>
                          setNewCommunity((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                      <Textarea
                        placeholder="Community description"
                        value={newCommunity.description}
                        onChange={(e) =>
                          setNewCommunity((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={createCommunity}
                          disabled={!newCommunity.name.trim()}
                          className="bg-tea-green-600 hover:bg-tea-green-700 text-white"
                        >
                          Create
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowCreateCommunity(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Communities List */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {communities.map((community) => (
                  <Card
                    key={community.id}
                    className="bg-white/85 backdrop-blur-md border-tea-neutral-200 shadow-xl rounded-2xl hover:shadow-2xl transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Hash className="w-5 h-5 text-tea-green-600" />
                        <CardTitle className="text-tea-neutral-800 text-lg">
                          {community.name}
                        </CardTitle>
                      </div>
                      <p className="text-tea-neutral-600 text-sm">
                        {community.description}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-tea-neutral-500" />
                          <span className="text-sm text-tea-neutral-600">
                            {community.member_count} members
                          </span>
                        </div>
                        {community.is_member && (
                          <Badge className="bg-tea-green-100 text-tea-green-700">
                            <Crown className="w-3 h-3 mr-1" />
                            Member
                          </Badge>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() =>
                          community.is_member
                            ? leaveCommunity(community.id)
                            : joinCommunity(community.id)
                        }
                        className={
                          community.is_member
                            ? "w-full bg-tea-neutral-600 hover:bg-tea-neutral-700 text-white"
                            : "w-full bg-tea-green-600 hover:bg-tea-green-700 text-white"
                        }
                      >
                        {community.is_member ? (
                          <>
                            <UserMinus className="w-4 h-4 mr-2" />
                            Leave
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Join
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
