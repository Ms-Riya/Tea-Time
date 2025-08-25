import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Heart,
  ArrowLeft,
  Zap,
  Users,
  MessageCircle,
  Flag,
  Loader2,
  UserPlus,
  UserMinus,
  Eye,
  EyeOff,
  Crown,
} from "lucide-react";
import { supabase, type Story } from "@/lib/supabase";
import { useRealtimeStories } from "@/hooks/useRealtime";

export default function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userStories, setUserStories] = useState<Story[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const { updateStoryFlags, updateHearts } = useRealtimeStories();

  // Check current user and load profile
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setCurrentUser(user);

        if (userId) {
          await loadUserProfile(userId);
          await loadUserStories(userId);

          // Check if following this user
          if (user) {
            const isCurrentlyFollowing =
              localStorage.getItem(`following_${userId}_${user.id}`) === "true";
            setIsFollowing(isCurrentlyFollowing);
          }
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  const loadUserProfile = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", uid)
        .single();

      if (error) {
        console.warn("Could not load user profile:", error);
        // Create a mock profile based on stories
        setUserProfile({
          id: uid,
          name: `User ${uid.slice(-8)}`,
          email: null,
          avatar_url: null,
          bio: "Tea enthusiast ☕",
        });
      } else {
        setUserProfile(data);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
      setUserProfile({
        id: uid,
        name: `User ${uid?.slice(-8)}`,
        email: null,
        avatar_url: null,
        bio: "Tea enthusiast ☕",
      });
    }
  };

  const loadUserStories = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .eq("author_id", uid)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading user stories:", error);
        setUserStories([]);
      } else {
        setUserStories(data || []);
      }
    } catch (error) {
      console.error("Error loading user stories:", error);
      setUserStories([]);
    }
  };

  const handleFollowToggle = () => {
    if (!currentUser || !userId) return;

    const storageKey = `following_${userId}_${currentUser.id}`;

    if (isFollowing) {
      localStorage.removeItem(storageKey);
      setIsFollowing(false);
      alert(`Unfollowed @${userProfile?.name || "User"}`);
    } else {
      localStorage.setItem(storageKey, "true");
      setIsFollowing(true);
      alert(`Now following @${userProfile?.name || "User"}!`);
    }
  };

  const formatStory = (story: Story) => ({
    id: story.id,
    title: story.title || "Untitled Story",
    author: story.author || `user_${story.author_id?.slice(-8)}` || "anonymous",
    flags: {
      red: parseInt(story.flags_red || "0") || 0,
      green: parseInt(story.flags_green || "0") || 0,
    },
    preview: story.preview || "No preview available...",
    hearts: parseInt(story.hearts || "0") || 0,
    comments: parseInt(story.comments || "0") || 0,
    image_url: story.image_url,
    isBlurred: story.is_blurred || false,
    tags: story.tags ? story.tags.split(",").map((tag) => tag.trim()) : [],
    premium: story.premium || false,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tea-pink-50 via-tea-green-50 to-tea-mint-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-tea-pink-600" />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tea-pink-50 via-tea-green-50 to-tea-mint-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-tea-neutral-800 mb-4">
            User not found
          </h2>
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-tea-pink-50 via-tea-green-50 to-tea-mint-50">
      {/* Header */}
      <header className="relative z-10 border-b border-tea-neutral-200 bg-white/95 backdrop-blur-lg shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="text-tea-neutral-600 hover:text-tea-pink-600 transition-colors p-2 rounded-lg hover:bg-tea-pink-50"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-tea-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-tea-neutral-800">
                  Tea Time
                </h1>
              </div>
              <Badge className="bg-tea-neutral-100 text-tea-neutral-700 border-tea-neutral-300 px-3 py-1">
                User Profile
              </Badge>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className="text-tea-neutral-600 hover:text-tea-pink-600 font-medium"
              >
                Home
              </Link>
              <Link
                to="/feed"
                className="text-tea-neutral-600 hover:text-tea-pink-600 font-medium"
              >
                Feed
              </Link>
              <Link
                to="/profile"
                className="text-tea-neutral-600 hover:text-tea-pink-600 font-medium"
              >
                My Profile
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* User Profile Header */}
          <Card className="bg-white/85 backdrop-blur-md border-tea-neutral-200 shadow-xl rounded-2xl mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Profile Picture */}
                <Avatar className="w-32 h-32 border-4 border-tea-pink-200 shadow-lg">
                  <AvatarImage src={userProfile.avatar_url} alt="Profile" />
                  <AvatarFallback className="bg-tea-pink-100 text-tea-pink-700 text-2xl font-bold">
                    {userProfile.name
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("") || "U"}
                  </AvatarFallback>
                </Avatar>

                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                    <h2 className="text-3xl font-bold text-tea-neutral-800">
                      {userProfile.name || `User ${userId?.slice(-8)}`}
                    </h2>

                    {/* Follow Button */}
                    {currentUser && currentUser.id !== userId && (
                      <Button
                        onClick={handleFollowToggle}
                        variant={isFollowing ? "default" : "outline"}
                        className={
                          isFollowing
                            ? "bg-tea-pink-600 hover:bg-tea-pink-700 text-white"
                            : "border-tea-pink-300 text-tea-pink-600 hover:bg-tea-pink-50"
                        }
                      >
                        {isFollowing ? (
                          <>
                            <UserMinus className="w-4 h-4 mr-2" />
                            Following
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Follow
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  <p className="text-tea-neutral-600 mb-4">
                    @{userProfile.name || `user_${userId?.slice(-8)}`}
                  </p>

                  <p className="text-tea-neutral-700 mb-6 max-w-md mx-auto md:mx-0">
                    {userProfile.bio || "Tea enthusiast and story teller ☕"}
                  </p>

                  {/* User Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-tea-pink-600">
                        {userStories.length}
                      </div>
                      <div className="text-sm text-tea-neutral-500">
                        Stories
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-tea-pink-600">
                        {userStories.reduce(
                          (sum, story) => sum + parseInt(story.hearts || "0"),
                          0,
                        )}
                      </div>
                      <div className="text-sm text-tea-neutral-500">Hearts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-tea-green-600">
                        {userStories.reduce(
                          (sum, story) =>
                            sum + parseInt(story.flags_green || "0"),
                          0,
                        )}
                      </div>
                      <div className="text-sm text-tea-neutral-500">
                        Green Flags
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User's Stories */}
          <Card className="bg-white/85 backdrop-blur-md border-tea-neutral-200 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-tea-neutral-800 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Stories by {userProfile.name || "User"} ({userStories.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userStories.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-tea-neutral-300" />
                  <h3 className="text-xl font-semibold text-tea-neutral-600 mb-2">
                    No stories yet
                  </h3>
                  <p className="text-tea-neutral-500">
                    This user hasn't shared any stories yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {userStories.map((dbStory) => {
                    const story = formatStory(dbStory);
                    return (
                      <div
                        key={story.id}
                        className="border-b border-tea-neutral-100 last:border-b-0 pb-6 last:pb-0"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-tea-neutral-800 text-lg">
                                {story.title}
                              </h3>
                              {story.premium && (
                                <Crown className="w-5 h-5 text-tea-green-600" />
                              )}
                            </div>
                            <p className="text-sm text-tea-neutral-500 mb-3">
                              {new Date(
                                dbStory.created_at,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Story Image */}
                        {story.image_url && (
                          <div className="mb-4 relative">
                            <div className="relative rounded-xl overflow-hidden shadow-lg">
                              <img
                                src={story.image_url}
                                alt="Story image"
                                className={`w-full h-48 object-cover ${
                                  story.isBlurred ? "blur-lg" : ""
                                }`}
                              />
                              {story.isBlurred && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                  <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                                    🔒 Sensitive Content
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <p className="text-tea-neutral-700 mb-4 leading-relaxed">
                          {story.preview}
                        </p>

                        {/* Interaction Stats */}
                        <div className="flex items-center gap-6 text-sm text-tea-neutral-500 mb-4">
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {story.hearts}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {story.comments}
                          </div>
                          <div className="flex items-center gap-1">
                            <Flag className="w-4 h-4 text-tea-chaos-red" />
                            {story.flags.red}
                          </div>
                          <div className="flex items-center gap-1">
                            <Flag className="w-4 h-4 text-tea-chaos-green" />
                            {story.flags.green}
                          </div>
                        </div>

                        {/* Tags */}
                        {story.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {story.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="bg-tea-neutral-100 text-tea-neutral-700 text-xs"
                              >
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
