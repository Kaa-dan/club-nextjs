import { IMGS } from "@/lib/constants";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen !bg-green-200 flex-col items-center justify-between p-24">
      <div className="z-10  flex w-full max-w-5xl items-center justify-center gap-5 bg-green-500 text-center text-heading-h1 font-extrabold tracking-wide text-white shadow-larger sm:p-16 xl:p-0">
        <Image
          src={IMGS.Logo}
          alt="ClubWize"
          className="brightness-0 invert"
          width={100}
          height={100}
        />
        ClubWize
      </div>
      {/* <span className="text-heading-h1">Hello</span>
      <span className="text-heading-h2">Hello</span>
      <span className="text-heading-h3">Hello</span>
      <span className="text-heading-h4">Hello</span>
      <span className="text-heading-h5">Hello</span>
      <span className="text-heading-h6">Hello</span> */}
    </main>
  );
}
