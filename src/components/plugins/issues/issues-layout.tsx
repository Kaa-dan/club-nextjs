"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TIssue } from "@/types";
import { Search } from "lucide-react";
import Link from "next/link";
import React, { ReactNode } from "react";
import IssueTable from "./issues-table";
import useIssues from "./use-issues";

interface TabData {
  label: string;
  count: number;
}

// const tabs: TabData[] = [
//   {
//     label: "Live Issues",
//     count: 182,
//   },
//   {
//     label: "All Issues",
//     count: 652,
//   },
//   {
//     label: "Global Library",
//     count: 2000000,
//   },
//   {
//     label: "My Issues",
//     count: 2360,
//   },
// ];

const IssuesLayout = ({
  plugin,
  section,
  nodeorclubId,
}: {
  plugin: TPlugins;
  section: TSections;
  nodeorclubId: string;
}) => {
  const {
    liveIssues,
    allIssues,
    globalIssues,
    myIssues,
    setClickTrigger,
    clickTrigger,
  } = useIssues(section, nodeorclubId);

  const tabs: TabData[] = [
    {
      label: "Live Issues",
      count: liveIssues.length || 0,
    },
    {
      label: "All Issues",
      count: allIssues.length || 0,
    },
    {
      label: "Global Library",
      count: globalIssues.length || 0,
    },
    {
      label: "My Issues",
      count: myIssues.length || 0,
    },
  ];

  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(0)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(2)}k`;
    return count.toString();
  };

  function getData(tab: TabData): any[] {
    let data: any[] = [];
    switch (tab.label) {
      case "Live Issues":
        data = liveIssues;
        break;
      case "All Issues":
        data = allIssues;
        break;
      case "Global Library":
        data = globalIssues;
        break;
      case "My Issues":
        data = myIssues;
        break;
      case "Proposed Issues":
        data = myIssues;
        break;
      default:
        data = [];
    }

    return data;
  }

  return (
    <div className="w-full space-y-4  p-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Community Issues</h2>
        <p className="text-muted-foreground">
          {`Lorem ipsum dolor sit amet consectetur. Congue varius lorem et
          egestas. Iaculis semper risus sit egestas.`}
        </p>
      </div>

      <Tabs defaultValue="Live Issues" className="w-full space-y-4 ">
        <TabsList className="flex h-auto flex-wrap gap-1 bg-background p-1">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.label}
              value={tab.label}
              className="shrink-0 rounded-md border-primary px-3 py-1.5 text-sm data-[state=active]:border-b-4  data-[state=active]:text-primary"
            >
              {tab.label} ({formatCount(tab.count)})
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.label} value={tab.label} className="space-y-4">
            <div className="flex items-center gap-4">
              <Link href="issues/create">
                <Button className="bg-primary hover:bg-emerald-600">
                  Add a new issue
                </Button>
              </Link>
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
                <Input placeholder="Search for rules..." className="pl-8" />
              </div>
              <Button variant="outline" size="icon">
                <span className="sr-only">Filter</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-4"
                >
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
              </Button>
              <Button variant="outline" size="icon">
                <span className="sr-only">View options</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-4"
                >
                  <rect width="7" height="7" x="3" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="14" rx="1" />
                  <rect width="7" height="7" x="3" y="14" rx="1" />
                </svg>
              </Button>
            </div>
            {/* <IssueTable issues={tab.issues} /> */}
            {/* {children} */}
            <IssueTable
              nodeorclubId={nodeorclubId}
              plugin={plugin}
              section={section}
              data={getData(tab)}
              clickTrigger={clickTrigger}
              setClickTrigger={setClickTrigger}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default IssuesLayout;
