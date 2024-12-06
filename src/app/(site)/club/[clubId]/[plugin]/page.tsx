import RulesLayout from "@/components/plugins/rules-regulations/rules-layout";
import IssuesLayout from "@/components/plugins/issues/issues-layout";
import React from "react";
import DebateLayout from "@/components/plugins/debates/debate-layout";
import ProjectLayout from "@/components/plugins/projects/project-layout";
const PluginPage = async ({
  params,
}: {
  params: Promise<{ plugin: string; clubId: string }>;
}) => {
  const { plugin, clubId } = await params;

  const renderPluginContent = () => {
    switch (plugin) {
      case "issues":
        return <IssuesLayout forum={"club"} forumId={clubId} plugin={plugin} />;
      case "rules":
        return <RulesLayout forum={"club"} forumId={clubId} plugin={plugin} />;
      case "debate":
        return <DebateLayout forumId={clubId} forum="club" plugin={plugin} />;
      case "projects":
        return <ProjectLayout forum="club" forumId={clubId} plugin={plugin} />;
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
