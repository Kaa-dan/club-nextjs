import IssueForm from "@/components/plugins/issues/create-issues";
import React from "react";

const PluginCreate = async ({
  params,
}: {
  params: Promise<{ plugin: string }>;
}) => {
  const plugin = (await params).plugin;
  return (
    <div>{plugin === "issues" ? <IssueForm /> : <div>Not found</div>}</div>
  );
};

export default PluginCreate;
