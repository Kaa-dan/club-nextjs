import React from "react";
import Image from "next/image";
const ClubRequest = ({ name, role }: any) => {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-sm overflow-hidden border border-gray-300">
          <Image
            width={40}
            height={40}
            alt="user"
            src="https://gratisography.com/wp-content/uploads/2024/01/gratisography-cyber-kitty-800x525.jpg"
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <h3 className="text-sm font-medium">"rishal</h3>
          <p className="text-xs text-gray-500">admin</p>
        </div>
      </div>

      <div className="flex space-x-2">
        <button className="px-4 py-1 text-xs font-medium text-red-600 border border-red-600 rounded hover:bg-red-100">
          Reject
        </button>
        <button className="px-4 py-1 text-xs font-medium text-green-600 border border-green-600 rounded hover:bg-green-100">
          Accept
        </button>
      </div>
    </div>
  );
};

export default ClubRequest;
