import React from "react";

const ChapterPage = async ({
  params,
}: {
  params: Promise<{ chapterId: string; nodeId: string }>;
}) => {
  const { chapterId, nodeId } = await params;
  return <div>ChapterPage ss {chapterId}</div>;
};

export default ChapterPage;
