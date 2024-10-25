import Link from "next/link";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "./menu";
import Image from "next/image";
import { IMGS } from "@/lib/constants";

export function SheetMenu() {
  return (
    <Sheet>
      <SheetTrigger className="!bg-red-500 lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="flex h-full flex-col !bg-red-400 px-3 sm:w-72"
        side="left"
      >
        <SheetHeader>
          <Button
            className="flex items-center justify-center pb-2 pt-1"
            variant="link"
            asChild
          >
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image src={IMGS.LogoGreen} alt="logo" className="w-fit" />
              <h1 className="text-lg font-bold">Clubwize</h1>
            </Link>
          </Button>
        </SheetHeader>
        <div className="!bg-green-700">
          <Menu isOpen />
        </div>
      </SheetContent>
    </Sheet>
  );
}
