import React from "react";
import { CustomBreadcrumb } from "@/components/globals/breadcrumb-component";
import { createPluginConfig } from "@/components/plugins/create-plugins.config";

const Page = async ({
  params,
}: {
  params: Promise<{ clubId: string; plugin: string }>;
}) => {
  const { clubId, plugin } = await params;

  const isValidPlugin = (plugin: string): plugin is TPlugins =>
    plugin in createPluginConfig;

  if (!isValidPlugin(plugin)) return <div>Plugin not found</div>;

  const config = createPluginConfig[plugin];
  const PluginComponent = config.component;

  const breadcrumbItems = [
    { label: config.title, href: `/club/${clubId}/${plugin}` },
    { label: `Create new ${plugin}` },
  ];

  return (
    <div className=" min-w-full ">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-xl">{config.title}</h1>
        </div>
        <div>
          <p className="text-xs">{config.description}</p>
        </div>
        <CustomBreadcrumb items={breadcrumbItems} className="my-1" />

        <div className="w-full ">
          <PluginComponent forumId={clubId} forum="club" />
        </div>
      </div>
    </div>
  );
};

export default Page;
