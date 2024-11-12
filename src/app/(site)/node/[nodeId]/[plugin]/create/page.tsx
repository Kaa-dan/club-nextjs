import CreateIssueForm from "@/components/plugins/issues/create-issues";
import React from "react";

const PluginCreate = async ({
  params,
}: {
  params: Promise<{ plugin: TPlugins; nodeId: string }>;
}) => {
  const { plugin, nodeId } = await params;

  const renderPlugin = () => {
    switch (plugin) {
      case "issues":
        return <CreateIssueForm nodeOrClubId={nodeId} section={"node"} />;
      default:
        return <div>Not found</div>;
    }
  };

  return <div>{renderPlugin()}</div>;
};

export default PluginCreate;
