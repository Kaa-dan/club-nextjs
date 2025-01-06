import React from "react";

const ChapterPage = async ({
  params,
}: {
  params: Promise<{ chapterId: string; nodeId: string }>;
}) => {
  const { chapterId, nodeId } = await params;
  return <div className="ml-6 pt-5 text-xl text-gray-600 ">Chapter Feeds </div>;
};

export default ChapterPage;
