import { useClubStore } from "@/store/clubs-store";
import { useNodeStore } from "@/store/nodes-store";
import { useCallback } from "react";
type Permission = (typeof ROLES)[TUserRole][number];

const ROLES = {
  owner: [
    // Common
    "view:profile",
    "view:newsFeed",
    "view:modules",
    "view:chapters",
    "view:members",
    "view:activities",
    "view:approvals",
    "view:preferences",

    // Rules
    "view:rulesReportOffense",
  ] as const,
  admin: [
    // Common
    "view:profile",
    "view:newsFeed",
    "view:modules",
    "view:chapters",
    "view:members",
    "view:activities",
    "view:approvals",
    "view:analytics",
    "view:preferences",

    // Rules
    "view:rulesReportOffense",
    "view:rules",

    // Issues
    "view:issues",
    "view:debates",
    "view:clubs",
    "view:members",
  ] as const,
  moderator: [
    // Common
    "view:profile",
    "view:newsFeed",
    "view:modules",
    "view:chapters",
    "view:members",
    "view:activities",
    "view:approvals",
  ] as const,
  member: [
    "view:profile",
    "view:newsFeed",
    "view:modules",
    "view:chapters",
    "view:members",
  ] as const,
  VISITOR: ["view:newsFeed", "view:modules", "view:members"],
} as const;

export function usePermission() {
  const { currentUserRole: clubRole } = useClubStore();
  const { currentUserRole: nodeRole } = useNodeStore();

  console.log({ clubRole, nodeRole });

  const role = clubRole || nodeRole;

  const hasPermission = useCallback(
    (permission: Permission) => {
      // if (!role) return false;
      // return ROLES[role as TUserRole].includes(permission);
      if (!role || !isValidRole(role)) return false;
      return (ROLES[role] as readonly Permission[])?.includes(permission);
    },
    [role]
  );

  return {
    hasPermission,
  };
}

function isValidRole(role: unknown): role is TUserRole {
  return typeof role === "string" && role in ROLES;
}
