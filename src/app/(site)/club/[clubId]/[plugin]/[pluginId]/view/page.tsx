import React from "react";
import {
  User,
  Eye,
  UserCheck,
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Share2,
  FileText,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import CommentsSection from "@/components/globals/comments/comments-section";

const Page = () => {
  return (
    <div className="max-w-[80%] bg-white p-4">
      {/* Header with ID and Privacy */}
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-xl font-medium">
          Environmental Cleaning and Disinfection in the premises
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">9545/35</span>
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-500">Private</span>
            <MoreVertical className="size-4 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="mb-4 text-sm text-gray-600">
        Patients and visitors who are experiencing symptoms of illness, such as
        fever, cough, or respiratory symptoms, should refrain from visiting the
        hospital.
      </p>

      {/* Tags */}
      <div className="mb-4">
        <div className="mb-1 text-sm text-gray-500">Tags:</div>
        <div className="flex gap-2">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
            Hospital
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
            Nursing
          </span>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6 grid grid-cols-3 gap-4 text-sm">
        <div>
          <div className="text-gray-500">Domain</div>
          <div>Hospital, Doctor</div>
        </div>
        <div>
          <div className="text-gray-500">Category</div>
          <div>Nurse</div>
        </div>
        <div>
          <div className="text-gray-500">Applicable for?</div>
          <div>457</div>
        </div>
      </div>

      {/* Author Info */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-gray-100">
            <span className="text-xs">LA</span>
          </div>
          <div>
            <div className="font-medium">Leslie Alexander</div>
            <div className="text-sm text-gray-500">16 min ago</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Eye className="size-4" />
            <span>{`12.5k Viewer's`}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <UserCheck className="size-4" />
            <span>156 Adopted</span>
          </div>
          <button className="rounded-md bg-green-500 px-4 py-1.5 text-sm text-white">
            Adopt
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mb-8 space-y-4">
        <p>
          • All staff, visitors, and patients must practice proper hand hygiene.
        </p>
        <p>
          • Wash hands with soap and water for at least 20 seconds or use
          alcohol-based hand sanitizer before and after patient contact, after
          touching potentially contaminated surfaces, and before eating or
          handling food.
        </p>
        <p>
          • All staff, visitors, and patients must practice proper hand hygiene.
        </p>
        <p>
          • Wash hands with soap and water for at least 20 seconds or use
          alcohol-based hand sanitizer before and after patient contact, after
          touching potentially contaminated surfaces, and before eating or
          handling food.
        </p>
        <p>
          • All staff, visitors, and patients must practice proper hand hygiene.
        </p>
        <p>
          • Wash hands with soap and water for at least 20 seconds or use
          alcohol-based hand sanitizer before and after patient contact, after
          touching potentially contaminated surfaces, and before eating or
          handling food.
        </p>
      </div>

      {/* Document Info */}
      <div className="mb-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded bg-gray-100">
            <FileText className="size-4" />
          </div>
          <div>
            <div className="text-sm">Document.XYZ</div>
            <div className="text-xs text-gray-500">(PDF • 1.2MB)</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded bg-gray-100">
            <FileText className="size-4" />
          </div>
          <div>
            <div className="text-sm">Document.XYZ</div>
            <div className="text-xs text-gray-500">(PDF • 1.2MB)</div>
          </div>
        </div>
      </div>

      {/* Interaction Bar */}
      <div className="flex items-center justify-between border-t py-4">
        <div className="flex gap-6">
          <button className="flex items-center gap-1">
            <ThumbsUp className="size-4" />
            <span className="text-sm">5k+ Relevant</span>
          </button>
          <button className="flex items-center gap-1">
            <ThumbsDown className="size-4" />
            <span className="text-sm">5k+ Not Relevant</span>
          </button>
          <button className="flex items-center gap-1">
            <MessageCircle className="size-4" />
            <span className="text-sm">Comments</span>
          </button>
          <button className="flex items-center gap-1">
            <Share2 className="size-4" />
            <span className="text-sm">Share</span>
          </button>
        </div>
      </div>

      {/* Comment Input */}
      <div className="border-b p-4">
        <input
          type="text"
          placeholder="Write your comment..."
          className="w-full rounded-lg border bg-gray-50 p-2"
        />
      </div>
      <CommentsSection />
    </div>
  );
};

export default Page;
