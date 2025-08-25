import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Heart,
  Flag,
  MessageCircle,
  Users,
  Crown,
  Share,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import { type Story } from "@/lib/supabase";

interface StoryViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: Story | null;
  onLike?: (storyId: string) => void;
  onFlag?: (storyId: string, type: "red" | "green") => void;
  onTagClick?: (tag: string) => void;
}

export default function StoryViewModal({
  isOpen,
  onClose,
  story,
  onLike,
  onFlag,
  onTagClick,
}: StoryViewModalProps) {
  if (!story) return null;

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
    ex_name: story.ex_name,
    location: story.location,
  });

  const formattedStory = formatStory(story);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white rounded-2xl border-tea-neutral-200">
        <DialogHeader className="border-b border-tea-neutral-200 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-2xl font-bold text-tea-neutral-800">
                {formattedStory.title}
              </DialogTitle>
              {formattedStory.premium && (
                <Crown className="w-5 h-5 text-tea-green-600" />
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-tea-neutral-500 hover:text-tea-neutral-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex items-center justify-between text-sm text-tea-neutral-600">
            <div className="flex items-center gap-4">
              <span className="font-medium">@{formattedStory.author}</span>
              {formattedStory.location && (
                <span>📍 {formattedStory.location}</span>
              )}
              {formattedStory.ex_name && (
                <span>👤 {formattedStory.ex_name}</span>
              )}
            </div>
            <Button variant="ghost" size="sm" className="text-tea-neutral-500">
              <Share className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="py-6 space-y-6">
          {/* Story Image */}
          {formattedStory.image_url && (
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={formattedStory.image_url}
                alt="Story image"
                className="w-full h-64 object-cover"
              />
              {formattedStory.isBlurred && (
                <div className="absolute top-4 right-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-black/50 hover:bg-black/70 text-white border-none backdrop-blur-sm"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Show
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Story Content */}
          <div className="prose prose-tea max-w-none">
            <p className="text-tea-neutral-700 leading-relaxed text-lg whitespace-pre-wrap">
              {formattedStory.preview}
            </p>
          </div>

          {/* Tags */}
          {formattedStory.tags.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-tea-neutral-600">Tags:</h4>
              <div className="flex flex-wrap gap-2">
                {formattedStory.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-tea-neutral-100 text-tea-neutral-700 text-xs font-medium px-3 py-1 rounded-full cursor-pointer hover:bg-tea-pink-100 hover:text-tea-pink-700 transition-colors"
                    onClick={() => onTagClick?.(tag)}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Interaction Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-tea-neutral-200">
            <div className="flex items-center gap-4">
              <button
                onClick={() => onFlag?.(formattedStory.id, "red")}
                className="flex items-center gap-2 hover:bg-red-50 px-3 py-2 rounded-full transition-colors"
              >
                <Flag className="w-5 h-5 text-tea-chaos-red" />
                <span className="text-sm font-bold text-tea-chaos-red">
                  {formattedStory.flags.red}
                </span>
              </button>
              <button
                onClick={() => onFlag?.(formattedStory.id, "green")}
                className="flex items-center gap-2 hover:bg-green-50 px-3 py-2 rounded-full transition-colors"
              >
                <Flag className="w-5 h-5 text-tea-chaos-green" />
                <span className="text-sm font-bold text-tea-chaos-green">
                  {formattedStory.flags.green}
                </span>
              </button>
            </div>
            <div className="flex items-center gap-4 text-sm text-tea-neutral-500">
              <button
                onClick={() => onLike?.(formattedStory.id)}
                className="flex items-center gap-2 font-medium hover:bg-pink-50 px-3 py-2 rounded-full transition-colors"
              >
                <Heart className="w-5 h-5" />
                {formattedStory.hearts.toLocaleString()}
              </button>
              <span className="flex items-center gap-2 font-medium">
                <MessageCircle className="w-5 h-5" />
                {formattedStory.comments}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
