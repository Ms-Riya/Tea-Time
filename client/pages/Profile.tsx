import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Heart,
  ArrowLeft,
  Zap,
  Edit,
  Mail,
  User,
  Camera,
  Settings,
  Sparkles,
  Cherry,
  Gift,
  Star,
  LogOut,
  Loader2,
} from "lucide-react";
import { supabase, type Profile } from "@/lib/supabase";

export default function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userInfo, setUserInfo] = useState({
    userId: "",
    email: "",
    displayName: "",
    bio: "Spilling the hottest tea since 2024 ☕ Drama connoisseur and red flag detector 🚩",
    profilePicture: "/placeholder.svg",
  });

  // Check authentication and load profile
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error && error.message !== "Network error") {
        console.warn("Session error:", error.message);
        navigate("/login");
        return;
      }

      if (error && error.message === "Network error") {
        console.warn("Network error - using demo profile");
        // Set demo user for offline functionality
        const demoUser = {
          id: "demo-user",
          email: "demo@sourtea.app",
          user_metadata: { name: "Demo User" },
        };
        setUser(demoUser);
        await loadProfile(demoUser.id);
        return;
      }

      if (!session) {
        navigate("/login");
        return;
      }

      setUser(session.user);
      await loadProfile(session.user.id);
    } catch (error: any) {
      console.warn(
        "Network error - using demo profile:",
        error.message || JSON.stringify(error),
      );
      // Use demo profile instead of redirecting
      const demoUser = {
        id: "demo-user",
        email: "demo@sourtea.app",
        user_metadata: { name: "Demo User" },
      };
      setUser(demoUser);
      await loadProfile(demoUser.id);
    }
  };

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error(
          "Error loading profile:",
          error.message || JSON.stringify(error),
        );
        return;
      }

      if (data) {
        setProfile(data);
        setUserInfo({
          userId: data.name || "Tea Lover",
          email: data.email || "",
          displayName: data.name || "Tea Spiller",
          bio:
            data.bio ||
            "Spilling the hottest tea since 2024 ☕ Drama connoisseur and red flag detector ���",
          profilePicture: data.avatar_url || "/placeholder.svg",
        });

        // Calculate real user statistics
        await calculateUserStats(data.id);
      }
    } catch (error: any) {
      console.error(
        "Profile load error:",
        error.message || JSON.stringify(error),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleProfilePictureUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploadingImage(true);

    try {
      // Convert image to base64 for persistence
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;

        // Update user info state immediately with the actual image
        setUserInfo((prev) => ({
          ...prev,
          profilePicture: base64,
        }));

        // Save to database
        const { error } = await supabase
          .from("profiles")
          .update({ avatar_url: base64 })
          .eq("id", user.id);

        if (error) {
          console.error(
            "Error updating profile picture:",
            error.message || JSON.stringify(error),
          );
        }

        setUploadingImage(false);
      };

      reader.onerror = () => {
        console.error("Error reading file");
        setUploadingImage(false);
      };

      reader.readAsDataURL(file);

      // In production, you would upload to Supabase Storage:
      // const fileExt = file.name.split('.').pop();
      // const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      // const { data, error } = await supabase.storage
      //   .from('avatars')
      //   .upload(fileName, file);
      // const { data: { publicUrl } } = supabase.storage
      //   .from('avatars')
      //   .getPublicUrl(fileName);
    } catch (error: any) {
      console.error(
        "Error uploading profile picture:",
        error.message || JSON.stringify(error),
      );
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      // Create profile data object, excluding bio if column doesn't exist yet
      const profileData: any = {
        id: user.id,
        name: userInfo.displayName,
        email: userInfo.email,
        avatar_url: userInfo.profilePicture,
      };

      // Try to include bio, but handle gracefully if column doesn't exist
      try {
        const { error } = await supabase.from("profiles").upsert({
          ...profileData,
          bio: userInfo.bio,
        });

        if (error && error.message.includes("bio")) {
          // Bio column doesn't exist yet, save without it
          const { error: fallbackError } = await supabase
            .from("profiles")
            .upsert(profileData);
          if (fallbackError) {
            console.error(
              "Error saving profile (fallback):",
              fallbackError.message,
            );
            return;
          }
        } else if (error) {
          console.error("Error saving profile:", error.message);
          return;
        }
      } catch (error: any) {
        console.error("Error saving profile:", error.message);
        return;
      }

      setIsEditing(false);
    } catch (error: any) {
      console.error("Save error:", error.message || JSON.stringify(error));
    }
  };

  const [userStats, setUserStats] = useState({
    storiesShared: 0,
    heartsReceived: 0,
    commentsGiven: 0,
    redFlagsSpotted: 0,
    greenFlagsFound: 0,
  });

  // Calculate real user statistics
  const calculateUserStats = async (userId: string) => {
    if (!userId) {
      console.warn("Cannot calculate user stats: userId is empty");
      return;
    }

    try {
      // Get user's stories
      const { data: userStories, error: storiesError } = await supabase
        .from("stories")
        .select("hearts, flags_red, flags_green")
        .eq("author_id", userId);

      if (storiesError) {
        console.error(
          "Error fetching user stories:",
          storiesError.message || JSON.stringify(storiesError),
        );
        return;
      }

      // Get user's comments (optional - table may not exist yet)
      let userComments = null;
      try {
        const { data, error: commentsError } = await supabase
          .from("comments")
          .select("id")
          .eq("author_id", userId);

        if (commentsError) {
          // Comments table doesn't exist or other error - continue without comments
          console.warn("Comments table not available:", commentsError.message);
          userComments = [];
        } else {
          userComments = data;
        }
      } catch (error: any) {
        // Handle network errors or table not found
        console.warn(
          "Could not fetch comments (table may not exist):",
          error.message,
        );
        userComments = [];
      }

      // Calculate stats from real data
      let totalHearts = 0;
      let totalRedFlags = 0;
      let totalGreenFlags = 0;

      userStories?.forEach((story) => {
        totalHearts += parseInt(story.hearts || "0") || 0;
        totalRedFlags += parseInt(story.flags_red || "0") || 0;
        totalGreenFlags += parseInt(story.flags_green || "0") || 0;
      });

      setUserStats({
        storiesShared: userStories?.length || 0,
        heartsReceived: totalHearts,
        commentsGiven: userComments?.length || 0,
        redFlagsSpotted: totalRedFlags,
        greenFlagsFound: totalGreenFlags,
      });
    } catch (error: any) {
      console.error(
        "Error calculating user stats:",
        error.message || JSON.stringify(error),
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-tea-pink-50 via-tea-green-50 to-tea-mint-50">
      {/* Background decorative elements */}
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

      {/* Header */}
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
              <Badge className="bg-tea-pink-100 text-tea-pink-700 border-tea-pink-300 px-3 py-1">
                Profile
              </Badge>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/feed"
                className="text-tea-neutral-600 hover:text-tea-pink-600 font-medium transition-colors duration-300"
              >
                Feed
              </Link>
              <Link
                to="/trending"
                className="text-tea-neutral-600 hover:text-tea-pink-600 font-medium transition-colors duration-300"
              >
                Trending
              </Link>
              <Link
                to="/search"
                className="text-tea-neutral-600 hover:text-tea-pink-600 font-medium transition-colors duration-300"
              >
                Search
              </Link>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-tea-pink-300 text-tea-pink-600 hover:bg-tea-pink-50 rounded-full px-4 py-2"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-tea-pink-600" />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <Card className="bg-white/85 backdrop-blur-md border-tea-neutral-200 shadow-xl rounded-2xl mb-8">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  {/* Profile Picture */}
                  <div className="relative">
                    <Avatar className="w-32 h-32 border-4 border-tea-pink-200 shadow-lg">
                      <AvatarImage
                        src={userInfo.profilePicture}
                        alt="Profile"
                      />
                      <AvatarFallback className="bg-tea-pink-100 text-tea-pink-700 text-2xl font-bold">
                        {userInfo.displayName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                      className="hidden"
                    />
                    <Button
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="absolute -bottom-2 -right-2 bg-tea-pink-500 hover:bg-tea-pink-600 text-white rounded-full p-2 shadow-lg"
                    >
                      {uploadingImage ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Camera className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                      <h2 className="text-3xl font-bold text-tea-neutral-800">
                        {userInfo.displayName}
                      </h2>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                        className="border-tea-pink-300 text-tea-pink-600 hover:bg-tea-pink-50"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-center md:justify-start gap-2 text-tea-neutral-600">
                        <User className="w-4 h-4" />
                        <span className="font-medium">@{userInfo.userId}</span>
                      </div>
                      <div className="flex items-center justify-center md:justify-start gap-2 text-tea-neutral-600">
                        <Mail className="w-4 h-4" />
                        <span>{userInfo.email}</span>
                      </div>
                    </div>

                    <p className="text-tea-neutral-700 mb-4 max-w-md mx-auto md:mx-0">
                      {userInfo.bio}
                    </p>

                    {/* User Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-tea-pink-600">
                          {userStats.storiesShared}
                        </div>
                        <div className="text-sm text-tea-neutral-500">
                          Stories
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-tea-pink-600">
                          {userStats.heartsReceived}
                        </div>
                        <div className="text-sm text-tea-neutral-500">
                          Hearts
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-tea-green-600">
                          {userStats.commentsGiven}
                        </div>
                        <div className="text-sm text-tea-neutral-500">
                          Comments
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-tea-chaos-red">
                          {userStats.redFlagsSpotted}
                        </div>
                        <div className="text-sm text-tea-neutral-500">
                          Red Flags
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-tea-chaos-green">
                          {userStats.greenFlagsFound}
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

            {/* Edit Profile Form */}
            {isEditing && (
              <Card className="bg-white/85 backdrop-blur-md border-tea-neutral-200 shadow-xl rounded-2xl mb-8">
                <CardHeader>
                  <CardTitle className="text-tea-neutral-800 flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Edit Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-tea-neutral-700 mb-2 block">
                        Display Name
                      </label>
                      <Input
                        value={userInfo.displayName}
                        onChange={(e) =>
                          setUserInfo({
                            ...userInfo,
                            displayName: e.target.value,
                          })
                        }
                        className="border-tea-neutral-300 focus:border-tea-pink-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-tea-neutral-700 mb-2 block">
                        User ID
                      </label>
                      <Input
                        value={userInfo.userId}
                        onChange={(e) =>
                          setUserInfo({ ...userInfo, userId: e.target.value })
                        }
                        className="border-tea-neutral-300 focus:border-tea-pink-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-tea-neutral-700 mb-2 block">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={userInfo.email}
                      onChange={(e) =>
                        setUserInfo({ ...userInfo, email: e.target.value })
                      }
                      className="border-tea-neutral-300 focus:border-tea-pink-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-tea-neutral-700 mb-2 block">
                      Bio
                    </label>
                    <textarea
                      value={userInfo.bio}
                      onChange={(e) =>
                        setUserInfo({ ...userInfo, bio: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-tea-neutral-300 rounded-lg focus:border-tea-pink-500 focus:ring-2 focus:ring-tea-pink-200 resize-none"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button
                      className="bg-tea-pink-600 hover:bg-tea-pink-700 text-white"
                      onClick={handleSave}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      className="border-tea-neutral-300 text-tea-neutral-600 hover:bg-tea-neutral-50"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Activity */}
            <Card className="bg-white/85 backdrop-blur-md border-tea-neutral-200 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-tea-neutral-800 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userStats.storiesShared === 0 &&
                userStats.commentsGiven === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-tea-neutral-600">
                      No activity yet. Start by sharing your first story! 🌸
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userStats.storiesShared > 0 && (
                      <div className="flex items-center gap-4 p-4 bg-tea-pink-50 rounded-xl">
                        <div className="w-2 h-2 bg-tea-pink-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-tea-neutral-700">
                            Shared {userStats.storiesShared}{" "}
                            {userStats.storiesShared === 1
                              ? "story"
                              : "stories"}
                          </p>
                          <p className="text-sm text-tea-neutral-500 mt-1">
                            Total stories posted
                          </p>
                        </div>
                        <Badge className="bg-tea-pink-100 text-tea-pink-700">
                          {userStats.heartsReceived} hearts
                        </Badge>
                      </div>
                    )}
                    {userStats.redFlagsSpotted > 0 && (
                      <div className="flex items-center gap-4 p-4 bg-red-50 rounded-xl">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-tea-neutral-700">
                            Collected {userStats.redFlagsSpotted} red{" "}
                            {userStats.redFlagsSpotted === 1 ? "flag" : "flags"}
                          </p>
                          <p className="text-sm text-tea-neutral-500 mt-1">
                            Drama stories
                          </p>
                        </div>
                        <Badge className="bg-red-100 text-red-700">
                          Red Flags
                        </Badge>
                      </div>
                    )}
                    {userStats.greenFlagsFound > 0 && (
                      <div className="flex items-center gap-4 p-4 bg-tea-green-50 rounded-xl">
                        <div className="w-2 h-2 bg-tea-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-tea-neutral-700">
                            Earned {userStats.greenFlagsFound} green{" "}
                            {userStats.greenFlagsFound === 1 ? "flag" : "flags"}
                          </p>
                          <p className="text-sm text-tea-neutral-500 mt-1">
                            Wholesome moments
                          </p>
                        </div>
                        <Badge className="bg-tea-green-100 text-tea-green-700">
                          Green Flags
                        </Badge>
                      </div>
                    )}
                    {userStats.commentsGiven > 0 && (
                      <div className="flex items-center gap-4 p-4 bg-tea-neutral-50 rounded-xl">
                        <div className="w-2 h-2 bg-tea-neutral-400 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-tea-neutral-700">
                            Made {userStats.commentsGiven}{" "}
                            {userStats.commentsGiven === 1
                              ? "comment"
                              : "comments"}
                          </p>
                          <p className="text-sm text-tea-neutral-500 mt-1">
                            Community engagement
                          </p>
                        </div>
                        <Badge className="bg-tea-neutral-100 text-tea-neutral-700">
                          Comments
                        </Badge>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
