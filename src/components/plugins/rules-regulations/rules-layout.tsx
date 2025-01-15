"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { RulesTable } from "./rules";
import { OffenceTable } from "./offence-table";
import useRules from "./use-rules";
import { formatCount } from "@/lib/utils";
import { usePermission } from "@/lib/use-permission";

interface TabData {
  label: string;
  count: number;
  show?: boolean;
}

type Rule = {
  id: number;
  title: string;
  _id: string;
  description: string;
  publishedDate: string;
  club: string;
  createdBy: {
    name: string;
    avatar: string;
  };
  relevanceScore: number;
  comments: number;
};

const RulesLayout = ({
  plugin,
  forum,
  forumId,
}: {
  plugin: TPlugins;
  forum: TForum;
  forumId: string;
}) => {
  const { hasPermission } = usePermission();
  const {
    activeRules,
    globalRules,
    myRules,
    clickTrigger,
    setClickTrigger,
    offenses,
    loading,
    currentPages,
    totalPages,
    ruleCount,
    setCurrentPages,
  } = useRules(forum, forumId);

  const [activeTab, setActiveTab] = useState("Active");

  const tabs: TabData[] = [
    {
      label: "Active",
      count: ruleCount.activeRules || 0,
    },
    {
      label: "All Rules",
      count: ruleCount.activeRules || 0,
    },
    {
      label: "Global Rules",
      count: ruleCount.globalRules || 0,
    },
    {
      label: "My Rules",
      count: myRules.length || 0,
    },
    {
      label: "Report Offenses",
      count: offenses.length || 0,
      show: hasPermission("view:rulesReportOffense"),
    },
  ];

  function getData(tab: TabData): Rule[] {
    let data: Rule[] = [];
    switch (tab.label) {
      case "Active":
        data = activeRules;
        break;
      case "All Rules":
        data = activeRules;
        break;
      case "Global Rules":
        data = globalRules;
        break;
      case "My Rules":
        data = myRules;
        break;
      case "Report Offenses":
        data = offenses;
        break;
      default:
        data = [];
    }
    return data;
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="w-full space-y-4 p-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Rules and Regulations
        </h2>
        <p className="text-muted-foreground">
          {`Lorem ipsum dolor sit amet consectetur. Congue varius lorem et
          egestas. Iaculis semper risus sit egestas.`}
        </p>
      </div>

      <Tabs
        defaultValue="Active"
        className="w-full space-y-4"
        onValueChange={handleTabChange}
      >
        <TabsList className="flex h-auto flex-wrap gap-1 bg-background p-1">
          {tabs
            ?.filter((tab) => tab.show !== false)
            ?.map((tab) => (
              <TabsTrigger
                key={tab?.label}
                value={tab?.label}
                className="shrink-0 rounded-md border-b-4 border-white px-3 py-1.5 text-sm data-[state=active]:border-primary  data-[state=active]:text-primary"
              >
                {tab?.label} ({formatCount(tab?.count)})
              </TabsTrigger>
            ))}
        </TabsList>

        {tabs
          ?.filter((tab) => tab.show !== false)
          .map((tab) => (
            <TabsContent
              key={tab.label}
              value={tab.label}
              className="space-y-4"
            >
              <div className="flex items-center gap-4">
                <Link href="rules/create">
                  <Button className="bg-primary text-white hover:bg-emerald-600">
                    Add a new Rule
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
              {tab.label === "Report Offenses" ? (
                <OffenceTable
                  currentPage={currentPages}
                  setCurrentPages={setCurrentPages}
                  totalPage={totalPages}
                  forumId={forumId}
                  plugin={plugin}
                  forum={forum}
                  data={offenses}
                  // activeTab={activeTab}
                />
              ) : (
                <RulesTable
                  forumId={forumId}
                  plugin={plugin}
                  forum={forum}
                  data={getData(tab)}
                  clickTrigger={clickTrigger}
                  setClickTrigger={setClickTrigger}
                  loading={loading}
                  currentPage={currentPages}
                  setCurrentPages={setCurrentPages}
                  tab={activeTab}
                  totalPage={totalPages}
                />
              )}
            </TabsContent>
          ))}
      </Tabs>
    </div>
  );
};

export default RulesLayout;
