import { useEffect, useState } from "react";
import { Link } from "react-router";
import { axiosInstance } from "../lib/axios";
import { ArrowLeft, Shield, Users, MessageSquare, Flag } from "lucide-react";

function AdminPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    axiosInstance.get("/admin/stats").then((r) => setStats(r.data)).catch(() => {});
    axiosInstance.get("/admin/users").then((r) => setUsers(r.data)).catch(() => {});
    axiosInstance.get("/admin/reports").then((r) => setReports(r.data)).catch(() => {});
  }, []);

  const deleteUser = async (id) => {
    if (!confirm("Delete user?")) return;
    await axiosInstance.delete(`/admin/users/${id}`);
    setUsers((u) => u.filter((x) => x._id !== id));
  };

  return (
    <div className="relative z-10 w-full max-w-4xl px-4 py-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <Link to="/" className="icon-btn"><ArrowLeft className="size-4" /></Link>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Shield className="size-6 text-blue-400" /> Admin</h1>
      </div>

      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="glass-panel-subtle rounded-2xl p-5"><Users className="size-5 text-blue-400 mb-2" /><p className="text-2xl font-bold">{stats.users}</p><p className="text-xs text-zinc-500">Users</p></div>
          <div className="glass-panel-subtle rounded-2xl p-5"><MessageSquare className="size-5 text-blue-400 mb-2" /><p className="text-2xl font-bold">{stats.messages}</p><p className="text-xs text-zinc-500">Messages</p></div>
          <div className="glass-panel-subtle rounded-2xl p-5"><Flag className="size-5 text-red-400 mb-2" /><p className="text-2xl font-bold">{stats.pendingReports}</p><p className="text-xs text-zinc-500">Reports</p></div>
        </div>
      )}

      <div className="glass-panel rounded-2xl overflow-hidden mb-8">
        <div className="panel-header"><h2 className="font-semibold">Users</h2></div>
        <div className="divide-y divide-white/[0.04]">
          {users.map((u) => (
            <div key={u._id} className="flex items-center justify-between p-4">
              <div><p className="text-sm font-medium">{u.fullName}</p><p className="text-xs text-zinc-500">{u.email}</p></div>
              <button type="button" onClick={() => deleteUser(u._id)} className="text-xs text-red-400 hover:text-red-300">Delete</button>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="panel-header"><h2 className="font-semibold">Reports</h2></div>
        <div className="divide-y divide-white/[0.04]">
          {reports.map((r) => (
            <div key={r._id} className="p-4 text-sm">
              <p className="text-zinc-300">{r.reason}</p>
              <p className="text-xs text-zinc-500 mt-1">{r.reporterId?.fullName} → {r.reportedUserId?.fullName}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
