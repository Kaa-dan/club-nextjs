// import React, { useState, useEffect } from "react";
// import {
//   HoverCard,
//   HoverCardContent,
//   HoverCardTrigger,
// } from "@/components/ui/hover-card";
// import { Skeleton } from "@/components/ui/skeleton";
// import Image from "next/image";
// import { withTokenAxios } from "@/lib/mainAxios";

// interface UserProfile {
//   firstName: string;
//   lastName: string;
//   email: string;
//   profileImage: string;
//   interests: string[];
//   // Add other user fields as needed
// }

// interface UserHoverProps {
//   username: string;
//   userData?: UserProfile;
//   children: React.ReactNode;
// }

// const LoadingSkeleton = () => (
//   <div className="flex gap-4">
//     <Skeleton className="size-12 rounded-full" />
//     <div className="flex-1 space-y-2">
//       <Skeleton className="h-4 w-[120px]" />
//       <Skeleton className="h-3 w-[160px]" />
//       <div className="mt-4 flex flex-wrap gap-2">
//         <Skeleton className="h-5 w-16 rounded-full" />
//         <Skeleton className="h-5 w-20 rounded-full" />
//         <Skeleton className="h-5 w-24 rounded-full" />
//       </div>
//     </div>
//   </div>
// );

// const UserHoverCard: React.FC<UserHoverProps> = ({
//   username,
//   userData,
//   children,
// }) => {
//   const [user, setUser] = useState<UserProfile | null>(userData || null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (userData) {
//       setUser(userData);
//       return;
//     }

//     let isMounted = true;

//     const fetchUserData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const response = await withTokenAxios.get(
//           `/users/username?term=${username}`
//         );
//         console.log("resda", response?.data?.data);
//         if (isMounted) {
//           setUser(response?.data?.data);
//         }
//       } catch (err) {
//         if (isMounted) {
//           setError("Failed to load user data");
//           console.error("Error fetching user data:", err);
//         }
//       } finally {
//         if (isMounted) {
//           setLoading(false);
//         }
//       }
//     };

//     // Only fetch if we don't have user data
//     const timer = setTimeout(fetchUserData, 200);

//     return () => {
//       isMounted = false;
//       clearTimeout(timer);
//     };
//   }, [username, userData]);

//   const renderContent = () => {
//     if (loading) {
//       return <LoadingSkeleton />;
//     }

//     if (error) {
//       return (
//         <div className="flex items-center gap-2 p-2 text-sm text-red-500">
//           <span className="rounded-full bg-red-100 p-1 text-red-500">⚠️</span>
//           {error}
//         </div>
//       );
//     }

//     if (!user) {
//       return null;
//     }

//     return (
//       <div className="flex gap-4">
//         <div className="relative size-12">
//           <Image
//             src={user?.profileImage}
//             alt={`${user?.firstName} ${user?.lastName}`}
//             fill
//             className="rounded-full object-cover"
//           />
//         </div>
//         <div className="flex-1">
//           <h4 className="font-bold">{`${user?.firstName} ${user?.lastName}`}</h4>
//           <p className="text-sm text-gray-500">{user?.email}</p>
//           <div className="mt-2 flex flex-wrap gap-2">
//             {user?.interests?.map((interest, index) => (
//               <span
//                 key={index}
//                 className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-600"
//               >
//                 {interest}
//               </span>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <HoverCard openDelay={200} closeDelay={100}>
//       <HoverCardTrigger asChild>
//         <span className="inline-block cursor-pointer">{children}</span>
//       </HoverCardTrigger>
//       <HoverCardContent
//         className="w-80"
//         align="start"
//         side="right"
//         sideOffset={10}
//       >
//         {renderContent()}
//       </HoverCardContent>
//     </HoverCard>
//   );
// };

// export default UserHoverCard;

import React, { useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { withTokenAxios } from "@/lib/mainAxios";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string;
  interests: string[];
}

interface UserHoverProps {
  username: string;
  userData?: UserProfile;
  children: React.ReactNode;
}

const LoadingSkeleton = () => (
  <div className="flex gap-4">
    <Skeleton className="size-12 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-[120px]" />
      <Skeleton className="h-3 w-[160px]" />
      <div className="mt-4 flex flex-wrap gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-24 rounded-full" />
      </div>
    </div>
  </div>
);

const UserHoverCard: React.FC<UserHoverProps> = ({
  username,
  userData,
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(userData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  const fetchUserData = async () => {
    if (userData || hasAttemptedFetch) return;

    try {
      setLoading(true);
      setError(null);

      const response = await withTokenAxios.get(
        `/users/username?term=${username}`
      );
      console.log("response ", response);
      if (response?.data?.success) {
        setUser(response?.data?.data);
      } else {
        setError(response?.data?.message || "Failed to load user data");
      }
    } catch (err) {
      setError("Failed to load user data");
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
      setHasAttemptedFetch(true);
    }
  };

  const handleHoverChange = (open: boolean) => {
    if (open && !user && !hasAttemptedFetch) {
      fetchUserData();
    }
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingSkeleton />;
    }

    if (error) {
      return (
        <div className="flex items-center gap-2 p-2 text-sm text-red-500">
          <span className="rounded-full bg-red-100 p-1 text-red-500">⚠️</span>
          {error}
        </div>
      );
    }

    if (!user) {
      return null;
    }

    return (
      <div className="flex gap-4">
        <div className="relative size-12">
          <Image
            src={user.profileImage}
            alt={`${user.firstName} ${user.lastName}`}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h4 className="font-bold">{`${user.firstName} ${user.lastName}`}</h4>
          <p className="text-sm text-gray-500">{user.email}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {user.interests?.map((interest, index) => (
              <span
                key={index}
                className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-600"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <HoverCard
      openDelay={200}
      closeDelay={100}
      onOpenChange={handleHoverChange}
    >
      <HoverCardTrigger asChild>
        <span className="inline-block cursor-pointer">{children}</span>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-80"
        align="start"
        side="right"
        sideOffset={10}
      >
        {renderContent()}
      </HoverCardContent>
    </HoverCard>
  );
};

export default UserHoverCard;
