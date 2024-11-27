import React from "react";
import Image from "next/image";
import { FileText, File, Video, FileQuestion } from "lucide-react";

interface Attachment {
  url: string;
  filename: string;
  mimetype: string;
}

interface AttachmentPreviewProps {
  attachment: Attachment;
}

const getFileType = (mimetype: string, filename: string): string => {
  // Check MIME type first
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("video/")) return "video";
  if (mimetype === "application/pdf") return "pdf";

  // Fallback to file extension check
  const extension = filename.split(".").pop()?.toLowerCase();

  if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension || ""))
    return "image";
  if (["mp4", "webm", "ogg"].includes(extension || "")) return "video";
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

const AttachmentRenderComponent: React.FC<AttachmentPreviewProps> = ({
  attachment,
}) => {
  const fileType = getFileType(attachment.mimetype, attachment.filename);

  const renderAttachment = () => {
    switch (fileType) {
      case "image":
        return (
          <Image
            src={attachment.url}
            alt={attachment.filename}
            width={300}
            height={200}
            className="rounded-lg object-cover"
          />
        );

      case "video":
        return (
          <video className="max-w-[300px] rounded-lg" controls>
            <source src={attachment.url} type={attachment.mimetype} />
            Your browser does not support video playback.
          </video>
        );

      case "pdf":
        return (
          <a
            href={attachment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg bg-gray-100 p-3 transition-colors hover:bg-gray-200"
          >
            <FileText className="size-8 text-red-500" />
            <div className="overflow-hidden">
              <p className="truncate text-sm font-medium text-gray-900">
                {attachment.filename.split("/").pop()}
              </p>
              <p className="text-xs text-gray-500">PDF Document</p>
            </div>
          </a>
        );

      case "document":
        return (
          <a
            href={attachment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg bg-gray-100 p-3 transition-colors hover:bg-gray-200"
          >
            <File className="size-8 text-blue-500" />
            <div className="overflow-hidden">
              <p className="truncate text-sm font-medium text-gray-900">
                {attachment.filename.split("/").pop()}
              </p>
              <p className="text-xs text-gray-500">Document</p>
            </div>
          </a>
        );

      default:
        return (
          <a
            href={attachment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg bg-gray-100 p-3 transition-colors hover:bg-gray-200"
          >
            <FileQuestion className="size-8 text-gray-500" />
            <div className="overflow-hidden">
              <p className="truncate text-sm font-medium text-gray-900">
                {attachment.filename.split("/").pop()}
              </p>
              <p className="text-xs text-gray-500">
                {attachment.mimetype.split("/").pop()?.toUpperCase()}
              </p>
            </div>
          </a>
        );
    }
  };

  return <div className="mt-2">{renderAttachment()}</div>;
};

export default AttachmentRenderComponent;
