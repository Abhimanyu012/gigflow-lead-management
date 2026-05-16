export type PermissionEntry = {
  roles: string[];
  allowOwner?: boolean; // allow action if requester is owner of resource
};

export const PERMISSIONS: Record<string, Record<string, PermissionEntry>> = {
  leads: {
    export: { roles: ["admin", "sales"] },
    delete: { roles: ["admin"] },
    update: { roles: ["admin", "sales"], allowOwner: true },
    create: { roles: ["admin", "sales"], allowOwner: true },
    view: { roles: ["admin", "sales"], allowOwner: true },
  },
  users: {
    manage: { roles: ["admin"] },
  },
};

export default PERMISSIONS;
