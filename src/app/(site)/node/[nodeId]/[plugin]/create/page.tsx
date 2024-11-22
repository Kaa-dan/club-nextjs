// import CreateIssueForm from "@/components/plugins/issues/create-issues";
// import CreateRules from "@/components/plugins/rules-regulations/create.rules";
// import RuleForm from "@/components/plugins/rules-regulations/create.rules";
// import {
//   Breadcrumb,
//   BreadcrumbList,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbSeparator,
//   BreadcrumbPage,
// } from "@/components/ui/breadcrumb";
// import React from "react";

// const PluginCreate = async ({
//   params,
// }: {
//   params: Promise<{ plugin: TPlugins; nodeId: string }>;
// }) => {
//   const { plugin, nodeId } = await params;
//   // console.log({ nodeId });

//   const renderPlugin = () => {
//     switch (plugin) {
//       case "issues":
//         return <CreateIssueForm nodeOrClubId={nodeId} section={"node"} />;
//       case "rules":
//         // return <RuleForm nodeOrClubId={nodeId} section={"node"} />;
//         return <CreateRules nodeOrClubId={nodeId} section={"node"} />;
//       default:
//         return <div>Not found</div>;
//     }
//   };

//   // return <div>{renderPlugin()}</div>;
//   return (
//     <div className=" min-w-full">
//       <div className="flex flex-col gap-4">
//         <div>
//           <h1 className="text-xl">
//             {plugin === "rules" ? "Rules & Regulations" : "Issues"}
//           </h1>
//         </div>
//         <div>
//           <p className="text-xs">
//             Lorem ipsum dolor, sit amet consectetur adipisicing elit. Mollitia
//           </p>
//         </div>
//         <Breadcrumb>
//           <BreadcrumbList>
//             <BreadcrumbItem>
//               <BreadcrumbLink
//                 className="text-xs"
//                 href={`/node/${nodeId}/${plugin}/`}
//               >
//                 Rules & Regulations
//               </BreadcrumbLink>
//             </BreadcrumbItem>
//             <BreadcrumbSeparator />
//             <BreadcrumbItem>
//               <BreadcrumbPage className="text-xs">
//                 Create new rule
//               </BreadcrumbPage>
//             </BreadcrumbItem>
//           </BreadcrumbList>
//         </Breadcrumb>

//         <div className="w-full">
//           {renderPlugin()}
//           {/* <CreateRules nodeOrClubId={nodeId} section={"node"} /> */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PluginCreate;

import React from "react";
import { CustomBreadcrumb } from "@/components/globals/breadcrumb-component";
import { createPluginConfig } from "@/components/plugins/create-plugins.config";

const Page = async ({
  params,
}: {
  params: Promise<{ nodeId: string; plugin: string }>;
}) => {
  const { nodeId, plugin } = await params;

  const isValidPlugin = (plugin: string): plugin is TPlugins =>
    plugin in createPluginConfig;

  if (!isValidPlugin(plugin)) return <div>Plugin not found</div>;

  const config = createPluginConfig[plugin];
  const PluginComponent = config.component;

  const breadcrumbItems = [
    { label: config.title, href: `/node/${nodeId}/${plugin}` },
    { label: `Create new ${plugin}` },
  ];

  return (
    <div className=" min-w-full">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-xl">{config.title}</h1>
        </div>
        <div>
          <p className="text-xs">{config.description}</p>
        </div>
        <CustomBreadcrumb items={breadcrumbItems} className="my-1" />

        <div className="w-full">
          <PluginComponent nodeOrClubId={nodeId} section="node" />
        </div>
      </div>
    </div>
  );
};

export default Page;
