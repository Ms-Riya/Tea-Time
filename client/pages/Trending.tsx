import { useState, useEffect } from "react";
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
  TrendingUp,
  Plus,
  MessageCircle,
  Sparkles,
  Trophy,
  Zap,
  BarChart3,
  Eye,
  EyeOff,
  Flag,
  Loader2,
  Gift,
  Crown,
  Image as ImageIcon,
} from "lucide-react";
import { useRealtimeStories } from "@/hooks/useRealtime";
import StoryModal from "@/components/StoryModal";
import ImageModal from "@/components/ImageModal";
import StoryViewModal from "@/components/StoryViewModal";
import { supabase, type Story } from "@/lib/supabase";

export default function Trending() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [imageBlurStates, setImageBlurStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
    author: string;
  } | null>(null);
  const [timeFilter, setTimeFilter] = useState<"week" | "all">("week");

  const { stories, loading, addStory, updateStoryFlags, updateHearts } =
    useRealtimeStories();

  // Filter stories based on search query
  const filteredStories = stories.filter((story) => {
    if (!searchQuery.trim()) return true;

    let query = searchQuery.toLowerCase().trim();

    // Handle hashtag searches - remove # and search in tags
    if (query.startsWith("#")) {
      const tagQuery = query.substring(1); // Remove the #
      const tags = (story.tags || "").toLowerCase();
      const tagArray = tags.split(",").map((tag) => tag.trim());

      // Check if any tag contains the search term (partial matching)
      return tagArray.some((tag) => tag.includes(tagQuery));
    }

    // Regular search in all fields
    const title = (story.title || "").toLowerCase();
    const preview = (story.preview || "").toLowerCase();
    const author = (story.author || "").toLowerCase();
    const tags = (story.tags || "").toLowerCase();

    return (
      title.includes(query) ||
      preview.includes(query) ||
      author.includes(query) ||
      tags.includes(query)
    );
  });

  // Get trending stories (sorted by hearts/likes)
  const trendingStories = (searchQuery.trim() ? filteredStories : stories)
    .map((story) => ({
      ...story,
      heartsCount: parseInt(story.hearts || "0") || 0,
    }))
    .sort((a, b) => b.heartsCount - a.heartsCount)
    .slice(0, 10); // Top 10 trending

  // Initialize blur states for stories with images
  useEffect(() => {
    const blurStates: { [key: string]: boolean } = {};
    trendingStories.forEach((story) => {
      if (story.image_url && story.is_blurred) {
        if (!(story.id in imageBlurStates)) {
          blurStates[story.id] = true;
        }
      }
    });
    if (Object.keys(blurStates).length > 0) {
      setImageBlurStates((prev) => ({ ...prev, ...blurStates }));
    }
  }, [trendingStories]);

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
          <Flame size={22} className="animate-pulse delay-75" />
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
                <Flame className="w-4 h-4 mr-1" />
                Trending
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
                className="text-tea-pink-600 font-medium border-b-2 border-tea-pink-500 pb-1"
              >
                Trending
              </Link>
              <Link
                to="/search"
                className="text-tea-neutral-600 hover:text-tea-pink-600 font-medium transition-colors duration-300 relative group"
              >
                Search
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
                onClick={() => setShowStoryModal(true)}
              >
                Spill Tea
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
              What's Trending 🔥
            </h2>
            <p className="text-xl text-tea-neutral-600 mb-10 max-w-2xl mx-auto">
              The most loved stories with the highest hearts and engagement
              right now
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-10">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-tea-neutral-400 h-5 w-5 transition-colors group-focus-within:text-tea-pink-600" />
                <Input
                  placeholder="Search trending stories..."
                  className="pl-12 pr-4 py-4 text-lg rounded-2xl border-tea-neutral-300 bg-white/90 backdrop-blur-sm focus:border-tea-pink-500 focus:ring-2 focus:ring-tea-pink-200 shadow-lg transition-all duration-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button
                variant={timeFilter === "week" ? "default" : "outline"}
                className={
                  timeFilter === "week"
                    ? "bg-tea-pink-600 hover:bg-tea-pink-700 text-white rounded-2xl px-8 py-3 shadow-lg"
                    : "border-2 border-tea-pink-300 text-tea-pink-700 hover:bg-tea-pink-50 rounded-2xl px-8 py-3 shadow-lg transition-all duration-300"
                }
                onClick={() => setTimeFilter("week")}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                This Week
              </Button>
              <Button
                variant={timeFilter === "all" ? "default" : "outline"}
                className={
                  timeFilter === "all"
                    ? "bg-tea-green-600 hover:bg-tea-green-700 text-white rounded-2xl px-8 py-3 shadow-lg"
                    : "border-2 border-tea-green-300 text-tea-green-700 hover:bg-tea-green-50 rounded-2xl px-8 py-3 shadow-lg transition-all duration-300"
                }
                onClick={() => setTimeFilter("all")}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                All Time
              </Button>
            </div>
          </div>

          {/* Trending Stories */}
          <div className="space-y-8">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-tea-pink-600" />
              </div>
            ) : trendingStories.length === 0 ? (
              <Card className="bg-white/85 backdrop-blur-md border-tea-neutral-200 shadow-xl rounded-2xl text-center py-20">
                <CardContent>
                  <div className="w-20 h-20 bg-tea-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <TrendingUp className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-tea-neutral-800 mb-4">
                    No Trending Stories Yet
                  </h3>
                  <p className="text-tea-neutral-600 mb-8 max-w-lg mx-auto">
                    Be the first to create a viral story! Share your drama and
                    watch it trend 🔥
                  </p>
                  <Button
                    className="bg-tea-pink-600 hover:bg-tea-pink-700 text-white"
                    onClick={() => setShowStoryModal(true)}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Start the Trend
                  </Button>
                </CardContent>
              </Card>
            ) : (
              trendingStories.map((dbStory, index) => {
                const story = formatStory(dbStory);
                const isImageBlurred = imageBlurStates[story.id];

                return (
                  <Card
                    key={story.id}
                    className="bg-white/85 backdrop-blur-md border-tea-neutral-200 shadow-xl rounded-2xl cursor-pointer"
                    onClick={() => setSelectedStory(dbStory)}
                  >
                    <CardContent className="p-8">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                                  index === 0
                                    ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                                    : index === 1
                                      ? "bg-gradient-to-r from-gray-400 to-gray-600"
                                      : index === 2
                                        ? "bg-gradient-to-r from-orange-400 to-orange-600"
                                        : "bg-tea-pink-500"
                                }`}
                              >
                                #{index + 1}
                              </div>
                              <h3 className="font-bold text-tea-neutral-800 text-xl">
                                {story.title}
                              </h3>
                            </div>
                            {story.premium && (
                              <Crown className="w-5 h-5 text-tea-green-600" />
                            )}
                            {index < 3 && (
                              <Trophy
                                className={`w-5 h-5 ${
                                  index === 0
                                    ? "text-yellow-500"
                                    : index === 1
                                      ? "text-gray-500"
                                      : "text-orange-500"
                                }`}
                              />
                            )}
                          </div>
                          <p className="text-sm text-tea-neutral-600 mb-3 font-medium">
                            @{story.author} • {story.hearts.toLocaleString()}{" "}
                            hearts
                          </p>
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
                                {isImageBlurred ? (
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => showImage(story.id)}
                                    className="bg-black/50 hover:bg-black/70 text-white border-none backdrop-blur-sm"
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    Show
                                  </Button>
                                ) : (
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => hideImage(story.id)}
                                    className="bg-black/50 hover:bg-black/70 text-white border-none backdrop-blur-sm"
                                  >
                                    <EyeOff className="w-4 h-4 mr-1" />
                                    Hide
                                  </Button>
                                )}
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
                            onClick={() => updateStoryFlags(story.id, "red")}
                            className="flex items-center gap-1 hover:bg-red-50 px-3 py-2 rounded-full transition-colors"
                          >
                            <Flag className="w-4 h-4 text-tea-chaos-red" />
                            <span className="text-sm font-bold text-tea-chaos-red">
                              {story.flags.red}
                            </span>
                          </button>
                          <button
                            onClick={() => updateStoryFlags(story.id, "green")}
                            className="flex items-center gap-1 hover:bg-green-50 px-3 py-2 rounded-full transition-colors"
                          >
                            <Flag className="w-4 h-4 text-tea-chaos-green" />
                            <span className="text-sm font-bold text-tea-chaos-green">
                              {story.flags.green}
                            </span>
                          </button>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-tea-neutral-500">
                          <button
                            onClick={() => updateHearts(story.id)}
                            className="flex items-center gap-1 font-medium hover:bg-pink-50 px-3 py-2 rounded-full transition-colors"
                          >
                            <Heart className="w-4 h-4" />
                            {(story.hearts || 0).toLocaleString()}
                          </button>
                          <span className="flex items-center gap-1 font-medium">
                            <MessageCircle className="w-4 h-4" />
                            {story.comments}
                          </span>
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
              })
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

      {/* Image Modal */}
      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage?.url || ""}
        title={selectedImage?.title}
        author={selectedImage?.author}
      />

      <StoryViewModal
        isOpen={!!selectedStory}
        onClose={() => setSelectedStory(null)}
        story={selectedStory}
        onLike={updateHearts}
        onFlag={updateStoryFlags}
        onTagClick={(tag) =>
          navigate(`/search?q=${encodeURIComponent("#" + tag)}`)
        }
      />
    </div>
  );
}
