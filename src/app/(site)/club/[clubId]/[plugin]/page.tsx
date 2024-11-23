import RulesLayout from "@/components/plugins/rules-regulations/rules-layout";
import IssuesLayout from "@/components/plugins/issues/issues-layout";
import React from "react";
import DebateLayout from "@/components/plugins/debates/debate-layout";
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
          <IssuesLayout forum={"club"} nodeorclubId={clubId} plugin={plugin} />
        );
      case "rules":
        return (
          <RulesLayout forum={"club"} nodeorclubId={clubId} plugin={plugin} />
        );
      case "debate":
        return (
          <DebateLayout nodeorclubId={clubId} forum="club" plugin={plugin} />
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
