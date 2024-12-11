"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectApi } from "./projectApi";
import Image from "next/image";
import { format } from "date-fns";

interface ContributionFile {
  url: string;
  originalname: string;
  mimetype: string;
  size: number;
  _id: string;
}

interface UserDetail {
  _id: string;
  userName: string;
  firstName: string;
  lastName: string;
  profileImage: string;
}

interface Contribution {
  _id: string;
  value: number;
  status: "pending" | "accepted" | "rejected";
  files: ContributionFile[];
  createdAt: string;
  user: string;
}

interface ContributionData {
  _id: string;
  projectTitle: string;
  parameterId: string;
  parameterTitle: string;
  contributions: {
    contributions: Contribution[];
    totalValue: number;
    contributionCount: number;
    userDetails: UserDetail[];
  };
}

interface ContributionApprovalModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  param: {
    title: string;
    _id: string;
  };
  projectId: string;
}

export function ContributionApprovalModal({
  open,
  setOpen,
  param,
  projectId,
}: ContributionApprovalModalProps) {
  console.log({ param });
  const [activeTab, setActiveTab] = useState("contributors");
  const [acceptedContributions, setAcceptedContributions] = useState<
    ContributionData[]
  >([]);
  const [pendingContributions, setPendingContributions] = useState<
    ContributionData[]
  >([]);
  function fetchData() {
    ProjectApi.contributions(projectId, "accepted").then((res) => {
      const filtered = res.filter(
        (item: ContributionData) => item.parameterId === param?._id
      );
      console.log({ filtered });
      setAcceptedContributions(filtered);
    });

    // Fetch pending contributions and filter by param._id
    ProjectApi.contributions(projectId, "pending").then((res) => {
      const filtered = res.filter(
        (item: ContributionData) => item.parameterId === param?._id
      );
      setPendingContributions(filtered);
    });
  }

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const handleApprove = (id: string): void => {
    console.log(`Approving contribution ${id}`);
    ProjectApi.acceptContribuion(id)
      .then((res) => {
        fetchData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleReject = (id: string): void => {
    console.log(`Rejecting contribution ${id}`);
    // Update state logic here
  };

  const renderContributorsList = () => {
    return acceptedContributions.map((item) => {
      if (!item.contributions?.contributions?.length) return null;

      return (
        <React.Fragment key={item._id}>
          {item.contributions.contributions.map((contribution) => {
            const userDetail = item.contributions.userDetails?.find(
              (user) => user._id === contribution.user
            );

            return (
              <TableRow key={contribution._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {userDetail?.profileImage && (
                      <div className="relative size-8 overflow-hidden rounded-full">
                        <Image
                          src={userDetail.profileImage}
                          alt={userDetail.userName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {userDetail?.firstName} {userDetail?.lastName}
                      </span>
                      <span className="text-sm text-gray-500">
                        @{userDetail?.userName}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{item.parameterTitle}</TableCell>
                <TableCell>{contribution.value}</TableCell>
                <TableCell>
                  {format(new Date(contribution.createdAt), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {contribution.files.map((file) => (
                      <a
                        key={file._id}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        View File
                      </a>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </React.Fragment>
      );
    });
  };

  const renderApprovalsList = () => {
    return pendingContributions.map((item) =>
      item.contributions?.contributions?.map((contribution) => {
        const userDetail = item.contributions.userDetails?.find(
          (user) => user._id === contribution.user
        );

        return (
          <TableRow key={contribution._id}>
            <TableCell>
              <div className="flex items-center gap-3">
                {userDetail?.profileImage && (
                  <div className="relative size-8 overflow-hidden rounded-full">
                    <Image
                      src={userDetail.profileImage}
                      alt={userDetail.userName}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="font-medium">
                    {userDetail?.firstName} {userDetail?.lastName}
                  </span>
                  <span className="text-sm text-gray-500">
                    @{userDetail?.userName}
                  </span>
                </div>
              </div>
            </TableCell>
            <TableCell>{item.parameterTitle}</TableCell>
            <TableCell>{contribution.value}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleApprove(contribution._id)}
                  size="sm"
                  variant="outline"
                  className="border-0 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                >
                  Accept
                </Button>
                <Button
                  onClick={() => handleReject(contribution._id)}
                  size="sm"
                  variant="outline"
                  className="border-0 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                >
                  Reject
                </Button>
              </div>
            </TableCell>
          </TableRow>
        );
      })
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[825px]">
        <DialogHeader>
          <DialogTitle>Contributions - {param.title}</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="contributors">Contributors</TabsTrigger>
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
          </TabsList>
          <TabsContent value="contributors">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contributor</TableHead>
                  <TableHead>Parameter</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Files</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{renderContributorsList()}</TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="approvals">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contributor</TableHead>
                  <TableHead>Parameter</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{renderApprovalsList()}</TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
