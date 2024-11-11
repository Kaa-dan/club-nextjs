import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen min-w-[70%] overflow-auto">
      {children}
    </div>
  );
};

export default Layout;
