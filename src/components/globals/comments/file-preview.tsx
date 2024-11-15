import React from "react";
import { Button } from "@/components/ui/button";
import { X, FileText, File, Video, FileQuestion } from "lucide-react";
import Image from "next/image";

interface FilePreviewProps {
  file: File;
  preview: string | null;
  onRemove: () => void;
  isSubmitting: boolean;
}

const getFileType = (file: File): TFileType => {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  if (extension === "pdf") return "pdf";
  if (
    ["doc", "docx", "txt", "xls", "xlsx", "ppt", "pptx"].includes(
      extension || ""
    )
  ) {
    return "document";
  }

  return "unknown";
};

const getFileIcon = (type: TFileType) => {
  switch (type) {
    case "pdf":
      return "file-text";
    case "document":
      return "file";
    case "video":
      return "video";
    default:
      return "file-question";
  }
};

const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  preview,
  onRemove,
  isSubmitting,
}) => {
  const fileType = getFileType(file);

  const renderPreview = () => {
    switch (fileType) {
      case "image":
        return (
          <Image
            src={preview || ""}
            alt={file.name}
            className="max-w-xs rounded-lg border object-cover"
            width={200}
            height={200}
          />
        );

      case "video":
        return (
          <video
            className="max-w-xs rounded-lg border"
            width={200}
            height={200}
            controls
          >
            <source src={preview || ""} type={file.type} />
            Your browser does not support the video tag.
          </video>
        );

      case "pdf":
        return (
          <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-4">
            <FileText className="size-8 text-red-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        );

      case "document":
        return (
          <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-4">
            <File className="size-8 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-4">
            <FileQuestion className="size-8 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="border-t p-4">
      <div className="relative inline-block">
        {renderPreview()}
        <Button
          variant="destructive"
          size="icon"
          className="absolute -right-2 -top-2 size-6 rounded-full"
          onClick={onRemove}
          disabled={isSubmitting}
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  );
};

export default FilePreview;
