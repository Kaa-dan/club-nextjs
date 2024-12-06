import IssueView from "./issues/view-issue";
import View from "./rules-regulations/view";
import ViewDebate from "./debates/view-debate";
import ViewProject from "./projects/view";
interface PluginProps {
  forumId: string;
  forum: TForum;
}

export interface PluginConfig {
  title: string;
  description: string;
  component: React.ComponentType<PluginProps>;
}

export const viewPluginConfig: Record<TPlugins, PluginConfig> = {
  issues: {
    title: "Issues",
    description: "View issues",
    component: IssueView,
  },
  rules: {
    title: "Rules & Regulations",
    description: "View rules and regulations",
    component: View,
  },
  debate: {
    title: "Debate",
    description: "View Debate",
    component: ViewDebate,
  },
  projects: {
    title: "projects",
    description: "View Projects",
    component: ViewProject,
  },
};
