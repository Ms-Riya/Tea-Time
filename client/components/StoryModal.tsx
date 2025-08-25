import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  X,
  Heart,
  Flag,
  Eye,
  EyeOff,
  Loader2,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (story: {
    title: string;
    preview: string;
    author: string;
    ex_name: string;
    location: string;
    image_url: string;
    is_blurred: boolean;
    tags: string;
    premium: boolean;
  }) => Promise<void>;
}

export default function StoryModal({
  isOpen,
  onClose,
  onSubmit,
}: StoryModalProps) {
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: "",
    preview: "",
    author: "",
    ex_name: "",
    location: "",
    image_url: "",
    is_blurred: false,
    tags: "",
    premium: false,
  });

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    setUploadingImage(true);

    try {
      // Convert image to base64 for persistence
      const reader = new FileReader();

      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setFormData({ ...formData, image_url: base64 });
        setUploadingImage(false);
      };

      reader.onerror = () => {
        console.error("Error reading file");
        alert("Error reading image file");
        setUploadingImage(false);
      };

      // Read file as base64
      reader.readAsDataURL(file);

      // For production with Supabase Storage (commented out for now):
      // const fileExt = file.name.split('.').pop();
      // const fileName = `stories/${Date.now()}-${Math.random()}.${fileExt}`;
      // const { data, error } = await supabase.storage
      //   .from('story-images')
      //   .upload(fileName, file);
      //
      // if (error) throw error;
      //
      // const { data: { publicUrl } } = supabase.storage
      //   .from('story-images')
      //   .getPublicUrl(fileName);
      //
      // setFormData({ ...formData, image_url: publicUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.preview) return;

    setLoading(true);
    try {
      // Auto-generate author name - will be handled by the parent component
      await onSubmit({
        ...formData,
        author: "", // Will be populated by parent with user info
      });
      setFormData({
        title: "",
        preview: "",
        author: "",
        ex_name: "",
        location: "",
        image_url: "",
        is_blurred: false,
        tags: "",
        premium: false,
      });
      onClose();
    } catch (error) {
      console.error("Error submitting story:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-md border-tea-neutral-200 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-tea-neutral-800 flex items-center gap-2">
            <Heart className="w-6 h-6 text-tea-pink-600" />
            Spill Your Tea ☕
          </DialogTitle>
          <DialogDescription className="text-tea-neutral-600">
            Share your relationship story anonymously. Your secrets are safe
            here! 🌸
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-tea-neutral-700 mb-2 block">
              Story Title *
            </label>
            <Input
              placeholder="e.g., He ghosted me after I paid for dinner 💸"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="border-tea-neutral-300 focus:border-tea-pink-500 focus:ring-2 focus:ring-tea-pink-200"
              required
            />
          </div>

          {/* Preview/Content */}
          <div>
            <label className="text-sm font-medium text-tea-neutral-700 mb-2 block">
              Your Story *
            </label>
            <Textarea
              placeholder="Tell us what happened... Don't hold back on the drama! ☕"
              value={formData.preview}
              onChange={(e) =>
                setFormData({ ...formData, preview: e.target.value })
              }
              className="border-tea-neutral-300 focus:border-tea-pink-500 focus:ring-2 focus:ring-tea-pink-200 min-h-[120px]"
              required
            />
          </div>

          {/* Optional details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-tea-neutral-700 mb-2 block">
                Person's Name (or nickname)
              </label>
              <Input
                placeholder="e.g., Alex, My Partner, The Cute Barista, My Fiancé"
                value={formData.ex_name}
                onChange={(e) =>
                  setFormData({ ...formData, ex_name: e.target.value })
                }
                className="border-tea-neutral-300 focus:border-tea-pink-500 focus:ring-2 focus:ring-tea-pink-200"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-tea-neutral-700 mb-2 block">
                Location
              </label>
              <Input
                placeholder="e.g., Coffee shop downtown, Their apartment"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="border-tea-neutral-300 focus:border-tea-pink-500 focus:ring-2 focus:ring-tea-pink-200"
              />
            </div>
          </div>

          {/* Image Upload - Now Optional */}
          <div>
            <label className="text-sm font-medium text-tea-neutral-700 mb-2 block">
              Upload Image (Optional) 📸
            </label>
            <div className="space-y-4">
              {formData.image_url ? (
                <div className="relative">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setFormData({ ...formData, image_url: "" })}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-tea-neutral-300 rounded-lg p-6 text-center bg-tea-neutral-50">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="space-y-3">
                    <ImageIcon className="w-8 h-8 text-tea-neutral-400 mx-auto" />
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="border-tea-neutral-300 text-tea-neutral-600"
                      >
                        {uploadingImage ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Choose Image
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-tea-neutral-500">
                      Images make your story more engaging, but they're completely optional!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-medium text-tea-neutral-700 mb-2 block">
              Tags (comma separated)
            </label>
            <Input
              placeholder="e.g., red-flags, dating-fails, ghosting"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              className="border-tea-neutral-300 focus:border-tea-pink-500 focus:ring-2 focus:ring-tea-pink-200"
            />
          </div>

          {/* Options */}
          <div className="space-y-4">
            {formData.image_url && (
              <div className="flex items-center justify-between p-4 bg-tea-neutral-50 rounded-xl">
                <div className="flex items-center gap-3">
                  {formData.is_blurred ? (
                    <EyeOff className="w-5 h-5 text-tea-neutral-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-tea-neutral-600" />
                  )}
                  <div>
                    <div className="font-medium text-tea-neutral-800">
                      Blur Images
                    </div>
                    <div className="text-sm text-tea-neutral-600">
                      Make readers click to reveal images
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant={formData.is_blurred ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setFormData({ ...formData, is_blurred: !formData.is_blurred })
                  }
                  className={
                    formData.is_blurred
                      ? "bg-tea-pink-600 hover:bg-tea-pink-700"
                      : ""
                  }
                >
                  {formData.is_blurred ? "Blurred" : "Visible"}
                </Button>
              </div>
            )}

            <div className="flex items-center justify-between p-4 bg-tea-green-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Flag className="w-5 h-5 text-tea-green-600" />
                <div>
                  <div className="font-medium text-tea-neutral-800">
                    Premium Story
                  </div>
                  <div className="text-sm text-tea-neutral-600">
                    Mark as featured content
                  </div>
                </div>
              </div>
              <Button
                type="button"
                variant={formData.premium ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  setFormData({ ...formData, premium: !formData.premium })
                }
                className={
                  formData.premium
                    ? "bg-tea-green-600 hover:bg-tea-green-700"
                    : ""
                }
              >
                {formData.premium ? "Premium" : "Regular"}
              </Button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-tea-neutral-300 text-tea-neutral-600 hover:bg-tea-neutral-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.title || !formData.preview}
              className="flex-1 bg-tea-pink-600 hover:bg-tea-pink-700 text-white"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sharing...
                </div>
              ) : (
                <>
                  <Heart className="w-4 h-4 mr-2" />
                  Share Your Story
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
