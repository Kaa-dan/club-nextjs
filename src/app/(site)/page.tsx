import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl bg-green-500 text-heading-h1 shadow-larger sm:p-16 xl:p-0">
        hello world
      </div>
      <span className="text-heading-h1">Hello</span>
      <span className="text-heading-h2">Hello</span>
      <span className="text-heading-h3">Hello</span>
      <span className="text-heading-h4">Hello</span>
      <span className="text-heading-h5">Hello</span>
      <span className="text-heading-h6">Hello</span>
    </main>
  );
}
