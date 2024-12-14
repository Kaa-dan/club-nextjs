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
  _id?: string;
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

interface ContributionGroup {
  _id: string;
  contributions: Contribution[];
  totalValue: number;
  contributionCount: number;
  userDetails: UserDetail[];
}

interface ProjectData {
  _id: string;
  title: string;
  parameters: {
    _id: string;
    title: string;
    value: string;
    unit: string;
  };
  contributions: ContributionGroup[];
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

export const ContributionApprovalModal = ({
  open,
  setOpen,
  param,
  projectId,
}: ContributionApprovalModalProps) => {
  const [activeTab, setActiveTab] = useState("contributors");
  const [acceptedData, setAcceptedData] = useState<ProjectData[]>([]);
  const [pendingData, setPendingData] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [acceptedRes, pendingRes] = await Promise.all([
        ProjectApi.contributions(projectId, "accepted"),
        ProjectApi.contributions(projectId, "pending"),
      ]);

      // Filter for contributions matching the param id
      const filteredAccepted = acceptedRes.filter(
        (project) => project.parameters?._id === param._id
      );

      const filteredPending = pendingRes.filter(
        (project) => project.parameters?._id === param._id
      );

      console.log("Filtered Accepted:", filteredAccepted);
      console.log("Filtered Pending:", filteredPending);

      setAcceptedData(filteredAccepted);
      setPendingData(filteredPending);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open && projectId && param?._id) {
      fetchData();
    }
  }, [projectId, param?._id, open]);

  const handleApproveReject = async (id: string, isApprove: boolean) => {
    console.log({ isApprove });

    try {
      setIsLoading(true);
      await ProjectApi.acceptContribuion(id, isApprove);
      await fetchData();
    } catch (err) {
      console.error("Error handling contribution:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderContributorsList = () => {
    return acceptedData.map((project) => {
      return project.contributions?.map((contributionGroup) => {
        return contributionGroup.contributions.map((contribution) => {
          const userDetail = contributionGroup.userDetails?.find(
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
              <TableCell>{project.parameters.title}</TableCell>
              <TableCell>{contribution.value}</TableCell>
              <TableCell>
                {format(new Date(contribution.createdAt), "MMM dd, yyyy")}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {contribution.files?.map((file, index) => (
                    <a
                      key={file._id || index}
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
        });
      });
    });
  };

  const renderApprovalsList = () => {
    return pendingData.map((project) => {
      return project.contributions?.map((contributionGroup) => {
        return contributionGroup.contributions.map((contribution) => {
          const userDetail = contributionGroup.userDetails?.find(
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
              <TableCell>{project.parameters.title}</TableCell>
              <TableCell>{contribution.value}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApproveReject(contribution._id, true)}
                    size="sm"
                    variant="outline"
                    className="border-0 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                    disabled={isLoading}
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() => handleApproveReject(contribution._id, false)}
                    size="sm"
                    variant="outline"
                    className="border-0 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                    disabled={isLoading}
                  >
                    Reject
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        });
      });
    });
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
};
