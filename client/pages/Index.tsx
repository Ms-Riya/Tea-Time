import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Search,
  Flame,
  Users,
  Star,
  Cherry,
  Flag,
  MessageCircle,
  Sparkles,
  TrendingUp,
  Crown,
  Zap,
  Gift,
  Loader2,
  ArrowRight,
  Coffee,
  Shield,
  Eye,
  Clock,
} from "lucide-react";
import { supabase, type Story } from "@/lib/supabase";
import { useRealtimeStories } from "@/hooks/useRealtime";
import { useAuth } from "@/hooks/useAuth";
import { type Story } from "@/lib/supabase";
import StoryModal from "@/components/StoryModal";
import AuthModal from "@/components/AuthModal";
import StoryViewModal from "@/components/StoryViewModal";
import ImageModal from "@/components/ImageModal";

export default function Index() {
  const navigate = useNavigate();
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
    author: string;
  } | null>(null);
  const [storyOfTheDay, setStoryOfTheDay] = useState<Story | null>(null);
  const [isQuickTeaLoading, setIsQuickTeaLoading] = useState(false);
  const [totalStats, setTotalStats] = useState({
    totalStories: 0,
    redFlags: 0,
    greenFlags: 0,
    activeUsers: 0,
  });

  const { user, isAuthenticated } = useAuth();
  const { stories, loading, addStory, updateHearts, updateStoryFlags } = useRealtimeStories();

  useEffect(() => {
    fetchStats();
    // Select story of the day (highest engagement from past 24h)
    if (stories.length > 0) {
      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

      const recentStories = stories.filter(story => {
        const storyDate = new Date(story.created_at);
        return storyDate >= yesterday;
      });

      if (recentStories.length > 0) {
        const topStory = recentStories.reduce((best, current) => {
          const currentScore = (parseInt(current.hearts || "0") * 2) +
                             (parseInt(current.comments || "0") * 3) +
                             (parseInt(current.flags_green || "0") * 1);
          const bestScore = (parseInt(best.hearts || "0") * 2) +
                           (parseInt(best.comments || "0") * 3) +
                           (parseInt(best.flags_green || "0") * 1);
          return currentScore > bestScore ? current : best;
        });
        setStoryOfTheDay(topStory);
      } else {
        // Fallback to highest engagement overall
        const topStory = stories.reduce((best, current) => {
          const currentScore = (parseInt(current.hearts || "0") * 2) +
                             (parseInt(current.comments || "0") * 3);
          const bestScore = (parseInt(best.hearts || "0") * 2) +
                           (parseInt(best.comments || "0") * 3);
          return currentScore > bestScore ? current : best;
        });
        setStoryOfTheDay(topStory);
      }
    }
  }, [stories]);

  const fetchStats = async () => {
    try {
      const { count: usersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      let redFlagsTotal = 0;
      let greenFlagsTotal = 0;

      stories.forEach((story) => {
        redFlagsTotal += parseInt(story.flags_red || "0") || 0;
        greenFlagsTotal += parseInt(story.flags_green || "0") || 0;
      });

      setTotalStats({
        totalStories: stories.length,
        redFlags: redFlagsTotal,
        greenFlags: greenFlagsTotal,
        activeUsers: usersCount || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleSpillTea = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setShowStoryModal(true);
  };

  const handleQuickTea = () => {
    if (stories.length === 0) return;

    setIsQuickTeaLoading(true);

    // Dramatic loading effect
    setTimeout(() => {
      const randomStory = stories[Math.floor(Math.random() * stories.length)];
      setSelectedStory(randomStory);
      setIsQuickTeaLoading(false);
    }, 1200);
  };

  const handleAuthSuccess = () => {
    setShowStoryModal(true);
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
    isBlurred: story.is_blurred || false,
    tags: story.tags ? story.tags.split(",").map((tag) => tag.trim()) : [],
    premium: story.premium || false,
  });

  const trendingTopics = React.useMemo(() => {
    const tagCounts: { [key: string]: number } = {};
    stories.forEach((story) => {
      if (story.tags) {
        const tags = story.tags.split(",").map((tag) => tag.trim());
        tags.forEach((tag) => {
          if (tag) {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          }
        });
      }
    });

    return Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([tag, count]) => ({ tag, count }));
  }, [stories]);

  return (
    <div className="min-h-screen bg-tea-pink-50">
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
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-tea-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-tea-neutral-800">
                Tea Time
              </h1>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className="text-tea-pink-600 font-medium border-b-2 border-tea-pink-500 pb-1"
              >
                Home
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
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-tea-pink-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Button
                className="bg-tea-pink-600 hover:bg-tea-pink-700 text-white rounded-full px-6 py-2 shadow-lg transition-all duration-300 hover:shadow-xl"
                onClick={handleSpillTea}
              >
                {isAuthenticated ? "Spill Tea" : "Join Tea Time"}
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-tea-neutral-800 mb-6 leading-tight">
              Welcome to Tea Time ☕
            </h1>
            <p className="text-xl md:text-2xl text-tea-neutral-600 mb-8 leading-relaxed">
              Share your relationship stories and get real feedback from our community
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                className="bg-tea-pink-600 hover:bg-tea-pink-700 text-white rounded-full px-8 py-3 shadow-lg transition-all duration-300 hover:shadow-xl"
                onClick={handleSpillTea}
              >
                <Heart className="w-5 h-5 mr-2" />
                {isAuthenticated ? "Share Your Story" : "Get Started"}
              </Button>
              <Link to="/feed">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-tea-green-400 text-tea-green-700 hover:bg-tea-green-50 rounded-full px-8 py-3 shadow-lg transition-all duration-300"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Browse Stories
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <Card className="bg-white/80 backdrop-blur-md border-tea-neutral-200 shadow-lg rounded-xl hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 bg-tea-pink-500 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-md">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-tea-neutral-800 mb-1">
                    {totalStats.totalStories}
                  </div>
                  <div className="text-sm text-tea-neutral-600 font-medium">
                    Stories
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-md border-tea-neutral-200 shadow-lg rounded-xl hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-md">
                    <Flag className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-tea-neutral-800 mb-1">
                    {totalStats.redFlags}
                  </div>
                  <div className="text-sm text-tea-neutral-600 font-medium">
                    Red Flags
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-md border-tea-neutral-200 shadow-lg rounded-xl hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 bg-tea-green-500 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-md">
                    <Flag className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-tea-neutral-800 mb-1">
                    {totalStats.greenFlags}
                  </div>
                  <div className="text-sm text-tea-neutral-600 font-medium">
                    Green Flags
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-md border-tea-neutral-200 shadow-lg rounded-xl hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 bg-tea-green-500 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-md">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-tea-neutral-800 mb-1">
                    {totalStats.activeUsers}
                  </div>
                  <div className="text-sm text-tea-neutral-600 font-medium">
                    Members
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Story of the Day */}
      {storyOfTheDay && (
        <section className="relative z-10 py-16 bg-gradient-to-r from-tea-pink-50 to-tea-green-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-tea-pink-500 to-tea-green-500 text-white px-6 py-2 rounded-full mb-4 shadow-lg">
                  <Star className="w-5 h-5" />
                  <span className="font-bold">Story of the Day</span>
                  <Sparkles className="w-5 h-5" />
                </div>
                <h2 className="text-3xl font-bold text-tea-neutral-800 mb-2">
                  Today's Most Engaging Tea ☕
                </h2>
                <p className="text-lg text-tea-neutral-600">
                  The story that got everyone talking in the past 24 hours
                </p>
              </div>

              <Card
                className="bg-white/90 backdrop-blur-md border-2 border-tea-pink-200 shadow-2xl rounded-2xl hover:shadow-3xl transition-all duration-500 cursor-pointer transform hover:scale-[1.02]"
                onClick={() => setSelectedStory(storyOfTheDay)}
              >
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-tea-neutral-800">
                        {formatStory(storyOfTheDay).title}
                      </h3>
                      <p className="text-tea-neutral-600 font-medium">
                        by @{formatStory(storyOfTheDay).author}
                      </p>
                    </div>
                  </div>

                  <p className="text-tea-neutral-700 leading-relaxed text-lg mb-6 line-clamp-3">
                    {formatStory(storyOfTheDay).preview}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-sm">
                      <span className="flex items-center gap-2 text-tea-pink-600 font-semibold">
                        <Heart className="w-5 h-5" />
                        {formatStory(storyOfTheDay).hearts.toLocaleString()} hearts
                      </span>
                      <span className="flex items-center gap-2 text-tea-neutral-600">
                        <MessageCircle className="w-5 h-5" />
                        {formatStory(storyOfTheDay).comments} comments
                      </span>
                    </div>
                    <Badge className="bg-gradient-to-r from-tea-pink-500 to-tea-green-500 text-white border-none px-4 py-1">
                      🏆 Top Story
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Quick Tea Section */}
      <section className="relative z-10 py-12 bg-white/60 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-tea-neutral-800 mb-4">
              Need Some Random Tea? ☕
            </h3>
            <p className="text-tea-neutral-600 mb-6">
              Let fate decide your next story! Click for a surprise tale from our community.
            </p>
            <Button
              onClick={handleQuickTea}
              disabled={stories.length === 0 || isQuickTeaLoading}
              className="bg-gradient-to-r from-tea-pink-600 to-tea-green-600 hover:from-tea-pink-700 hover:to-tea-green-700 text-white rounded-full px-8 py-4 text-lg shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105"
            >
              {isQuickTeaLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Brewing Random Tea...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Quick Tea ⚡
                </>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-tea-neutral-800 mb-4">
              Why Choose Tea Time?
            </h2>
            <p className="text-lg text-tea-neutral-600 max-w-2xl mx-auto">
              A safe space to share and learn from relationship experiences
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white/80 backdrop-blur-md border-tea-neutral-200 shadow-lg rounded-xl hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-tea-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-tea-neutral-800 mb-3">
                  Safe Community
                </h3>
                <p className="text-tea-neutral-700 leading-relaxed">
                  A supportive space where you can share experiences and get honest feedback from understanding people.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-md border-tea-neutral-200 shadow-lg rounded-xl hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-tea-green-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Flag className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-tea-neutral-800 mb-3">
                  Real Feedback
                </h3>
                <p className="text-tea-neutral-700 leading-relaxed">
                  Get honest opinions through our red flag 🚩 and green flag 💚 voting system.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-md border-tea-neutral-200 shadow-lg rounded-xl hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-tea-green-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-tea-neutral-800 mb-3">
                  Supportive Community
                </h3>
                <p className="text-tea-neutral-700 leading-relaxed">
                  Connect with others who understand. You're not alone in your journey.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Latest Stories */}
      <section className="relative z-10 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-tea-neutral-800 mb-4">
              Recent Stories
            </h2>
            <p className="text-lg text-tea-neutral-600 max-w-2xl mx-auto">
              See what our community is sharing
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-tea-pink-600" />
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
                {stories.slice(0, 3).map((dbStory) => {
                  const story = formatStory(dbStory);
                  return (
                    <Card
                      key={story.id}
                      className="bg-white/80 backdrop-blur-md border-tea-neutral-200 shadow-lg rounded-xl hover:shadow-xl transition-all duration-300 cursor-pointer"
                      onClick={() => setSelectedStory(dbStory)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-tea-neutral-800 text-lg line-clamp-1">
                            {story.title}
                          </h3>
                          {story.premium && (
                            <Crown className="w-4 h-4 text-tea-green-600" />
                          )}
                        </div>
                        <p className="text-sm text-tea-neutral-600 font-medium">
                          by @{story.author}
                        </p>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-tea-neutral-700 mb-4 leading-relaxed line-clamp-3">
                          {story.preview}
                        </p>

                        <div className="flex items-center justify-between text-sm text-tea-neutral-500 mb-3">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Heart className="w-4 h-4 text-tea-pink-500" />
                              {story.hearts}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4 text-tea-neutral-500" />
                              {story.comments}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-red-600">
                              <Flag className="w-4 h-4" />
                              {story.flags.red}
                            </span>
                            <span className="flex items-center gap-1 text-tea-green-600">
                              <Flag className="w-4 h-4" />
                              {story.flags.green}
                            </span>
                          </div>
                        </div>

                        {story.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {story.tags.slice(0, 2).map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="bg-tea-neutral-100 text-tea-neutral-700 text-xs hover:bg-tea-pink-100 hover:text-tea-pink-700 transition-colors cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/search?q=${encodeURIComponent('#' + tag)}`);
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
                })}
              </div>

              <div className="text-center">
                <Link to="/feed">
                  <Button
                    className="bg-tea-green-600 hover:bg-tea-green-700 text-white rounded-full px-6 py-2 shadow-lg transition-all duration-300 hover:shadow-xl"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View All Stories
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Trending Topics */}
      {trendingTopics.length > 0 && (
        <section className="relative z-10 py-16 bg-tea-green-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-tea-neutral-800 mb-4">
                Trending Topics
              </h2>
              <p className="text-lg text-tea-neutral-600">
                Popular themes in our community
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
              {trendingTopics.map(({ tag, count }) => (
                <Badge
                  key={tag}
                  className="bg-tea-pink-100 text-tea-pink-800 border-tea-pink-300 px-4 py-2 text-sm font-medium rounded-full shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/search?q=${encodeURIComponent('#' + tag)}`)}
                >
                  #{tag} ({count})
                </Badge>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Modals */}
      <StoryModal
        isOpen={showStoryModal}
        onClose={() => setShowStoryModal(false)}
        onSubmit={addStory}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      <StoryViewModal
        isOpen={!!selectedStory}
        onClose={() => setSelectedStory(null)}
        story={selectedStory}
        onLike={updateHearts}
        onFlag={updateStoryFlags}
        onTagClick={(tag) => navigate(`/search?q=${encodeURIComponent('#' + tag)}`)}
      />

      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage?.url || ""}
        title={selectedImage?.title}
        author={selectedImage?.author}
      />
    </div>
  );
}
