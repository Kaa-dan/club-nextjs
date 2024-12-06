"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import Link from "next/link";
import React from "react";
import ProjectTable from "./project-table";
import { useClubStore } from "@/store/clubs-store";
import { usePermission } from "@/lib/use-permission";

interface TabData {
  label: TProjectLable;
  count: number;
}

const ProjectLayout = ({
  plugin,
  forum,
  forumId,
}: {
  plugin: TPlugins;
  forum: TForum;
  forumId: string;
}) => {
  //   const {
  //     liveIssues,
  //     allIssues,
  //     globalIssues,
  //     myIssues,
  //     setClickTrigger,
  //     proposedIssues,
  //     clickTrigger,
  //     loading,
  //   } = useIssues(forum, forumId);
  const { hasPermission } = usePermission();

  const tabs: TabData[] = [
    {
      label: "On going projects",
      count: 0,
    },
    {
      label: "All Projects",
      count: 0,
    },
    {
      label: "Global Projects",
      count: 0,
    },
    {
      label: "My Projects",
      count: 0,
    },
  ];

  const getFilteredTabs = (): TabData[] => {
    const _tabs = tabs;
    if (hasPermission("view:proposedAsset")) {
      _tabs.push({
        label: "Proposed Project",
        count: 0,
      });
    }
    return _tabs;
  };

  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(0)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(2)}k`;
    return count.toString();
  };

  function getData(tab: TabData): any[] {
    let data: any[] = [];
    switch (tab.label) {
      case "On going projects":
        data = [
          {
            id: 1,
            name: "Website Redesign",
            status: "Ongoing",
            owner: "Alice Johnson",
            team: "Design Team",
            createdAt: "2024-12-01",
            updatedAt: "2024-12-02",
          },
        ];
        break;
      case "All Projects":
        data = [
          {
            id: 1,
            name: "Website Redesign",
            status: "Ongoing",
            owner: "Alice Johnson",
            team: "Design Team",
            createdAt: "2024-12-01",
            updatedAt: "2024-12-02",
          },
        ];
        break;
      case "Global Projects":
        data = [
          {
            id: 1,
            name: "Website Redesign",
            status: "Ongoing",
            owner: "Alice Johnson",
            team: "Design Team",
            createdAt: "2024-12-01",
            updatedAt: "2024-12-02",
          },
        ];
        break;
      case "My Projects":
        data = [
          {
            id: 1,
            name: "Website Redesign",
            status: "Ongoing",
            owner: "Alice Johnson",
            team: "Design Team",
            createdAt: "2024-12-01",
            updatedAt: "2024-12-02",
          },
        ];
        break;
      case "Proposed Project":
        data = [
          {
            id: 1,
            name: "Website Redesign",
            status: "Ongoing",
            owner: "Alice Johnson",
            team: "Design Team",
            createdAt: "2024-12-01",
            updatedAt: "2024-12-02",
          },
        ];
        break;
      default:
        data = [];
    }

    return data;
  }

  return (
    <div className="w-full space-y-4  p-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Project</h2>
        <p className="text-muted-foreground">
          {`Lorem ipsum dolor sit amet consectetur. Congue varius lorem et
          egestas. Iaculis semper risus sit egestas.`}
        </p>
      </div>

      <Tabs defaultValue="On going projects" className="w-full space-y-4 ">
        <TabsList className="flex h-auto flex-wrap gap-1 bg-background p-1">
          {getFilteredTabs()?.map((tab) => (
            <TabsTrigger
              key={tab.label}
              value={tab.label}
              className="shrink-0 rounded-md border-primary px-3 py-1.5 text-sm data-[state=active]:border-b-4  data-[state=active]:text-primary"
            >
              {tab.label} ({formatCount(tab.count)})
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs?.map((tab) => (
          <TabsContent key={tab.label} value={tab.label} className="space-y-4">
            <div className="flex items-center gap-4">
              <Link href="project/create">
                <Button className="bg-primary hover:bg-emerald-600">
                  Add a new Project
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
            <ProjectTable
              forumId={forumId}
              plugin={plugin}
              forum={forum}
              tab={tab.label}
              data={getData(tab)}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ProjectLayout;