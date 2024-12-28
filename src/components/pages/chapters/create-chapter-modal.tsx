"use client";
import React, { useEffect } from "react";
import { Check, Building2, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/lable";
import { withTokenAxios } from "@/lib/mainAxios";
import Image from "next/image";
import { useParams } from "next/navigation";

interface Club {
  _id: string;
  name: string;
  profileImage: {
    url: string;
  };
}

interface CreateChapterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // clubs?: Club[];
}

const CreateChapterModal: React.FC<CreateChapterModalProps> = ({
  open,
  onOpenChange,
  // clubs = [],
}) => {
  const [clubs, setClubs] = React.useState<Club[]>([]);
  const [selectedClub, setSelectedClub] = React.useState<Club | null>(null);
  const [openCombobox, setOpenCombobox] = React.useState(false);
  const { nodeId } = useParams<{ nodeId: string }>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedClub) {
      console.log("Selected club:", selectedClub);
      try {
        const response = await withTokenAxios.post("/chapters", {
          club: selectedClub._id,
          node: nodeId,
        });
        onOpenChange(false);
        console.log({ response });
      } catch (error) {
        console.error("Error creating chapter:", error);
      }
    }
  };

  // get clubs
  const getClubs = async () => {
    try {
      const response = await withTokenAxios.get(
        `/chapters/get-user-public-clubs?nodeId=${nodeId}`
      );
      setClubs(response.data);
      console.log({ response });
    } catch (error) {
      console.error("Error fetching clubs:", error);
    }
  };

  useEffect(() => {
    console.log("Fetching clubs...", getClubs());
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Create Chapter</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
            <Label htmlFor="club">Select Club</Label>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openCombobox}
                className="w-full justify-between"
              >
                {selectedClub ? (
                  <div className="flex items-center gap-2">
                    {/* <Building2 className="size-4" />
                     */}
                    <Image
                      src={selectedClub?.profileImage?.url}
                      width={40}
                      height={40}
                      className="size-6 rounded-full"
                      alt="club"
                    />
                    <span>{selectedClub.name}</span>
                  </div>
                ) : (
                  "Search for a club..."
                )}
                <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search for a club..." />
                <CommandList>
                  <CommandEmpty>
                    <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                      No clubs found.
                    </div>
                  </CommandEmpty>
                  {clubs.length > 0 && (
                    <CommandGroup heading="Available Clubs">
                      {clubs.map((club) => (
                        <CommandItem
                          key={club._id}
                          value={club.name}
                          onSelect={() => {
                            setSelectedClub(club);
                            setOpenCombobox(false);
                          }}
                          className="flex items-center gap-2 px-4 py-2"
                        >
                          <Image
                            src={club.profileImage.url}
                            width={40}
                            height={40}
                            className="rounded-full"
                            alt="club"
                          />
                          <span>{club.name}</span>
                          {selectedClub?._id === club?._id && (
                            <Check className="ml-auto size-4" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={selectedClub ? "default" : "outline"}
              disabled={!selectedClub}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChapterModal;
