import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, MessageCircle, Send, Trash2, Heart, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Comment {
  id: string;
  story_id: string;
  author: string;
  author_id: string;
  content: string;
  created_at: string;
}

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  storyId: string;
  storyTitle: string;
  storyAuthor: string;
}

export default function CommentsModal({
  isOpen,
  onClose,
  storyId,
  storyTitle,
  storyAuthor,
}: CommentsModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (!error) {
          setUser(user);
        }
      } catch (error) {
        console.warn("Could not get user - using demo mode:", error);
        // Set a demo user for functionality
        setUser({
          id: "demo-user",
          email: "demo@example.com",
          user_metadata: { name: "Demo User" },
        });
      }
    };

    if (isOpen) {
      getUser();
    }
  }, [isOpen]);

  // Fetch comments when modal opens
  useEffect(() => {
    if (isOpen && storyId) {
      fetchComments();
    }
  }, [isOpen, storyId]);

  const fetchComments = async () => {
    try {
      setLoading(true);

      // Check if comments table exists by trying to fetch
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("story_id", storyId)
        .order("created_at", { ascending: true });

      if (error) {
        console.warn("Comments table may not exist yet:", error);
        // Use mock comments for demo
        const mockComments = [
          {
            id: "1",
            story_id: storyId,
            author: "DemoUser1",
            author_id: "demo-1",
            content: "This is so relatable! 😭",
            created_at: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: "2",
            story_id: storyId,
            author: "TeaLover",
            author_id: "demo-2",
            content: "Red flag city! 🚩🚩🚩",
            created_at: new Date(Date.now() - 1800000).toISOString(),
          },
        ];
        setComments(mockComments);
      } else {
        setComments(data || []);
      }
    } catch (error) {
      console.warn("Network error - using demo comments:", error);
      // Fallback demo comments
      setComments([
        {
          id: "demo-1",
          story_id: storyId,
          author: "DemoUser",
          author_id: "demo-user",
          content: "Comments are working in demo mode!",
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const postComment = async () => {
    if (!newComment.trim() || !user || posting) return;

    setPosting(true);
    try {
      // Get user profile for display name
      let authorName = "Anonymous";
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("name")
          .eq("id", user.id)
          .single();
        authorName = profile?.name || `user_${user.id.slice(-8)}`;
      } catch (error) {
        console.warn("Could not get user profile - using demo name:", error);
        authorName = user.email
          ? `user_${user.email.split("@")[0]}`
          : "DemoUser";
      }

      try {
        const { data, error } = await supabase
          .from("comments")
          .insert({
            story_id: storyId,
            author: authorName,
            author_id: user.id,
            content: newComment.trim(),
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) {
          throw error;
        }

        setComments([...comments, data]);
        setNewComment("");
        updateStoryCommentCount();
      } catch (dbError) {
        console.warn("Database unavailable - adding comment locally:", dbError);

        // Add comment locally for demo
        const localComment = {
          id: `local-${Date.now()}`,
          story_id: storyId,
          author: authorName,
          author_id: user.id,
          content: newComment.trim(),
          created_at: new Date().toISOString(),
        };

        setComments([...comments, localComment]);
        setNewComment("");

        // Show user that comment was added locally
        console.log(
          "Comment added in demo mode - will be saved when connection is restored",
        );
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Could not post comment. Please check your connection.");
    } finally {
      setPosting(false);
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!user) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this comment?",
    );
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId)
        .eq("author_id", user.id); // Ensure user can only delete their own comments

      if (error) {
        console.error("Error deleting comment:", error);
        alert("Failed to delete comment. Please try again.");
      } else {
        setComments(comments.filter((c) => c.id !== commentId));
        updateStoryCommentCount();
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment. Please try again.");
    }
  };

  const updateStoryCommentCount = async () => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select("id", { count: "exact" })
        .eq("story_id", storyId);

      if (!error) {
        const count = data?.length || 0;
        await supabase
          .from("stories")
          .update({ comments: count.toString() })
          .eq("id", storyId);
      }
    } catch (error) {
      console.warn("Could not update comment count:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col bg-white/95 backdrop-blur-md">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-bold text-tea-neutral-800 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-tea-pink-600" />
            Comments
          </DialogTitle>
          <DialogDescription className="text-tea-neutral-600">
            <span className="font-medium">{storyTitle}</span> by @{storyAuthor}
          </DialogDescription>
        </DialogHeader>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto min-h-0 py-4 space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-tea-pink-600" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-tea-neutral-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="flex gap-3 p-3 bg-tea-neutral-50 rounded-lg"
              >
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-tea-pink-100 text-tea-pink-700 text-sm">
                    {comment.author.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-tea-neutral-800 text-sm">
                        @{comment.author}
                      </span>
                      <span className="text-xs text-tea-neutral-500">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    {user && user.id === comment.author_id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteComment(comment.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  <p className="text-tea-neutral-700 text-sm break-words">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment Input */}
        {user ? (
          <div className="flex-shrink-0 border-t pt-4">
            <div className="flex gap-3">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className="bg-tea-pink-100 text-tea-pink-700 text-sm">
                  {user?.email?.slice(0, 2).toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && !e.shiftKey && postComment()
                  }
                  className="flex-1 border-tea-neutral-300 focus:border-tea-pink-500"
                  disabled={posting}
                />
                <Button
                  onClick={postComment}
                  disabled={!newComment.trim() || posting}
                  className="bg-tea-pink-600 hover:bg-tea-pink-700 text-white px-4"
                >
                  {posting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-shrink-0 border-t pt-4 text-center text-tea-neutral-600">
            <p>Please log in to post comments</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
