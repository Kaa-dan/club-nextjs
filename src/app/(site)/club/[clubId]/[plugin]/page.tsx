import RulesLayout from "@/components/plugins/rules-regulations/rules-layout";
import IssuesLayout from "@/components/plugins/issues/issues-layout";
import IssueTable from "@/components/plugins/issues/issues-table";
import React from "react";
import { RulesTable } from "@/components/plugins/rules-regulations/rules";
const PluginPage = async ({
  params,
}: {
  params: Promise<{ plugin: string; clubId: string }>;
}) => {
  const { plugin, clubId } = await params;

  const renderPluginContent = () => {
    switch (plugin) {
      case "issues":
        return (
          <IssuesLayout>
            <IssueTable />
          </IssuesLayout>
        );
      case "rules":
        return (
          <RulesLayout>
            <RulesTable
              nodeorclubId={clubId}
              plugin={plugin}
              section={"club"}
            />
          </RulesLayout>
        );

      default:
        return (
          <div className="flex h-full items-center justify-center">
            <span className="text-muted-foreground">Plugin not found</span>
          </div>
        );
    }
  };

  return <main>{renderPluginContent()}</main>;
};

export default PluginPage;
