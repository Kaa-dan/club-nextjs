import LayoutPanel from "@/components/globals/layout-panel/layout-panel";
import React from "react";

const SiteLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <section>{children}</section>;
};

export default SiteLayout;
