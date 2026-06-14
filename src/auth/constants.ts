import type { User } from '@/domain';

/**
 * Demo users for development — shared between client and server.
 * This file has no server-only imports.
 */
export const DEMO_USERS: User[] = [
  {
    id: "user-viewer-1",
    email: "viewer@demo.com",
    name: "Alex Viewer",
    role: "viewer",
  },
  {
    id: "user-editor-1",
    email: "editor@demo.com",
    name: "Sam Editor",
    role: "editor",
  },
  {
    id: "user-publisher-1",
    email: "publisher@demo.com",
    name: "Jordan Publisher",
    role: "publisher",
  },
];

export const SESSION_COOKIE = "page-studio-session";
