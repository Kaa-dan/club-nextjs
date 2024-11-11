import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="fixed flex h-screen max-w-[80%]">{children}</div>;
};

export default Layout;
