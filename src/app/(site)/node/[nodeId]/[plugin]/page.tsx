import IssuesLayout from "@/components/plugins/issues/issues-layout";
import IssueTable from "@/components/plugins/issues/issues-table";
import RulesLayout from "@/components/plugins/rules-regulations/rules-layout";
import React from "react";

const PluginPage = async ({
  params,
}: {
  params: Promise<{ plugin: TPlugins; nodeId: string }>;
}) => {
  const { plugin, nodeId } = await params;
  const renderPluginContent = () => {
    switch (plugin) {
      case "issues":
        return <IssuesLayout forum="node" plugin={plugin} forumId={nodeId} />;

      case "rules":
        return <RulesLayout forum="node" plugin={plugin} forumId={nodeId} />;

      default:
        return (
          <div className="flex h-full items-center justify-center">
            <span className="text-muted-foreground">Module not found</span>
          </div>
        );
    }
  };

  return <main>{renderPluginContent()}</main>;
};

export default PluginPage;
