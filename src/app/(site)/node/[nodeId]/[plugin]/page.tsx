import IssuesLayout from "@/components/plugins/issues/issues-layout";
import IssueTable from "@/components/plugins/issues/issues-table";
import React from "react";

const PluginPage = async ({
  params,
}: {
  params: Promise<{ plugin: string }>;
}) => {
  const plugin = (await params).plugin;
  return (
    <main>
      {plugin === "issues" ? (
        <IssuesLayout>
          <IssueTable />
        </IssuesLayout>
      ) : (
        <div className="flex h-full items-center justify-center">
          <span className="text-muted-foreground">Module not found</span>
        </div>
      )}
    </main>
  );
};

export default PluginPage;
