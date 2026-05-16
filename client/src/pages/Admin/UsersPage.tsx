import React, { useEffect, useState } from "react";
import { PageWrapper } from "../../components/layout/PageWrapper";
import { usersApi } from "../../api/users.api";
import { SystemUser, UserRole } from "../../types/user.types";
import { useToastStore } from "../../store/toastStore";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { ShieldAlert, UserCog, User, ShieldCheck } from "lucide-react";

export const UsersPage = () => {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToastStore((s) => s.addToast);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const u = await usersApi.getAll();
      setUsers(u);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingUser, setPendingUser] = useState<{ id: string; role: UserRole; name: string } | null>(null);

  const toggleAdmin = (id: string, currentRole: UserRole, name: string) => {
    setPendingUser({ id, role: currentRole, name });
    setConfirmOpen(true);
  };

  const doToggleAdmin = async () => {
    if (!pendingUser) return;
    const newRole: UserRole = pendingUser.role === "admin" ? "sales" : "admin";
    try {
      await usersApi.updateRole(pendingUser.id, newRole);
      toast(`Updated ${pendingUser.name}'s role to ${newRole}`, "success");
      fetchUsers();
    } catch {
      toast("Failed to update role. Please try again.", "error");
    } finally {
      setConfirmOpen(false);
      setPendingUser(null);
    }
  };

  return (
    <PageWrapper>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold mb-4 tracking-wide uppercase">
          <ShieldAlert className="w-3.5 h-3.5" />
          Admin Dashboard
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">User Management</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Manage system access and roles across the organization.{" "}
          <span className="font-semibold">{users.length} users total.</span>
        </p>
      </div>

      <div className="card glass-heavy overflow-hidden border border-orange-500/10 shadow-lg shadow-orange-500/5">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-6 h-6 border-2 border-t-transparent border-[var(--accent)] rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm font-medium text-[var(--text-muted)]">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-sm text-[var(--text-muted)]">No users found.</div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-[var(--surface-2)] text-[var(--text-muted)] font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-[var(--surface-2)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                            u.role === "admin"
                              ? "bg-orange-500/20 text-orange-600 dark:text-orange-400"
                              : "bg-teal-500/20 text-teal-600 dark:text-teal-400"
                          }`}
                        >
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-[var(--text)]">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[var(--text-muted)]">{u.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
                          u.role === "admin"
                            ? "bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400"
                            : "bg-zinc-500/10 border-zinc-500/20 text-zinc-600 dark:text-zinc-400"
                        }`}
                      >
                        {u.role === "admin" ? (
                          <ShieldCheck className="w-3.5 h-3.5" />
                        ) : (
                          <User className="w-3.5 h-3.5" />
                        )}
                        {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border ${
                          u.role === "admin"
                            ? "border-[var(--border)] text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30"
                            : "border-orange-500/30 text-orange-600 hover:bg-orange-500 hover:text-white dark:text-orange-400 dark:hover:text-white shadow-sm"
                        }`}
                        onClick={() => toggleAdmin(u._id, u.role, u.name)}
                      >
                        <UserCog className="w-3.5 h-3.5" />
                        {u.role === "admin" ? "Revoke Admin" : "Promote to Admin"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        title={pendingUser?.role === "admin" ? "Revoke Admin Privileges" : "Promote to Admin"}
        message={
          pendingUser?.role === "admin"
            ? `Are you sure you want to revoke admin rights for ${pendingUser?.name}? They will be downgraded to Sales role.`
            : `Are you sure you want to promote ${pendingUser?.name} to Admin? They will have full system access.`
        }
        confirmLabel={pendingUser?.role === "admin" ? "Revoke Access" : "Confirm Promotion"}
        onConfirm={doToggleAdmin}
        onCancel={() => { setConfirmOpen(false); setPendingUser(null); }}
      />
    </PageWrapper>
  );
};

export default UsersPage;
