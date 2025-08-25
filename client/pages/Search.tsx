import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Heart,
  Search as SearchIcon,
  Flame,
  Star,
  Cherry,
  ArrowLeft,
  Plus,
  Filter,
  Hash,
  MessageCircle,
  Sparkles,
  Zap,
  Compass,
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

export default function Search() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [selectedStoryForView, setSelectedStoryForView] =
    useState<Story | null>(null);
  const [imageBlurStates, setImageBlurStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
    author: string;
  } | null>(null);

  const { stories, loading, addStory, updateStoryFlags, updateHearts } =
    useRealtimeStories();

  // Initialize search query from URL parameter
  useEffect(() => {
    const queryParam = searchParams.get("q");
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [searchParams]);

  const popularSearches = [
    "toxic ex stories",
    "green flag kings",
    "first date disasters",
    "situationship drama",
    "red flag warnings",
    "wholesome moments",
    "dating app fails",
    "relationship advice",
  ];

  // Extract all unique tags from stories
  const allAvailableTags = React.useMemo(() => {
    const tagSet = new Set<string>();
    stories.forEach((story) => {
      if (story.tags) {
        const tags = story.tags.split(",").map((tag) => tag.trim());
        tags.forEach((tag) => {
          if (tag) tagSet.add(tag);
        });
      }
    });
    return Array.from(tagSet).sort();
  }, [stories]);

  // Get tag frequency for trending
  const tagFrequency = React.useMemo(() => {
    const frequency: { [key: string]: number } = {};
    stories.forEach((story) => {
      if (story.tags) {
        const tags = story.tags.split(",").map((tag) => tag.trim());
        tags.forEach((tag) => {
          if (tag) {
            frequency[tag] = (frequency[tag] || 0) + 1;
          }
        });
      }
    });
    return frequency;
  }, [stories]);

  // Top trending hashtags by frequency
  const trendingHashtags = React.useMemo(() => {
    return Object.entries(tagFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 12)
      .map(([tag, count]) => ({ tag, count }));
  }, [tagFrequency]);

  // Get suggested tags based on search query
  const suggestedTags = React.useMemo(() => {
    if (!searchQuery.trim()) return [];

    let query = searchQuery.toLowerCase().trim();
    if (query.startsWith("#")) {
      query = query.substring(1);
    }

    return allAvailableTags
      .filter((tag) => tag.toLowerCase().includes(query))
      .sort((a, b) => (tagFrequency[b] || 0) - (tagFrequency[a] || 0))
      .slice(0, 8);
  }, [searchQuery, allAvailableTags, tagFrequency]);

  // Filter stories based on search query
  const searchResults = stories.filter((story) => {
    if (!searchQuery.trim()) return false;

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

  // Initialize blur states for stories with images
  useEffect(() => {
    const blurStates: { [key: string]: boolean } = {};
    searchResults.forEach((story) => {
      if (story.image_url && story.is_blurred) {
        if (!(story.id in imageBlurStates)) {
          blurStates[story.id] = true;
        }
      }
    });
    if (Object.keys(blurStates).length > 0) {
      setImageBlurStates((prev) => ({ ...prev, ...blurStates }));
    }
  }, [searchResults]);

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
          <SearchIcon size={22} className="animate-pulse delay-75" />
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
                <SearchIcon className="w-4 h-4 mr-1" />
                Search
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
                to="/search"
                className="text-tea-pink-600 font-medium border-b-2 border-tea-pink-500 pb-1"
              >
                Search
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
          {/* Search Header */}
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-tea-neutral-800 mb-6">
              Find Your Tea 🔍
            </h2>
            <p className="text-xl text-tea-neutral-600 mb-10 max-w-2xl mx-auto">
              Search through stories, discover trending hashtags, and find
              exactly the drama you're looking for
            </p>

            {/* Premium Search Bar */}
            <div className="max-w-2xl mx-auto mb-10">
              <div className="relative group">
                <SearchIcon className="absolute left-5 top-1/2 transform -translate-y-1/2 text-tea-neutral-400 h-6 w-6 transition-colors group-focus-within:text-tea-pink-600" />
                <Input
                  placeholder="Search for stories, hashtags, or drama..."
                  className="pl-14 pr-4 py-5 text-lg rounded-2xl border-tea-neutral-300 bg-white/90 backdrop-blur-sm focus:border-tea-pink-500 focus:ring-2 focus:ring-tea-pink-200 shadow-lg transition-all duration-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                className="border-2 border-tea-pink-300 text-tea-pink-700 hover:bg-tea-pink-50 rounded-2xl px-8 py-3 shadow-lg transition-all duration-300"
              >
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
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

          {/* Search Results */}
          {searchQuery.trim() ? (
            <div className="mb-16">
              {/* Suggested Tags */}
              {suggestedTags.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-tea-neutral-800 mb-4">
                    📌 Suggested Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {suggestedTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="bg-tea-green-50 border-tea-green-300 text-tea-green-700 hover:bg-tea-green-100 cursor-pointer transition-colors duration-300 px-3 py-2 rounded-full"
                        onClick={() => setSearchQuery("#" + tag)}
                      >
                        #{tag} ({tagFrequency[tag] || 0} stories)
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <h3 className="text-2xl font-bold text-tea-neutral-800 mb-6">
                Search Results ({searchResults.length})
              </h3>
              <div className="space-y-8">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-tea-pink-600" />
                  </div>
                ) : searchResults.length === 0 ? (
                  <Card className="bg-white/85 backdrop-blur-md border-tea-neutral-200 shadow-xl rounded-2xl text-center py-12">
                    <CardContent>
                      <SearchIcon className="w-16 h-16 text-tea-neutral-400 mx-auto mb-4" />
                      <h4 className="text-xl font-bold text-tea-neutral-800 mb-2">
                        No results found
                      </h4>
                      <p className="text-tea-neutral-600">
                        Try different keywords or check out trending searches
                        below
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  searchResults.map((dbStory) => {
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
                              <p className="text-sm text-tea-neutral-600 mb-3 font-medium">
                                @{story.author}
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
                                onClick={() =>
                                  updateStoryFlags(story.id, "red")
                                }
                                className="flex items-center gap-1 hover:bg-red-50 px-3 py-2 rounded-full transition-colors"
                              >
                                <Flag className="w-4 h-4 text-tea-chaos-red" />
                                <span className="text-sm font-bold text-tea-chaos-red">
                                  {story.flags.red}
                                </span>
                              </button>
                              <button
                                onClick={() =>
                                  updateStoryFlags(story.id, "green")
                                }
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
                                    setSearchQuery("#" + tag);
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
          ) : (
            /* Popular Searches & Hashtags when no search */
            <div className="grid md:grid-cols-2 gap-10 mb-16">
              {/* Popular Searches */}
              <Card className="bg-white/70 backdrop-blur-md border-tea-neutral-200 rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-tea-pink-700 flex items-center gap-2">
                    <Flame className="w-5 h-5" />
                    Popular Searches
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {popularSearches.map((search, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="border-tea-neutral-300 text-tea-neutral-700 hover:bg-tea-pink-50 hover:border-tea-pink-400 hover:text-tea-pink-700 rounded-full text-sm transition-all duration-300"
                        onClick={() => setSearchQuery(search)}
                      >
                        {search}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Trending Hashtags */}
              <Card className="bg-white/70 backdrop-blur-md border-tea-neutral-200 rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-tea-green-700 flex items-center gap-2">
                    <Hash className="w-5 h-5" />
                    Trending Hashtags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {trendingHashtags.map(({ tag, count }) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-tea-green-100 text-tea-green-700 hover:bg-tea-green-200 cursor-pointer transition-colors duration-300 px-3 py-2 rounded-full text-sm font-medium"
                        onClick={() => setSearchQuery("#" + tag)}
                      >
                        #{tag} ({count})
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* All Available Tags */}
          {!searchQuery.trim() && allAvailableTags.length > 0 && (
            <div className="mb-16">
              <Card className="bg-white/70 backdrop-blur-md border-tea-neutral-200 rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-tea-pink-700 flex items-center gap-2">
                    <Hash className="w-5 h-5" />
                    All Available Tags ({allAvailableTags.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                    {allAvailableTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="bg-tea-neutral-50 text-tea-neutral-700 hover:bg-tea-pink-100 hover:text-tea-pink-700 cursor-pointer transition-colors duration-300 px-2 py-1 rounded-full text-xs"
                        onClick={() => setSearchQuery("#" + tag)}
                      >
                        #{tag} ({tagFrequency[tag] || 0})
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Back to Home */}
          {!searchQuery.trim() && (
            <div className="text-center">
              <Link to="/">
                <Button className="bg-tea-pink-600 hover:bg-tea-pink-700 text-white rounded-2xl px-12 py-4 text-lg shadow-lg transition-all duration-300 hover:shadow-xl">
                  <Heart className="w-5 h-5 mr-3" />
                  Browse All Stories
                </Button>
              </Link>
            </div>
          )}
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
        isOpen={!!selectedStoryForView}
        onClose={() => setSelectedStoryForView(null)}
        story={selectedStoryForView}
        onLike={updateHearts}
        onFlag={updateStoryFlags}
        onTagClick={(tag) => setSearchQuery("#" + tag)}
      />
    </div>
  );
}
