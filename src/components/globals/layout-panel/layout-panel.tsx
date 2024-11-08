"use client";

import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { Sidebar } from "./sidebar";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { ContentLayout } from "./content-layout";

export default function LayoutPanel({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  return (
    <>
      <Sidebar />
      <main
        className={cn(
          "max-h-screen h-screen  dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300",
          // sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-64"
          sidebar?.isOpen === false ? "ml-[90px]" : "ml-64"
        )}
      >
        <ContentLayout title="">{children}</ContentLayout>
      </main>
      {/* <footer
        className={cn(
          "transition-[margin-left] ease-in-out duration-300",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72"
        )}
      >
        <Footer />
      </footer> */}
    </>
  );
}
