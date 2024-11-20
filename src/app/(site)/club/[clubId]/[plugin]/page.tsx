import RulesLayout from "@/components/plugins/rules-regulations/rules-layout";
import IssuesLayout from "@/components/plugins/issues/issues-layout";
import IssueTable from "@/components/plugins/issues/issues-table";
import React from "react";
import { RulesTable } from "@/components/plugins/rules-regulations/rules";
import DebateLayout from "@/components/plugins/debates/debate-layout";
import DebateTable from "@/components/plugins/debates/debate-table";
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
          <IssuesLayout
            section={"club"}
            nodeorclubId={clubId}
            plugin={plugin}
          />
          // <IssuesLayout>
          //   <IssueTable />
          // </IssuesLayout>
        );
      case "rules":
        return (
          <RulesLayout section={"club"} nodeorclubId={clubId} plugin={plugin} />
          //   <RulesTable
          //   nodeorclubId={clubId}
          //   plugin={plugin}
          //   section={"club"}
          // />
          // </RulesLayout>
        );
      case "debate":
        return (
          <DebateLayout>
            <DebateTable />
          </DebateLayout>
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
