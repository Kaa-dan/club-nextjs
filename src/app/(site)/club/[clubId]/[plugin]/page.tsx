import RulesTable from "@/components/pages/club/club-modules/rules";
import RulesLayout from "@/components/plugins/rules-regulations/rules-layout";
import IssuesLayout from "@/components/plugins/issues/issues-layout";
import IssueTable from "@/components/plugins/issues/issues-table";
import React from "react";

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
            <RulesTable clubId={clubId} />
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
