import { CustomBreadcrumb } from "@/components/globals/breadcrumb-component";
import React from "react";

const ViewFolder = () => {
  const breadcrumbItems = [
    { label: "My Bookmark", href: `/bookmarks` },
    { label: `Posts` },
  ];
  return (
    <div>
      <CustomBreadcrumb items={breadcrumbItems} className="my-1" />
    </div>
  );
};

export default ViewFolder;
