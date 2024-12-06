"use client";

import React, { useState } from "react";
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

interface Contribution {
  id: number;
  contributorName: string;
  value: number;
  status: "pending" | "approved" | "rejected";
}

interface ContributionApprovalModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  param: {
    title: string;
  };
  projectId: string | number;
}

export function ContributionApprovalModal({
  open,
  setOpen,
  param,
  projectId,
}: ContributionApprovalModalProps) {
  const [activeTab, setActiveTab] = useState("contributors");

  // Sample data with contributor names
  const contributions: Contribution[] = [
    { id: 1, contributorName: "John Doe", value: 10, status: "pending" },
    { id: 2, contributorName: "Jane Smith", value: 15, status: "pending" },
    { id: 3, contributorName: "Mike Johnson", value: 5, status: "pending" },
  ];

  const handleApprove = (id: number): void => {
    // Implement approval logic here
    console.log(`Approving contribution ${id}`);
  };

  const handleReject = (id: number): void => {
    // Implement rejection logic here
    console.log(`Rejecting contribution ${id}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[625px]">
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
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contributions.map((contribution) => (
                  <TableRow key={contribution.id}>
                    <TableCell>{contribution.contributorName}</TableCell>
                    <TableCell>${contribution.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="approvals">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contributor</TableHead>
                  <TableHead>Approvals</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contributions.map((contribution) => (
                  <TableRow key={contribution.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {contribution.contributorName}
                        </span>
                        <span className="text-sm text-gray-500">
                          ${contribution.value}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleApprove(contribution.id)}
                          size="sm"
                          variant="outline"
                          className="bg-green-50 border-0 text-green-600 hover:bg-green-100 hover:text-green-700"
                        >
                          Accept
                        </Button>
                        <Button
                          onClick={() => handleReject(contribution.id)}
                          size="sm"
                          variant="outline"
                          className="bg-red-50 border-0 text-red-600 hover:bg-red-100 hover:text-red-700"
                        >
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
