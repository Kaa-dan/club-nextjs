import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Paperclip,
  Smile,
  Send,
  X,
  Image as ImageIcon,
  SmilePlus,
} from "lucide-react";
import { toast } from "sonner";
import { Endpoints } from "./endpoints";
import { useParams } from "next/navigation";
import EmojiPicker, { Theme } from "emoji-picker-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import FilePreview from "./file-preview";
import { useCommentsStore } from "@/store/comments-store";
const CommentInput = () => {
  const { postId, plugin } = useParams<{ postId: string; plugin: TPlugins }>();
  const { setComments } = useCommentsStore((state) => state);

  const [comment, setComment] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!comment.trim() && !selectedFile) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("content", comment);
      formData.append("entityId", postId);
      formData.append("entityType", plugin);
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const res = await Endpoints.postRulesComment(formData);
      console.log({ res });
      if (res.data) {
        toast.success("Success", {
          description: "Comment posted successfully!",
        });
        setComments(res.data);
      }

      setComment("");
      removeFile();
    } catch (error) {
      toast.error("Error", {
        description: "Failed to post comment. Please try again.",
      });
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  };

  const handleEmojiClick = (emo: { emoji: string }) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? 0;
    const newComment = comment.slice(0, start) + emo.emoji + comment.slice(end);

    setComment(newComment);

    // Use requestAnimationFrame instead of setTimeout for better browser compatibility
    requestAnimationFrame(() => {
      if (textarea) {
        // Check again inside callback
        const newCursorPosition = start + emo.emoji.length;
        textarea.selectionStart = newCursorPosition;
        textarea.selectionEnd = newCursorPosition;
        textarea.focus();
      }
    });
  };

  return (
    <div className="mx-auto w-full max-w-2xl rounded-lg bg-white shadow">
      <div className="border-b p-4">
        <div className="relative bg-white">
          <textarea
            ref={textareaRef}
            placeholder="Write your comment..."
            className="max-h-[200px] min-h-[40px] w-full resize-none overflow-hidden rounded-lg border bg-gray-50 p-3 pr-24"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              adjustTextareaHeight(e.target);
            }}
            disabled={isSubmitting}
            rows={1}
          />

          <div className="absolute right-2 top-3 flex items-center gap-1 bg-gray-50">
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              disabled={isSubmitting}
            />

            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting}
            >
              <Paperclip className="size-4" />
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  disabled={isSubmitting}
                >
                  <SmilePlus className="size-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="m-0 p-0">
                <EmojiPicker
                  theme={Theme.LIGHT}
                  onEmojiClick={handleEmojiClick}
                />
              </PopoverContent>
            </Popover>

            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              disabled={isSubmitting}
            >
              <ImageIcon className="size-4" />
            </Button>

            {(comment || selectedFile) && (
              <Button
                size="icon"
                className="size-8"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                <Send className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* File Preview */}
      {selectedFile && (
        <FilePreview
          file={selectedFile}
          preview={preview}
          onRemove={removeFile}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default CommentInput;
