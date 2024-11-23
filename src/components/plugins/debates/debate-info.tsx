"use client";
import moment from "moment";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check, Building2, Network } from "lucide-react";
import { useEffect, useState } from "react";
import { Endpoints } from "@/utils/endpoint";
import { useParams } from "next/navigation";
type AdoptionOption = {
  nonAdoptedClubs: {
    clubId: string;
    role: string;
    name: string;
  }[];
  nonAdoptedNodes: {
    nodeId: string;
    role: string;
    name: string;
  }[];
};

// Dummy data for clubs and nodes

function DebateInfo() {
  const { postId } = useParams<{ postId: string }>();
  const [adoptionOption, setAdoptionOption] = useState<AdoptionOption>();
  const clubs =
    (adoptionOption &&
      adoptionOption?.nonAdoptedClubs?.map((club) => ({
        clubId: club.clubId, // Map `clubId` to `id`
        type: "club",
        name: club.name,
        role: club.role,
      }))) ||
    [];
  const nodes =
    (adoptionOption &&
      adoptionOption?.nonAdoptedNodes?.map((node) => ({
        nodeId: node.nodeId, // Map `nodeId` to `id`
        type: "node",
        name: node.name,
        role: node.role,
      }))) ||
    [];
  const adoptionOptions = [...clubs, ...nodes];
  console.log({ adoptionOptions });
  console.log({ postId });

  const [debate, setDebate] = useState<any>();
  useEffect(() => {
    Endpoints.viewDebate(postId).then((res) => {
      console.log({ res });

      setDebate(res);
    });

    Endpoints.notAdoptedClubs(postId).then((res) => {
      setAdoptionOption(res);
    });
  }, []);
  return (
    <Card className="mx-auto border">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">
              {debate?.topic}
              <Badge className="ml-2">BG3035</Badge>
            </CardTitle>
            <CardDescription className="mt-2">
              {debate?.significance}
            </CardDescription>
          </div>
          <div className="text-sm text-muted-foreground">Private</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mt-4">
          <Avatar className="mr-3">
            <AvatarImage src="/api/placeholder/40/40" alt="Author" />
            <AvatarFallback>LA</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-medium">{debate?.createdBy?.firstName}</div>
            <div className="text-xs text-muted-foreground">
              {moment(debate?.createdAt).fromNow()}\{" "}
            </div>
          </div>
          <Badge variant="outline">Environmental Advocacy Group</Badge>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {debate &&
            debate?.tags?.map((tag: any, index: number) => (
              <Badge key={index}>{tag}</Badge>
            ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 text-sm">
          <div>
            <div className="text-muted-foreground">Date Started</div>
            <div>{moment(debate?.createdAt).format("DD/MM/YYYY")}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Closure date</div>
            <div>{moment(debate?.closingDate).format("DD/MM/YYYY")}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Points</div>
            <div>457</div>
          </div>
          <div>
            <div className="text-muted-foreground">Views</div>
            <div>12.5k</div>
          </div>
          <div>
            <div className="text-muted-foreground">Contributors</div>
            <div>2.3k</div>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-green-500 text-white hover:bg-green-600">
                Adopt
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader className="sticky top-0 z-10 bg-white">
                <DialogTitle>Choose adoption type</DialogTitle>
                <DialogDescription className="text-sm">
                  Select a club or node to adopt this debate
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 mt-2 overflow-y-auto max-h-60">
                {adoptionOptions?.map((option: any, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg border hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {option.type === "club" ? (
                        <Building2 className="text-blue-500 size-4" />
                      ) : (
                        <Network className="text-purple-500 size-4" />
                      )}
                      <div className="font-medium text-sm">{option.name}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {option.type}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2"
                        onClick={() => {
                          Endpoints.adoptDebate(
                            postId,
                            option.type as "node" | "club",
                            option.type === "club" ? option.clubId : undefined,
                            option.type === "node" ? option.nodeId : undefined
                          )
                            .then((response) => {
                              Endpoints.notAdoptedClubs(postId).then((res) => {
                                setAdoptionOption(res);
                              });
                              console.log("Adoption successful", response);
                            })
                            .catch((error) => {
                              console.error("Adoption failed", error);
                            });
                        }}
                      >
                        <Check className="size-3 mr-1" />
                        <span className="text-xs">
                          {(option.role == "admin" && "Adopt") || "Propose"}
                        </span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

export default DebateInfo;
