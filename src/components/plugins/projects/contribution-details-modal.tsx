import React, { useState, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
import { useTokenStore } from "@/store/store";
import { FileIcon } from "lucide-react";

interface ContributionApprovalModalProps {
  project: {
    createdBy: {
      _id: string;
    };
  };
  reFetch: () => void,
  open: boolean;
  setOpen: (open: boolean) => void;
  param: {
    title: string;
    _id: string;
  };
  projectId: string;
}

export const ContributionApprovalModal = ({
  reFetch,
  open,
  setOpen,
  param,
  projectId,
  project,
}: ContributionApprovalModalProps) => {
  const [acceptedData, setAcceptedData] = useState<any[]>([]);
  const [pendingData, setPendingData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
 const {globalUser} = useTokenStore((state) => state)
  // Check if current user is the project creator
  const isProjectCreator = project?.createdBy?._id === globalUser?._id;

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [acceptedRes, pendingRes] = await Promise.all([
        ProjectApi.contributions(projectId, "accepted"),
        isProjectCreator // Only fetch pending if user is creator
          ? ProjectApi.contributions(projectId, "pending")
          : Promise.resolve([]),
      ]);

      const filteredAccepted = acceptedRes.filter(
        (project: any) => project.parameters?._id === param._id
      );

      const filteredPending = pendingRes.filter(
        (project: any) => project.parameters?._id === param._id
      );
console.log({filteredPending})
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
    try {
      setIsLoading(true);
      await ProjectApi.acceptContribuion(id, isApprove);
      await fetchData();
      reFetch()
    } catch (err) {
      console.error("Error handling contribution:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderContributorsList = () => {
    return acceptedData.map((project) => {
      return project.contributions?.map((contributionGroup: any) => {
        return contributionGroup.contributions.map((contribution: any) => {
          const userDetail = contributionGroup.userDetails?.find(
            (user: any) => user._id === contribution.user
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
                  {contribution.files?.map((file: any, index: number) => (
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
      return project.contributions?.map((contributionGroup: any) => {
        return contributionGroup.contributions.map((contribution: any) => {
          const userDetail = contributionGroup.userDetails?.find(
            (user: any) => user._id === contribution.user
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
              {contribution?.files && contribution.files.length > 0 && (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer">
          <FileIcon className="size-4 text-gray-500" />
          <span className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
            View Files ({contribution.files.length})
          </span>
        </div>
      </TooltipTrigger>
      
      <TooltipContent className="w-64 p-2">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-white font-medium mb-1">All Files:</p>
          {contribution.files.map((file:any, index:any) => (
            <a
              key={index}
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <FileIcon className="size-3 text-gray-500" />
              {file.name || `File ${index + 1}`}
            </a>
          ))}
        </div>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)}
              </TableCell>
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
        {isProjectCreator ? (
          <Tabs defaultValue="contributors" className="w-full">
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
                    <TableHead>File</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{renderApprovalsList()}</TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        ) : (
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
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContributionApprovalModal;