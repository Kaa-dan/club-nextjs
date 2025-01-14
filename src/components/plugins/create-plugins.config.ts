import CreateIssueForm from "./issues/create-issues";
import CreateRules from "@/components/plugins/rules-regulations/create.rules";
import DebateForm from "./debates/create-debate";
import CreateProjectForm from "./projects/create-project";
import ProjectForm from "./projects/create-project";
interface PluginProps {
  forumId: string;
  forum: TForum;
}

export interface PluginConfig {
  title: string;
  description: string;
  component: React.ComponentType<PluginProps>;
}

export const createPluginConfig: Record<TPlugins, PluginConfig> = {
  issues: {
    title: "Issues",
    description: "Create and manage issues",
    component: CreateIssueForm,
  },
  rules: {
    title: "Rules & Regulations",
    description: "Manage rules and regulations",
    component: CreateRules,
  },
  debate: {
    title: "Debate",
    description: "Manage Debate",
    component: DebateForm,
  },
  projects: {
    title: "Project",
    description: "Manage Project",
    component: ProjectForm,
  },
};
