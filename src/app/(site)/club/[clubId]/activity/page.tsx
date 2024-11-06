import { Eye, MoreHorizontal } from "lucide-react";
import Image from "next/image";

function ActivityFeed() {
  const activities = [
    { id: 1, user: "Cameron Williamson", club: "Save tree", time: "2 min ago" },
    { id: 2, user: "Cameron Williamson", club: "Save tree", time: "2 min ago" },
    { id: 3, user: "Cameron Williamson", club: "Save tree", time: "2 min ago" },
    { id: 4, user: "Cameron Williamson", club: "Save tree", time: "2 min ago" },
  ];

  return (
    <div className=" bg-white border border-gray-200 rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Activity feed</h2>
        <button className="bg-gray-100 p-2 rounded-full hover:bg-gray-200">
          <span className="text-gray-500 text-sm">Calendar</span>
        </button>
      </div>
      <p className="text-gray-500 text-sm my-2">
        Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet
        consectetur.
      </p>

      <div className="mt-4">
        <div className="text-gray-500 text-sm mb-2">Yesterday</div>
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 ${
              index % 2 === 0 ? "bg-gray-50" : ""
            }`}
          >
            <div className="flex items-center space-x-3">
              <Image
                src={`https://i.pravatar.cc/50?img=${index + 1}`}
                alt="avatar"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-gray-700 text-sm">
                  You like{" "}
                  <span className="font-semibold">{activity.user}</span>
                  {`'s post in`}{" "}
                  <span className="text-blue-600">{activity.club}</span> club.
                </p>
                <p className="text-gray-400 text-xs">{activity.time}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="text-gray-400 hover:text-gray-600">
                <Eye className="w-5 h-5" />
              </button>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <div className="text-gray-500 text-sm mb-2">Today</div>
        {activities.slice(0, 2).map((activity, index) => (
          <div
            key={activity.id + "today"}
            className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 ${
              index % 2 === 0 ? "bg-gray-50" : ""
            }`}
          >
            <div className="flex items-center space-x-3">
              <Image
                src={`https://i.pravatar.cc/50?img=${index + 1}`}
                alt="avatar"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-gray-700 text-sm">
                  You like{" "}
                  <span className="font-semibold">{activity.user}</span>
                  {`'s post in`}{" "}
                  <span className="text-blue-600">{activity.club}</span> club.
                </p>
                <p className="text-gray-400 text-xs">{activity.time}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="text-gray-400 hover:text-gray-600">
                <Eye className="w-5 h-5" />
              </button>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivityFeed;
