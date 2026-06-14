import type { Role, Permission } from '@/domain';

/**
 * Permission matrix: maps each role to its allowed permissions.
 */
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  viewer: ["preview"],
  editor: ["preview", "edit"],
  publisher: ["preview", "edit", "publish"],
};

/**
 * Check if a role has a specific permission.
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Check if a role can preview pages.
 */
export function canPreview(role: Role): boolean {
  return hasPermission(role, "preview");
}

/**
 * Check if a role can edit drafts.
 */
export function canEdit(role: Role): boolean {
  return hasPermission(role, "edit");
}

/**
 * Check if a role can publish releases.
 */
export function canPublish(role: Role): boolean {
  return hasPermission(role, "publish");
}

/**
 * Require a permission, throwing an error if not allowed.
 */
export function requirePermission(
  role: Role,
  permission: Permission
): void {
  if (!hasPermission(role, permission)) {
    throw new Error(
      `Role "${role}" does not have "${permission}" permission`
    );
  }
}

/**
 * Get all permissions for a role.
 */
export function getPermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}
