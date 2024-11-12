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

const Page = () => {
  return (
    <div className="max-w-[80%] bg-white p-4">
      {/* Header with ID and Privacy */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-xl font-medium">
          Environmental Cleaning and Disinfection in the premises
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">9545/35</span>
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-500">Private</span>
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4">
        Patients and visitors who are experiencing symptoms of illness, such as
        fever, cough, or respiratory symptoms, should refrain from visiting the
        hospital.
      </p>

      {/* Tags */}
      <div className="mb-4">
        <div className="text-sm text-gray-500 mb-1">Tags:</div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
            Hospital
          </span>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
            Nursing
          </span>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-xs">LA</span>
          </div>
          <div>
            <div className="font-medium">Leslie Alexander</div>
            <div className="text-sm text-gray-500">16 min ago</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Eye className="w-4 h-4" />
            <span>12.5k Viewer's</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <UserCheck className="w-4 h-4" />
            <span>156 Adopted</span>
          </div>
          <button className="px-4 py-1.5 bg-green-500 text-white rounded-md text-sm">
            Adopt
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-4 mb-8">
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
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm">Document.XYZ</div>
            <div className="text-xs text-gray-500">(PDF • 1.2MB)</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm">Document.XYZ</div>
            <div className="text-xs text-gray-500">(PDF • 1.2MB)</div>
          </div>
        </div>
      </div>

      {/* Interaction Bar */}
      <div className="flex items-center justify-between py-4 border-t">
        <div className="flex gap-6">
          <button className="flex items-center gap-1">
            <ThumbsUp className="w-4 h-4" />
            <span className="text-sm">5k+ Relevant</span>
          </button>
          <button className="flex items-center gap-1">
            <ThumbsDown className="w-4 h-4" />
            <span className="text-sm">5k+ Not Relevant</span>
          </button>
          <button className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">Comments</span>
          </button>
          <button className="flex items-center gap-1">
            <Share2 className="w-4 h-4" />
            <span className="text-sm">Share</span>
          </button>
        </div>
      </div>

      {/* Comment Input */}
      <div className="p-4 border-b">
        <input
          type="text"
          placeholder="Write your comment..."
          className="w-full p-2 rounded-lg border bg-gray-50"
        />
      </div>
      <div className="flex justify-between p-4 border-b text-blue-500">
        <button className="flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" />
          Previous Rule
        </button>
        <button className="flex items-center gap-1">
          Next Rule
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      {/* Comments Header */}
      <div className="flex justify-between p-4 border-b">
        <div className="font-medium">Comments (1.2k)</div>
        <button className="text-sm text-gray-600 flex items-center gap-1">
          Sort by: Relevance
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      {/* Comments List */}
      <div className="space-y-4 p-4">
        {[
          {
            name: "Leslie Alexander",
            mention: "@Cameron Williamson",
            comment: "Loving your work and profile always be on top up.",
            time: "1 days ago",
            likes: 231,
            dislikes: 23,
          },
          {
            name: "Leslie Alexander",
            mention: "@Cameron Williamson",
            comment: "Loving your work and profile always be on top up.",
            time: "1 days ago",
            likes: 231,
            dislikes: 23,
          },
          {
            name: "Leslie Alexander",
            comment: "Thanks Leslie Alexander",
            time: "3 days ago",
            likes: 231,
            dislikes: 23,
          },
          {
            name: "Guy Hawkins",
            comment:
              "Your most welcome and please follow my club here is my club link",
            time: "3 days ago",
            likes: 231,
            dislikes: 23,
          },
        ].map((comment, index) => (
          <div key={index} className="flex gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">{comment.name}</span>
                  {comment.mention && (
                    <span className="text-green-500 ml-1">
                      {comment.mention}
                    </span>
                  )}
                  <span className="text-gray-500 text-sm ml-2">
                    • {comment.time}
                  </span>
                </div>
                <button>
                  <MoreHorizontal className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <p className="text-sm mt-1">{comment.comment}</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm">{comment.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4 text-red-500 rotate-180" />
                  <span className="text-sm">{comment.dislikes}</span>
                </div>
                <button className="text-sm text-blue-500">Reply</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page ;
