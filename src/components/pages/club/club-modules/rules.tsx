"use client";
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
import { useState } from "react";

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

type TableList = "proposed" | "active" | "global" | "suggested" | "my";

export default function Rules() {
  const [tableList, setTableList] = useState<TableList>("proposed");
  const rules: Rule[] = [
    {
      id: 1,
      title: "Code of Conduct",
      description: "Creating a code of conduct for a social media g...",
      postedDate: "Jan 13, 2022",
      postedBy: {
        name: "Marvin McKinney",
        avatar: "/placeholder.svg",
      },
      relevanceScore: 21,
      comments: 12,
    },
    {
      id: 2,
      title: "Hand Hygiene",
      description: "All staff, visitors, and patients must practice pr...",
      postedDate: "November 7, 2017",
      postedBy: {
        name: "Arlene McCoy",
        avatar: "/placeholder.svg",
      },
      relevanceScore: 12,
      comments: 13300,
    },
    // Add more rules as needed
  ];

  return (
    <div className="w-full max-w-6xl mx-auto ">
      <div className="pb-3 flex flex-col gap-2">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          Rules & Regulation
          <span className="text-muted-foreground">ⓘ</span>
        </h1>
        <p className="text-xs text-muted-foreground">
          Lorem ipsum dolor sit amet consectetur. Congue varius lorem at
          egestas. Iaculis semper risus sit egestas.
        </p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="bg-transparent p-0">
          <TabsTrigger
            value="active"
            className="data-[state=active]:text-green-500 data-[state=active]:border-b-8 data-[state=active]:border-green-500"
          >
            Active Rules (12)
          </TabsTrigger>
          <TabsTrigger
            value="proposed"
            className="data-[state=active]:text-green-500 data-[state=active]:border-b-8 data-[state=active]:border-green-500"
          >
            Proposed Rules (182)
          </TabsTrigger>
          <TabsTrigger
            value="global"
            className="data-[state=active]:text-green-500 data-[state=active]:border-b-8 data-[state=active]:border-green-500"
          >
            Global Library (2M)
          </TabsTrigger>
          <TabsTrigger
            value="suggested"
            className="data-[state=active]:text-green-500 data-[state=active]:border-b-8 data-[state=active]:border-green-500"
          >
            Suggested Rules (45)
          </TabsTrigger>
          <TabsTrigger
            value="my"
            className="data-[state=active]:text-green-500 data-[state=active]:border-b-8 data-[state=active]:border-green-500"
          >
            My Rules (30)
          </TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-4 my-3">
          <Button className="bg-green-500 hover:bg-green-600">
            + Create rules
          </Button>
          <div className="flex-1 flex items-center gap-2">
            <div className="relative flex-1">
              <Input placeholder="Search for rules..." className="w-full" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value={tableList} className="mt-0">
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
              {rules.map((rule, index) => (
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
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">Total 85 items</div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {[1, "...", 4, 5, 6, 7, 8, "...", 20].map((page, i) => (
                  <Button
                    key={i}
                    variant={page === 5 ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button variant="outline" size="sm">
                Next
              </Button>
              <select className="px-2 py-1 border rounded-md text-sm">
                <option>10 / page</option>
                <option>20 / page</option>
                <option>50 / page</option>
              </select>
              <div className="flex items-center gap-2 ml-4">
                <span className="text-sm text-muted-foreground">Go to</span>
                <Input className="w-16 h-8" />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
