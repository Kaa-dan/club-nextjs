import View from "./rules-regulations/view";

interface PluginProps {
    nodeOrClubId: string;
    section: TSections;
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
        component: View,
    },
    rules: {
        title: "Rules & Regulations",
        description: "View rules and regulations",
        component: View,
    },
    debate: {
        title: "Debate",
        description: "View Debate",
        component: View,
    },
}