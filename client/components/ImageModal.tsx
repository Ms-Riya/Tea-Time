import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, Download, Heart, Share } from "lucide-react";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title?: string;
  author?: string;
}

export default function ImageModal({
  isOpen,
  onClose,
  imageUrl,
  title,
  author,
}: ImageModalProps) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `sour-tea-image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || "Tea Time Story Image",
          text: `Check out this story from ${author || "anonymous"} on Tea Time!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-black/95 border-none">
        <DialogHeader className="absolute top-4 left-4 right-4 z-10">
          <div className="flex items-center justify-between text-white">
            <DialogTitle className="text-white">
              {title && (
                <div>
                  <p className="font-semibold">{title}</p>
                  {author && (
                    <p className="text-sm text-gray-300">by @{author}</p>
                  )}
                </div>
              )}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-white hover:bg-white/20"
              >
                <Share className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                className="text-white hover:bg-white/20"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="relative flex items-center justify-center min-h-[400px] max-h-[80vh]">
          <img
            src={imageUrl}
            alt={title || "Story image"}
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Footer with actions */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-4">
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/20 backdrop-blur-sm text-white border-none hover:bg-white/30"
          >
            <Heart className="w-4 h-4 mr-2" />
            Like Image
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
