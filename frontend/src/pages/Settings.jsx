import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import apiClient from "../api/apiClient";
import PageHeader from "../components/ui/PageHeader";
import ConfirmModal from "../components/ui/ConfirmModal";

export default function Settings() {
  const { user, logout, refreshUser } = useAuth();
  const toast = useToast();
  const [profile, setProfile] = useState({
    name: user?.name || "",
    country: user?.country || "",
    incomeBracket: user?.incomeBracket || "",
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [showDelete, setShowDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.patch("/auth/profile", profile);
      await refreshUser();
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.patch("/auth/password", passwords);
      setPasswords({ currentPassword: "", newPassword: "" });
      toast.success("Password updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Password change failed");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const res = await apiClient.get("/auth/export");
      const blob = new Blob([JSON.stringify(res.data.data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `taxpal-export-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Data exported");
    } catch {
      toast.error("Export failed");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await apiClient.delete("/auth/account");
      logout();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        subtitle="Manage your profile, security, and data"
      />

      <form
        onSubmit={handleProfileSave}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Profile</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              value={profile.name}
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Country
            </label>
            <select
              value={profile.country}
              onChange={(e) =>
                setProfile({ ...profile, country: e.target.value })
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
            >
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Income Bracket
            </label>
            <select
              value={profile.incomeBracket}
              onChange={(e) =>
                setProfile({ ...profile, incomeBracket: e.target.value })
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
            >
              <option value="">Select</option>
              <option value="low">Low</option>
              <option value="middle">Middle</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-4 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          Save Profile
        </button>
      </form>

      <form
        onSubmit={handlePasswordChange}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Change Password
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Current Password
            </label>
            <input
              type="password"
              value={passwords.currentPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, currentPassword: e.target.value })
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              New Password
            </label>
            <input
              type="password"
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, newPassword: e.target.value })
              }
              minLength={8}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-4 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          Update Password
        </button>
      </form>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Your Data</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Export All Data (JSON)
          </button>
          <button
            onClick={() => setShowDelete(true)}
            className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Delete Account
          </button>
        </div>
      </div>

      <ConfirmModal
        open={showDelete}
        title="Delete Account"
        message="This permanently deletes all your data. This action cannot be undone."
        confirmLabel="Delete Forever"
        danger
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  );
}
