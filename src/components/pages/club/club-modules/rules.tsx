"use client";

import React, { useState, useEffect, FC } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Filter, MoreVertical, ThumbsUp, MessageCircle } from "lucide-react";
import { Endpoints } from "@/utils/endpoint";

type Rule = {
  id: number;
  title: string;
  description: string;
  postedDate: string;
  postedBy: {
    name: string;
    avatar: string;
  };
  relevanceScore: number;
  comments: number;
};

type TableList = "active" | "proposed" | "global" | "suggested" | "my";

const RulesTable: FC<{ clubId: string }> = ({ clubId }) => {
  const [activeTab, setActiveTab] = useState<TableList>("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const response = await Endpoints.getRulesAndRegulations("club", clubId);
      if (response?.data) {
        setRules(response.data);
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

  useEffect(() => {
    fetchRules();
  }, [clubId]);

  const filteredRules = rules.filter(
    (rule) =>
      searchQuery.toLowerCase() === "" ||
      rule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="pb-3 flex flex-col gap-2">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          Rules & Regulation
          <span className="text-muted-foreground">ⓘ</span>
        </h1>
        <p className="text-xs text-muted-foreground">
          Manage and view all organization rules and regulations
        </p>
      </div>

      <Tabs
        value={activeTab}
        className="w-full"
        onValueChange={(value) => setActiveTab(value as TableList)}
      >
        <TabsList className="bg-transparent p-0">
          <TabsTrigger value="active" className="tab-styling">
            Active Rules
          </TabsTrigger>
          <TabsTrigger value="proposed" className="tab-styling">
            Proposed Rules
          </TabsTrigger>
          <TabsTrigger value="global" className="tab-styling">
            Global Library
          </TabsTrigger>
          <TabsTrigger value="suggested" className="tab-styling">
            Suggested Rules
          </TabsTrigger>
          <TabsTrigger value="my" className="tab-styling">
            My Rules
          </TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-4 my-3">
          <Button className="bg-green-500 hover:bg-green-600">
            + Create rules
          </Button>
          <div className="flex-1 flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Search for rules..."
                className="w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value={activeTab} className="mt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] text-sm">No.</TableHead>
                <TableHead className="text-sm">Rules & Regulations</TableHead>
                <TableHead className="text-sm">Posted Date</TableHead>
                <TableHead className="text-sm">Posted by</TableHead>
                <TableHead className="text-sm">Relevance Score</TableHead>
                <TableHead className="text-right text-sm">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-32">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredRules.length > 0 ? (
                filteredRules.map((rule, index) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm">{rule.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {rule.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{rule.postedDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={rule.postedBy.avatar} />
                          <AvatarFallback className="text-sm">
                            {rule.postedBy.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs">{rule.postedBy.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{rule.relevanceScore}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{rule.comments}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-32">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <p className="text-lg font-medium">No rules found</p>
                      <p className="text-sm">
                        There are no rules available for {activeTab} category
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RulesTable;
