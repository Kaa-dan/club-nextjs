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
import React, { ReactNode, useEffect, useState } from "react";
import plugin from "tailwindcss";
import { RulesTable } from "./rules";
import { Endpoints } from "@/utils/endpoint";
import { RulesAndRegulationsEndpoints } from "@/utils/endpoints/plugins/rules-and-regulations";
import { OffenceTable } from "./offence-table";

interface TabData {
  label: string;
  count: number;
}

const tabs: TabData[] = [
  {
    label: "Active",
    count: 182,
  },
  {
    label: "All Rules",
    count: 652,
  },
  {
    label: "Global Rules",
    count: 2000000,
  },
  {
    label: "My Rules",
    count: 2360,
  },
  {
    label: "Report Offences",
    count: 60,
  },
];

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

// const RulesLayout = ({ children }: { children: ReactNode }) => {
const RulesLayout = ({
  plugin,
  section,
  nodeorclubId,
}: {
  plugin: TPlugins;
  section: TSections;
  nodeorclubId: string;
}) => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [offences, setOffences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clickTrigger, setClickTrigger] = useState(false);

  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(0)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(2)}k`;
    return count.toString();
  };

  const fetchRules = async () => {
    setLoading(true);
    try {
      const response = await Endpoints.getRulesAndRegulations(
        section,
        nodeorclubId
      );
      console.log({ vaaa: response });

      if (response) {
        setRules(response);
      } else {
        setRules([]);
      }
    } catch (err) {
      console.log({ err });
      setRules([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchReportOffences = async () => {
    setLoading(true);
    try {
      const response = await RulesAndRegulationsEndpoints.fetchOffences(
        section,
        nodeorclubId
      );
      console.log("offences", response);

      if (response) {
        setOffences(response);
      } else {
        setOffences([]);
      }
    } catch (err) {
      console.log({ err });
      setOffences([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
    fetchReportOffences();
  }, [nodeorclubId, clickTrigger]);

  if (loading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4  p-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Rules and regooo Issuessss
        </h2>
        <p className="text-muted-foreground">
          {`Lorem ipsum dolor sit amet consectetur. Congue varius lorem et
          egestas. Iaculis semper risus sit egestas.`}
        </p>
      </div>

      <Tabs defaultValue="Active" className="w-full space-y-4 ">
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
              <Link href="rules/create">
                <Button className="bg-primary hover:bg-emerald-600">
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
            {/* <IssueTable issues={tab.issues} /> */}
            {/* {children}
             */}
            {tab.label === "Report Offences" ? (
              <OffenceTable
                nodeorclubId={nodeorclubId}
                plugin={plugin}
                section={section}
                data={offences}
              />
            ) : (
              <RulesTable
                nodeorclubId={nodeorclubId}
                plugin={plugin}
                section={section}
                data={rules}
                clickTrigger={clickTrigger}
                setClickTrigger={setClickTrigger}
              />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default RulesLayout;
