import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Heart,
  Search,
  Flame,
  Star,
  Cherry,
  ArrowLeft,
  Filter,
  Plus,
  MessageCircle,
  Sparkles,
  Users,
  Crown,
  Coffee,
  Eye,
  EyeOff,
  Flag,
  Loader2,
  Zap,
  Gift,
  Image as ImageIcon,
  X,
  UserPlus,
} from "lucide-react";
import { useRealtimeStories } from "@/hooks/useRealtime";
import { useAuth } from "@/hooks/useAuth";
import StoryModal from "@/components/StoryModal";
import AuthModal from "@/components/AuthModal";
import ImageModal from "@/components/ImageModal";
import StoryViewModal from "@/components/StoryViewModal";
import CommentsModal from "@/components/CommentsModal";
import SupabaseStatus from "@/components/SupabaseStatus";
import { supabase, type Story } from "@/lib/supabase";

// Separate component for follow button to prevent render blocking
const FollowButton = ({
  userId,
  authorId,
  authorName,
  onFollow,
}: {
  userId: string;
  authorId: string;
  authorName: string;
  onFollow: (authorId: string, authorName: string) => void;
}) => {
  const [isFollowing, setIsFollowing] = useState(() => {
    try {
      return localStorage.getItem(`following_${authorId}_${userId}`) === "true";
    } catch {
      return false;
    }
  });

  const handleClick = () => {
    setIsFollowing(!isFollowing);
    onFollow(authorId, authorName);
  };

  return (
    <Button
      variant={isFollowing ? "default" : "outline"}
      size="sm"
      onClick={handleClick}
      className={
        isFollowing
          ? "bg-tea-pink-600 hover:bg-tea-pink-700 text-white"
          : "text-tea-pink-600 border-tea-pink-300 hover:bg-tea-pink-50"
      }
    >
      <Users className="w-4 h-4 mr-1" />
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
};

export default function Feed() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedStoryForView, setSelectedStoryForView] =
    useState<Story | null>(null);
  const [selectedMood, setSelectedMood] = useState<string>("all");
  const [showIntensityMeter, setShowIntensityMeter] = useState(false);
  const [recommendedStories, setRecommendedStories] = useState<Story[]>([]);
  const [imageBlurStates, setImageBlurStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
    author: string;
  } | null>(null);
  const [userInteractions, setUserInteractions] = useState<{
    [key: string]: {
      liked: boolean;
      flaggedRed: boolean;
      flaggedGreen: boolean;
    };
  }>({});
  const [selectedStoryForComments, setSelectedStoryForComments] = useState<{
    id: string;
    title: string;
    author: string;
  } | null>(null);

  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const {
    stories,
    loading,
    addStory,
    updateStoryFlags,
    updateHearts,
    hasUserLiked,
    hasUserFlagged,
  } = useRealtimeStories();

  // Load user interactions when stories or user changes
  useEffect(() => {
    const loadUserInteractions = async () => {
      if (!user || stories.length === 0) return;

      try {
        // Load interactions in batches to avoid blocking
        const batchSize = 5;
        const interactions: any = {};

        for (let i = 0; i < stories.length; i += batchSize) {
          const batch = stories.slice(i, i + batchSize);

          await Promise.all(
            batch.map(async (story) => {
              try {
                const [liked, flaggedRed, flaggedGreen] = await Promise.all([
                  hasUserLiked(story.id),
                  hasUserFlagged(story.id, "red"),
                  hasUserFlagged(story.id, "green"),
                ]);

                interactions[story.id] = {
                  liked,
                  flaggedRed,
                  flaggedGreen,
                };
              } catch (error) {
                // Fail silently for individual stories
                interactions[story.id] = {
                  liked: false,
                  flaggedRed: false,
                  flaggedGreen: false,
                };
              }
            }),
          );

          // Update state after each batch
          setUserInteractions((prev) => ({ ...prev, ...interactions }));

          // Small delay between batches to keep UI responsive
          if (i + batchSize < stories.length) {
            await new Promise((resolve) => setTimeout(resolve, 50));
          }
        }
      } catch (error) {
        console.warn("Failed to load user interactions:", error);
      }
    };

    // Debounce the loading to avoid multiple rapid calls
    const timeoutId = setTimeout(() => {
      loadUserInteractions();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [user?.id, stories.length]);

  // Calculate Tea Intensity for a story (1-5 scale)
  const calculateTeaIntensity = (story: Story): number => {
    const redFlags = parseInt(story.flags_red || "0");
    const hearts = parseInt(story.hearts || "0");
    const comments = parseInt(story.comments || "0");

    // Keywords that indicate high intensity
    const highIntensityKeywords = [
      "cheating",
      "toxic",
      "gaslighting",
      "manipul",
      "crazy",
      "insane",
      "nightmare",
    ];
    const mediumIntensityKeywords = [
      "dramatic",
      "drama",
      "shocking",
      "surprise",
      "twist",
    ];

    const content = (
      story.title +
      " " +
      story.preview +
      " " +
      (story.tags || "")
    ).toLowerCase();

    let intensity = 1;

    // Base intensity from engagement
    if (hearts > 100) intensity += 1;
    if (comments > 50) intensity += 1;
    if (redFlags > 20) intensity += 1;

    // Content-based intensity
    if (highIntensityKeywords.some((keyword) => content.includes(keyword))) {
      intensity = Math.min(5, intensity + 2);
    } else if (
      mediumIntensityKeywords.some((keyword) => content.includes(keyword))
    ) {
      intensity = Math.min(5, intensity + 1);
    }

    return Math.min(5, intensity);
  };

  // Mood filtering
  const getMoodFromStory = (story: Story): string => {
    const redFlags = parseInt(story.flags_red || "0");
    const greenFlags = parseInt(story.flags_green || "0");
    const content = (
      story.title +
      " " +
      story.preview +
      " " +
      (story.tags || "")
    ).toLowerCase();

    if (
      content.includes("wholesome") ||
      content.includes("sweet") ||
      greenFlags > redFlags * 2
    )
      return "wholesome";
    if (
      content.includes("toxic") ||
      content.includes("red flag") ||
      redFlags > greenFlags * 2
    )
      return "dramatic";
    if (
      content.includes("funny") ||
      content.includes("hilarious") ||
      content.includes("😂")
    )
      return "funny";
    if (content.includes("sad") || content.includes("heartbreak"))
      return "heartbreak";
    return "mixed";
  };

  // Filter stories based on search query and mood
  const filteredStories = stories.filter((story) => {
    // Search filter
    if (searchQuery.trim()) {
      let query = searchQuery.toLowerCase().trim();

      // Handle hashtag searches - remove # and search in tags
      if (query.startsWith("#")) {
        const tagQuery = query.substring(1); // Remove the #
        const tags = (story.tags || "").toLowerCase();
        const tagArray = tags.split(",").map((tag) => tag.trim());

        // Check if any tag contains the search term (partial matching)
        const matchesSearch = tagArray.some((tag) => tag.includes(tagQuery));
        if (!matchesSearch) return false;
      } else {
        // Regular search in all fields
        const title = (story.title || "").toLowerCase();
        const preview = (story.preview || "").toLowerCase();
        const author = (story.author || "").toLowerCase();
        const tags = (story.tags || "").toLowerCase();

        const matchesSearch =
          title.includes(query) ||
          preview.includes(query) ||
          author.includes(query) ||
          tags.includes(query);

        if (!matchesSearch) return false;
      }
    }

    // Mood filter
    if (selectedMood !== "all") {
      return getMoodFromStory(story) === selectedMood;
    }

    return true;
  });

  // Generate story recommendations based on user interactions
  useEffect(() => {
    if (stories.length === 0) return;

    const userLikedStories = Object.entries(userInteractions)
      .filter(([_, interaction]) => interaction.liked)
      .map(([storyId]) => stories.find((s) => s.id === storyId))
      .filter(Boolean) as Story[];

    if (userLikedStories.length === 0) {
      // No liked stories yet, recommend trending stories
      const trending = stories
        .sort(
          (a, b) =>
            parseInt(b.hearts || "0") +
            parseInt(b.comments || "0") -
            (parseInt(a.hearts || "0") + parseInt(a.comments || "0")),
        )
        .slice(0, 3);
      setRecommendedStories(trending);
      return;
    }

    // Find similar stories based on liked stories' characteristics
    const likedMoods = userLikedStories.map(getMoodFromStory);
    const commonMood = likedMoods.reduce(
      (acc, mood) => {
        acc[mood] = (acc[mood] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const preferredMood =
      Object.entries(commonMood).sort(([, a], [, b]) => b - a)[0]?.[0] ||
      "mixed";

    const recommendations = stories
      .filter((story) => getMoodFromStory(story) === preferredMood)
      .filter((story) => !userInteractions[story.id]?.liked) // Exclude already liked
      .sort((a, b) => parseInt(b.hearts || "0") - parseInt(a.hearts || "0"))
      .slice(0, 3);

    setRecommendedStories(recommendations);
  }, [stories, userInteractions]);

  // Initialize blur states for stories with images
  useEffect(() => {
    const blurStates: { [key: string]: boolean } = {};
    stories.forEach((story) => {
      if (story.image_url && story.is_blurred) {
        // Only set to blurred if not already in state (preserves user choice)
        if (!(story.id in imageBlurStates)) {
          blurStates[story.id] = true;
        }
      }
    });
    if (Object.keys(blurStates).length > 0) {
      setImageBlurStates((prev) => ({ ...prev, ...blurStates }));
    }
  }, [stories]);

  const showImage = (storyId: string) => {
    setImageBlurStates((prev) => ({
      ...prev,
      [storyId]: false,
    }));
  };

  const hideImage = (storyId: string) => {
    setImageBlurStates((prev) => ({
      ...prev,
      [storyId]: true,
    }));
  };

  // Handle story creation - check auth first
  const handleSpillTea = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setShowStoryModal(true);
  };

  // Handle successful authentication
  const handleAuthSuccess = () => {
    setShowStoryModal(true);
  };

  // Delete story function
  const deleteStory = async (storyId: string) => {
    if (!user) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this story? This action cannot be undone.",
    );
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from("stories")
        .delete()
        .eq("id", storyId)
        .eq("author_id", user.id); // Ensure user can only delete their own stories

      if (error) {
        console.error("Error deleting story:", error);
        alert("Failed to delete story. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting story:", error);
      alert("Failed to delete story. Please try again.");
    }
  };

  const handleFollowUser = async (authorId: string, authorName: string) => {
    if (!user) {
      alert("Please log in to follow users");
      return;
    }

    try {
      // Use localStorage to track follows (for demo)
      const storageKey = `following_${authorId}_${user.id}`;
      const isCurrentlyFollowing = localStorage.getItem(storageKey) === "true";

      if (isCurrentlyFollowing) {
        localStorage.removeItem(storageKey);
        alert(`Unfollowed @${authorName}`);
      } else {
        localStorage.setItem(storageKey, "true");
        alert(
          `Now following @${authorName}! You'll see their stories in your feed.`,
        );
      }

      // In production with a follows table:
      // const { error } = await supabase
      //   .from("follows")
      //   .insert({ follower_id: user.id, following_id: authorId });
    } catch (error) {
      console.error("Error following user:", error);
      alert("Could not follow user. Please try again.");
    }
  };

  // Convert database story to display format
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-tea-pink-50 via-tea-green-50 to-tea-mint-50">
      <SupabaseStatus />

      {/* Floating decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 text-tea-pink-300 opacity-40 animate-pulse">
          <Zap size={28} />
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
          <Cherry size={22} className="animate-pulse delay-75" />
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
                Personal Feed
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
                className="text-tea-pink-600 font-medium border-b-2 border-tea-pink-500 pb-1"
              >
                Feed
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
                className="text-tea-neutral-600 hover:text-tea-pink-600 font-medium transition-colors duration-300 relative group"
              >
                Messages
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-tea-pink-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                to="/profile"
                className="text-tea-neutral-600 hover:text-tea-pink-600 font-medium transition-colors duration-300 relative group"
              >
                Profile
              </Link>
              <Button
                className="bg-tea-pink-600 hover:bg-tea-pink-700 text-white rounded-full px-6 py-2 shadow-lg transition-all duration-300 hover:shadow-xl"
                onClick={handleSpillTea}
              >
                {isAuthenticated ? "Spill Tea" : "Join to Share"}
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-tea-neutral-800 mb-6">
              Your Personal Feed ☕
            </h2>
            <p className="text-xl text-tea-neutral-600 mb-10 max-w-2xl mx-auto">
              Fresh tea served daily with images, stories, and all the drama you
              crave 📸✨
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-10">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-tea-neutral-400 h-5 w-5 transition-colors group-focus-within:text-tea-pink-600" />
                <Input
                  placeholder="Search stories, authors, tags, or drama..."
                  className="pl-12 pr-4 py-4 text-lg rounded-2xl border-tea-neutral-300 bg-white/90 backdrop-blur-sm focus:border-tea-pink-500 focus:ring-2 focus:ring-tea-pink-200 shadow-lg transition-all duration-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-tea-neutral-400 hover:text-tea-neutral-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                className="border-2 border-tea-pink-300 text-tea-pink-700 hover:bg-tea-pink-50 rounded-2xl px-8 py-3 shadow-lg transition-all duration-300"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter Stories
              </Button>
              <Button
                variant="outline"
                className="border-2 border-tea-green-300 text-tea-green-700 hover:bg-tea-green-50 rounded-2xl px-8 py-3 shadow-lg transition-all duration-300"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Images Only
              </Button>
            </div>
          </div>

          {/* Stories Feed */}
          <div className="space-y-8">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-tea-pink-600" />
              </div>
            ) : filteredStories.length === 0 ? (
              <Card className="bg-white/85 backdrop-blur-md border-tea-neutral-200 shadow-xl rounded-2xl text-center py-20">
                <CardContent>
                  <div className="w-20 h-20 bg-tea-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <ImageIcon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-tea-neutral-800 mb-4">
                    No Stories Yet
                  </h3>
                  <p className="text-tea-neutral-600 mb-8 max-w-lg mx-auto">
                    Be the first to share a story with images! Upload photos and
                    spill the tea 📸☕
                  </p>
                  <Button
                    className="bg-tea-pink-600 hover:bg-tea-pink-700 text-white"
                    onClick={handleSpillTea}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    {isAuthenticated
                      ? "Share Your Story"
                      : "Join to Share Stories"}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              (searchQuery.trim() ? filteredStories : stories).map(
                (dbStory) => {
                  const story = formatStory(dbStory);
                  const isImageBlurred = imageBlurStates[story.id];

                  return (
                    <Card
                      key={story.id}
                      className="bg-white/85 backdrop-blur-md border-tea-neutral-200 shadow-xl rounded-2xl cursor-pointer"
                      onClick={() => setSelectedStoryForView(dbStory)}
                    >
                      <CardContent className="p-8">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-tea-neutral-800 text-xl">
                                {story.title}
                              </h3>
                              {story.premium && (
                                <Crown className="w-5 h-5 text-tea-green-600" />
                              )}
                            </div>
                            <Link
                              to={`/user/${dbStory.author_id}`}
                              className="text-sm text-tea-neutral-600 mb-3 font-medium hover:text-tea-pink-600 transition-colors cursor-pointer"
                            >
                              @{story.author}
                            </Link>
                          </div>
                          <div className="flex items-center gap-2">
                            {/* Follow button for other users */}
                            {user && user.id !== dbStory.author_id && (
                              <FollowButton
                                key={`follow-${dbStory.author_id}`}
                                userId={user.id}
                                authorId={dbStory.author_id!}
                                authorName={story.author}
                                onFollow={handleFollowUser}
                              />
                            )}

                            {/* Delete button for story author */}
                            {user && user.id === dbStory.author_id && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteStory(story.id)}
                                className="text-red-600 border-red-300 hover:bg-red-50"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Story Image */}
                        {story.image_url && (
                          <div className="mb-6 relative">
                            <div className="relative rounded-xl overflow-hidden shadow-lg">
                              <img
                                src={story.image_url}
                                alt="Story image"
                                className={`w-full h-64 object-cover transition-all duration-300 cursor-pointer hover:scale-105 ${
                                  isImageBlurred ? "blur-lg" : ""
                                }`}
                                onClick={() =>
                                  !isImageBlurred &&
                                  setSelectedImage({
                                    url: story.image_url!,
                                    title: story.title,
                                    author: story.author,
                                  })
                                }
                              />
                              {story.isBlurred && (
                                <div className="absolute top-4 right-4 flex gap-2">
                                  <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                                    🔒 Sensitive Content
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Story Content */}
                        <p className="text-tea-neutral-700 mb-6 leading-relaxed text-lg">
                          {story.preview}
                        </p>

                        {/* Interaction Buttons */}
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={async () => {
                                if (!isAuthenticated) {
                                  setShowAuthModal(true);
                                  return;
                                }
                                await updateStoryFlags(story.id, "red");
                                // Refresh user interactions
                                const interactions = { ...userInteractions };
                                interactions[story.id] = {
                                  ...interactions[story.id],
                                  flaggedRed: await hasUserFlagged(
                                    story.id,
                                    "red",
                                  ),
                                };
                                setUserInteractions(interactions);
                              }}
                              className={`flex items-center gap-1 px-3 py-2 rounded-full transition-colors ${
                                userInteractions[story.id]?.flaggedRed
                                  ? "bg-red-100 hover:bg-red-200"
                                  : "hover:bg-red-50"
                              }`}
                            >
                              <Flag
                                className={`w-4 h-4 ${
                                  userInteractions[story.id]?.flaggedRed
                                    ? "text-red-600 fill-current"
                                    : "text-tea-chaos-red"
                                }`}
                              />
                              <span className="text-sm font-bold text-tea-chaos-red">
                                {story.flags.red}
                              </span>
                            </button>
                            <button
                              onClick={async () => {
                                if (!isAuthenticated) {
                                  setShowAuthModal(true);
                                  return;
                                }
                                await updateStoryFlags(story.id, "green");
                                // Refresh user interactions
                                const interactions = { ...userInteractions };
                                interactions[story.id] = {
                                  ...interactions[story.id],
                                  flaggedGreen: await hasUserFlagged(
                                    story.id,
                                    "green",
                                  ),
                                };
                                setUserInteractions(interactions);
                              }}
                              className={`flex items-center gap-1 px-3 py-2 rounded-full transition-colors ${
                                userInteractions[story.id]?.flaggedGreen
                                  ? "bg-green-100 hover:bg-green-200"
                                  : "hover:bg-green-50"
                              }`}
                            >
                              <Flag
                                className={`w-4 h-4 ${
                                  userInteractions[story.id]?.flaggedGreen
                                    ? "text-green-600 fill-current"
                                    : "text-tea-chaos-green"
                                }`}
                              />
                              <span className="text-sm font-bold text-tea-chaos-green">
                                {story.flags.green}
                              </span>
                            </button>
                          </div>
                          <div className="flex items-center gap-6 text-sm text-tea-neutral-500">
                            <button
                              onClick={async () => {
                                if (!isAuthenticated) {
                                  setShowAuthModal(true);
                                  return;
                                }
                                await updateHearts(story.id);
                                // Refresh user interactions
                                const interactions = { ...userInteractions };
                                interactions[story.id] = {
                                  ...interactions[story.id],
                                  liked: await hasUserLiked(story.id),
                                };
                                setUserInteractions(interactions);
                              }}
                              className={`flex items-center gap-1 font-medium px-3 py-2 rounded-full transition-colors ${
                                userInteractions[story.id]?.liked
                                  ? "bg-pink-100 hover:bg-pink-200 text-pink-700"
                                  : "hover:bg-pink-50"
                              }`}
                            >
                              <Heart
                                className={`w-4 h-4 ${
                                  userInteractions[story.id]?.liked
                                    ? "text-pink-600 fill-current"
                                    : ""
                                }`}
                              />
                              {(story.hearts || 0).toLocaleString()}
                            </button>
                            <button
                              onClick={() =>
                                setSelectedStoryForComments({
                                  id: story.id,
                                  title: story.title,
                                  author: story.author,
                                })
                              }
                              className="flex items-center gap-1 font-medium hover:bg-tea-neutral-100 px-3 py-2 rounded-full transition-colors cursor-pointer"
                            >
                              <MessageCircle className="w-4 h-4" />
                              {story.comments}
                            </button>
                          </div>
                        </div>

                        {/* Tags */}
                        {story.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {story.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="bg-tea-neutral-100 text-tea-neutral-700 text-xs font-medium px-3 py-1 rounded-full cursor-pointer hover:bg-tea-pink-100 hover:text-tea-pink-700 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(
                                    `/search?q=${encodeURIComponent("#" + tag)}`,
                                  );
                                }}
                              >
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                },
              )
            )}
          </div>
        </div>
      </main>

      {/* Story Creation Modal */}
      <StoryModal
        isOpen={showStoryModal}
        onClose={() => setShowStoryModal(false)}
        onSubmit={addStory}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Image Modal */}
      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage?.url || ""}
        title={selectedImage?.title}
        author={selectedImage?.author}
      />

      {/* Comments Modal */}
      {selectedStoryForComments && (
        <CommentsModal
          isOpen={!!selectedStoryForComments}
          onClose={() => setSelectedStoryForComments(null)}
          storyId={selectedStoryForComments.id}
          storyTitle={selectedStoryForComments.title}
          storyAuthor={selectedStoryForComments.author}
        />
      )}

      {/* Story View Modal */}
      <StoryViewModal
        isOpen={!!selectedStoryForView}
        onClose={() => setSelectedStoryForView(null)}
        story={selectedStoryForView}
        onLike={updateHearts}
        onFlag={updateStoryFlags}
        onTagClick={(tag) =>
          navigate(`/search?q=${encodeURIComponent("#" + tag)}`)
        }
      />
    </div>
  );
}
