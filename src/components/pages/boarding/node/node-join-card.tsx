import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTokenStore } from "@/store/store";
import { TNodeData } from "@/types";
import { Endpoints } from "@/utils/endpoint";
import { request } from "http";
import { Loader2, MapPin, Users } from "lucide-react";
import Image from "next/image";
import React, { useEffect } from "react";

const NodeJoinCard: React.FC<{
  node: TNodeData;
  requested: boolean;
  isLoading: boolean;
  onJoin: (id: string) => void;
}> = ({
  node: { name, profileImage, members, coverImage, location, ...node },
  requested,
  onJoin,
  isLoading,
}) => {
  const [isDailogOpen, setIsDailogOpen] = React.useState(false);
  const [isRequested, setIsRequested] = React.useState(false);

  const { globalUser } = useTokenStore((state) => state);

  const handleDailog = async () => {
    // if (!isDailogOpen) {
    const response = await Endpoints.getNodeJoinRequestOfUser(node._id);
    console.log(response, "response");
    setIsRequested(response?.status === "REQUESTED");
    // }
    // setIsDailogOpen(!isDailogOpen);
  };

  useEffect(() => {
    handleDailog();
  }, [node]);

  return (
    <Card className="flex w-36 flex-col gap-1 rounded-sm p-3 text-xs">
      <Image
        height={200}
        width={200}
        src={profileImage?.url}
        alt={name}
        className="size-10 rounded-md object-cover"
      />
      <span className="w-full truncate text-sm font-semibold">{name}</span>
      {/* <div className="flex items-center gap-1">
        <Users size={"1rem"} />
        {members?.length}
      </div> */}
      <div className="flex w-4/5 items-center rounded-md bg-slate-50 p-1">
        <MapPin size={"1rem"} className="text-red-500" />
        <span className="truncate">{`${location}`}</span>
      </div>
      {isRequested ? (
        <div className="pointer-events-none rounded-sm bg-[#22b573] text-center text-white opacity-60">
          Requested
        </div>
      ) : node?.createdBy !== globalUser?._id ? (
        <Dialog open={isDailogOpen} onOpenChange={setIsDailogOpen}>
          <DialogTrigger className="w-full rounded bg-primary text-white shadow">
            {/* <Button className="h-6 w-full p-0">Join</Button> */}
            Join
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Join {name}</DialogTitle>
            {/*cover photo and profile photo : profile photo half should cover bottom of cover photo*/}
            <div className="relative mb-8">
              <Image
                height={100}
                width={200}
                src={coverImage?.url}
                alt={name}
                className="mx-auto h-32 w-96"
              />
              <Image
                height={200}
                width={200}
                src={profileImage?.url}
                alt={name}
                className="absolute -bottom-10 left-1/2 size-20 -translate-x-1/2 rounded-full border-4 border-white object-cover"
              />
            </div>

            <span className="text-center text-base text-slate-500">
              Request to join this node?
            </span>
            <Button
              disabled={isLoading || isRequested || requested}
              className="mx-auto w-1/3"
              onClick={() => onJoin(node._id)}
            >
              {isRequested ? (
                "Requested"
              ) : isLoading ? (
                <Loader2 className="animate-spin text-white" />
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogContent>
        </Dialog>
      ) : (
        <div className="pointer-events-none rounded-sm bg-[#22b573] text-center text-white opacity-60">
          Owner
        </div>
      )}
    </Card>
  );
};

export default NodeJoinCard;
