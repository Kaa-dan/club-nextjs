import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Paperclip, Smile, Send, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Endpoints } from "./endpoints";
import { useParams } from "next/navigation";

const CommentInput = () => {
  const { postId } = useParams<{ postId: string }>();

  const [comment, setComment] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const res = await Endpoints.postRulesComment(formData);
      console.log({ res });

      toast.success("Success", {
        description: "Comment posted successfully!",
      });
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

  return (
    <div className="mx-auto w-full max-w-2xl rounded-lg bg-white shadow">
      <div className="border-b p-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Write your comment..."
            className="w-full rounded-lg border bg-gray-50 p-2 pr-24"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isSubmitting}
          />
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
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
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              disabled={isSubmitting}
            >
              <Smile className="size-4" />
            </Button>
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
        <div className="border-t p-4">
          <div className="relative inline-block">
            {preview ? (
              <Image
                src={preview}
                alt="Preview"
                className="max-w-xs rounded-lg border"
                width={100}
                height={100}
              />
            ) : (
              <div className="rounded-lg bg-gray-100 p-4">
                <p className="text-sm text-gray-600">{selectedFile.name}</p>
              </div>
            )}
            <Button
              variant="destructive"
              size="icon"
              className="absolute -right-2 -top-2 size-6 rounded-full"
              onClick={removeFile}
              disabled={isSubmitting}
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentInput;
