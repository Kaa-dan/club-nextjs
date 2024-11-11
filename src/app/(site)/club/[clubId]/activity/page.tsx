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
    <div className=" rounded-lg border border-gray-200 p-4 shadow-md">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <h2 className="text-lg font-semibold">Activity feed</h2>
        <button className="rounded-full bg-gray-100 p-2 hover:bg-gray-200">
          <span className="text-sm text-gray-500">Calendar</span>
        </button>
      </div>
      <p className="my-2 text-sm text-gray-500">
        Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet
        consectetur.
      </p>

      <div className="mt-4">
        <div className="mb-2 text-sm text-gray-500">Yesterday</div>
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className={`flex items-center justify-between rounded-lg p-3 hover:bg-gray-100 ${
              index % 2 === 0 ? "bg-gray-50" : ""
            }`}
          >
            <div className="flex items-center space-x-3">
              <Image
                src={`https://i.pravatar.cc/50?img=${index + 1}`}
                alt="avatar"
                className="size-10 rounded-full"
                width={40}
                height={40}
              />
              <div>
                <p className="text-sm text-gray-700">
                  You like{" "}
                  <span className="font-semibold">{activity.user}</span>
                  {`'s post in`}{" "}
                  <span className="text-blue-600">{activity.club}</span> club.
                </p>
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="text-gray-400 hover:text-gray-600">
                <Eye className="size-5" />
              </button>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="size-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <div className="mb-2 text-sm text-gray-500">Today</div>
        {activities.slice(0, 2).map((activity, index) => (
          <div
            key={activity.id + "today"}
            className={`flex items-center justify-between rounded-lg p-3 hover:bg-gray-100 ${
              index % 2 === 0 ? "bg-gray-50" : ""
            }`}
          >
            <div className="flex items-center space-x-3">
              <Image
                src={`https://i.pravatar.cc/50?img=${index + 1}`}
                alt="avatar"
                className="size-10 rounded-full"
                width={40}
                height={40}
              />
              <div>
                <p className="text-sm text-gray-700">
                  You like{" "}
                  <span className="font-semibold">{activity.user}</span>
                  {`'s post in`}{" "}
                  <span className="text-blue-600">{activity.club}</span> club.
                </p>
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="text-gray-400 hover:text-gray-600">
                <Eye className="size-5" />
              </button>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="size-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivityFeed;
