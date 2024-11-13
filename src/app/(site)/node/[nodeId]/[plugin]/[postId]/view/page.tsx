import React from "react";

const PostViewPage = async ({
  params,
}: {
  params: Promise<{ postId: string; plugin: string; nodeId: string }>;
}) => {
  const { nodeId, plugin, postId } = await params;
  return <div>PostViewPage{postId}</div>;
};

export default PostViewPage;
