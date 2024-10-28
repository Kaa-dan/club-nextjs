import { Navbar } from "./navbar";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <div>
      <Navbar />
      <div className="container px-4 pb-8 sm:px-8">{children}</div>
    </div>
  );
}
