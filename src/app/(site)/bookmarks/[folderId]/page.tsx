"use client";
import { CustomBreadcrumb } from "@/components/globals/breadcrumb-component";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";
import { Endpoints } from "@/utils/endpoint";

// Mock data for posts
const posts = [
  { id: 1, name: "Getting Started with React", type: "Article" },
  { id: 2, name: "10 Tips for Productivity", type: "Blog" },
  { id: 3, name: "Introduction to Machine Learning", type: "Video" },
  { id: 4, name: "Best Practices in Web Design", type: "Article" },
  { id: 5, name: "JavaScript ES6 Features", type: "Tutorial" },
];

const ViewFolder = () => {
  const breadcrumbItems = [
    { label: "My Bookmark", href: `/bookmarks` },
    { label: `Posts` },
  ];
  const [post, setPost] = useState([]);
  const { folderId } = useParams<{ folderId: string }>();
  useEffect(() => {
    Endpoints.fetchFolders(folderId).then((res) => {
      console.log({ apiDta: res });
      setPost(res);
    });
  }, []);
  return (
    <div className="container mx-auto px-4 py-8">
      <CustomBreadcrumb items={breadcrumbItems} className="mb-6" />
      <h1 className="text-2xl font-bold mb-4">Posts</h1>
      <Card>
        <CardContent>
          <ul className="divide-y divide-gray-200">
            {posts.map((post) => (
              <li
                key={post.id}
                className="py-4 flex items-center justify-between"
              >
                <span className="text-lg">{post.name}</span>
                <Badge variant="secondary">{post.type}</Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewFolder;
