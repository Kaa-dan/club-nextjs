import React from "react";
import Image from "next/image";
import { ICONS } from "@/lib/constants";
import { ChevronRight } from "lucide-react";

const page = () => {
  return (
    <>
      <div className="flex items-center justify-center my-4">
        <div className="w-16 border-t border-gray-300"></div>
        <span className="mx-2 text-gray-800 ">Approvals</span>
        <div className="w-16 border-t border-gray-300"></div>
      </div>

      <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
        <div className="flex items-center   ">
          <div className="p-4">
            <Image
              src={ICONS.ApprovalIcon}
              alt="approval-icon"
              height={25}
              width={25}
            />
          </div>
          <div className="flex-col ">
            <h1 className="font-medium text-xs">Members Approval</h1>
            <p className="text-xs text-gray-600">
              Evaluate and decide on requests by either approving or rejecting
              them.
            </p>
          </div>
        </div>
        <div className="flex justify-between gap-5">
          <div className="bg-orange-500   p-2   rounded-xl">
            <p className="text-white text-xs text-center ">1000+</p>
          </div>

          <div>
            <ChevronRight />
          </div>
        </div>
      </div>
      <div>
        <div className="bg-white border rounded-lg p-4 shadow-sm mt-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Image
                src="https://img.freepik.com/premium-photo/stylish-man-flat-vector-profile-picture-ai-generated_606187-310.jpg?semt=ais_hybrid" // Replace with your image source
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="ml-3">
                <h3 className="font-medium text-gray-800">
                  Cameron Williamson
                </h3>
                <p className="text-sm text-gray-500">
                  UI UX Designer •{" "}
                  <a href="#" className="text-green-500">
                    News & events
                  </a>{" "}
                  • 2 min ago
                </p>
              </div>
            </div>
            <button className="text-gray-800 hover:text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6h.01M12 12h.01M12 18h.01"
                />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="mb-4 text-gray-700">
            <p className="text-sm">
              Creating a code of conduct for a social media group is essential
              to maintain a positive and respectful online community. Here are
              some general rules and guidelines you might consider.
            </p>
            <p className="text-sm">
              Creating a code of conduct for a social media group is essential
              to maintain a positive and respectful online community. Here are
              some general rules and guidelines you might consider.{" "}
              <a href="#" className="text-blue-500">
                see more
              </a>
            </p>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2">
            <button className="px-2 py-2 text-xs text-red-600 border border-red-600 rounded-md hover:bg-red-50">
              ✕ Reject
            </button>
            <button className="text-xs px-2 py-2 text-green-600 border border-green-600 rounded-md hover:bg-green-50">
              ✓ Accept
            </button>
          </div>
        </div>
        <div className="bg-white border rounded-lg p-4 shadow-sm mt-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Image
                src="https://img.freepik.com/premium-photo/stylish-man-flat-vector-profile-picture-ai-generated_606187-310.jpg?semt=ais_hybrid" // Replace with your image source
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="ml-3">
                <h3 className="font-medium text-gray-800">
                  Cameron Williamson
                </h3>
                <p className="text-sm text-gray-500">
                  UI UX Designer •{" "}
                  <a href="#" className="text-green-500">
                    News & events
                  </a>{" "}
                  • 2 min ago
                </p>
              </div>
            </div>
            <button className="text-gray-800 hover:text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6h.01M12 12h.01M12 18h.01"
                />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="mb-4 text-gray-700">
            <p className="text-sm">
              Creating a code of conduct for a social media group is essential
              to maintain a positive and respectful online community. Here are
              some general rules and guidelines you might consider.
            </p>
            <p className="text-sm">
              Creating a code of conduct for a social media group is essential
              to maintain a positive and respectful online community. Here are
              some general rules and guidelines you might consider.{" "}
              <a href="#" className="text-blue-500">
                see more
              </a>
            </p>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2">
            <button className="px-2 py-2 text-xs text-red-600 border border-red-600 rounded-md hover:bg-red-50">
              ✕ Reject
            </button>
            <button className="text-xs px-2 py-2 text-green-600 border border-green-600 rounded-md hover:bg-green-50">
              ✓ Accept
            </button>
          </div>
        </div>
        <div className="bg-white border rounded-lg p-4 shadow-sm mt-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Image
                src="https://img.freepik.com/premium-photo/stylish-man-flat-vector-profile-picture-ai-generated_606187-310.jpg?semt=ais_hybrid" // Replace with your image source
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="ml-3">
                <h3 className="font-medium text-gray-800">
                  Cameron Williamson
                </h3>
                <p className="text-sm text-gray-500">
                  UI UX Designer •{" "}
                  <a href="#" className="text-green-500">
                    News & events
                  </a>{" "}
                  • 2 min ago
                </p>
              </div>
            </div>
            <button className="text-gray-800 hover:text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6h.01M12 12h.01M12 18h.01"
                />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="mb-4 text-gray-700">
            <p className="text-sm">
              Creating a code of conduct for a social media group is essential
              to maintain a positive and respectful online community. Here are
              some general rules and guidelines you might consider.
            </p>
            <p className="text-sm">
              Creating a code of conduct for a social media group is essential
              to maintain a positive and respectful online community. Here are
              some general rules and guidelines you might consider.{" "}
              <a href="#" className="text-blue-500">
                see more
              </a>
            </p>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2">
            <button className="px-2 py-2 text-xs text-red-600 border border-red-600 rounded-md hover:bg-red-50">
              ✕ Reject
            </button>
            <button className="text-xs px-2 py-2 text-green-600 border border-green-600 rounded-md hover:bg-green-50">
              ✓ Accept
            </button>
          </div>
        </div>
        <div className="bg-white border rounded-lg p-4 shadow-sm mt-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Image
                src="https://img.freepik.com/premium-photo/stylish-man-flat-vector-profile-picture-ai-generated_606187-310.jpg?semt=ais_hybrid" // Replace with your image source
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="ml-3">
                <h3 className="font-medium text-gray-800">
                  Cameron Williamson
                </h3>
                <p className="text-sm text-gray-500">
                  UI UX Designer •{" "}
                  <a href="#" className="text-green-500">
                    News & events
                  </a>{" "}
                  • 2 min ago
                </p>
              </div>
            </div>
            <button className="text-gray-800 hover:text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6h.01M12 12h.01M12 18h.01"
                />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="mb-4 text-gray-700">
            <p className="text-sm">
              Creating a code of conduct for a social media group is essential
              to maintain a positive and respectful online community. Here are
              some general rules and guidelines you might consider.
            </p>
            <p className="text-sm">
              Creating a code of conduct for a social media group is essential
              to maintain a positive and respectful online community. Here are
              some general rules and guidelines you might consider.{" "}
              <a href="#" className="text-blue-500">
                see more
              </a>
            </p>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2">
            <button className="px-2 py-2 text-xs text-red-600 border border-red-600 rounded-md hover:bg-red-50">
              ✕ Reject
            </button>
            <button className="text-xs px-2 py-2 text-green-600 border border-green-600 rounded-md hover:bg-green-50">
              ✓ Accept
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
