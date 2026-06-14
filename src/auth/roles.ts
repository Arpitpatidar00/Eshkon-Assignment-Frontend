import type { Role } from '@/domain';

/**
 * Role definitions with display metadata.
 */
export const ROLES: Record<Role, { label: string; description: string }> = {
  viewer: {
    label: "Viewer",
    description: "Can preview published pages only",
  },
  editor: {
    label: "Editor",
    description: "Can preview pages and edit drafts",
  },
  publisher: {
    label: "Publisher",
    description: "Can preview, edit, and publish releases",
  },
};

/**
 * Validate that a string is a valid role.
 */
export function isValidRole(role: string): role is Role {
  return role === "viewer" || role === "editor" || role === "publisher";
}
