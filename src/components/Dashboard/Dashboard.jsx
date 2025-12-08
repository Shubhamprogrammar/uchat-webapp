import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUsers, FiMessageSquare, FiBell, FiSettings } from "react-icons/fi";
import { AiOutlineUser } from "react-icons/ai";
import { MdOutlineReport } from "react-icons/md";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const statsInitial = [
  { id: 1, label: "Total Users", value: 5240 },
  { id: 2, label: "Active Users", value: 421 },
  { id: 3, label: "Messages Today", value: 18234 },
  { id: 4, label: "Reports", value: 12 },
];

const sampleUsers = new Array(24).fill(0).map((_, i) => ({
  _id: `user_${i + 1}`,
  name: `User ${i + 1}`,
  mobile: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
  city: ["Mumbai", "Delhi", "Bengaluru", "Kolkata"][i % 4],
  state: ["MH", "DL", "KA", "WB"][i % 4],
  last_seen: new Date(Date.now() - i * 60000 * 5).toISOString(),
  is_blocked: i % 7 === 0,
  is_deleted: false,
}));

// const sampleReports = [
//   { id: 1, reportedUser: "User 3", reason: "Harassment", reportedBy: "User 9", status: "pending" },
//   { id: 2, reportedUser: "User 7", reason: "Spam", reportedBy: "User 2", status: "reviewed" },
// ];

// Mock analytics data for charts (card-style)
const userGrowth = [
  { day: "Mon", users: 40 },
  { day: "Tue", users: 60 },
  { day: "Wed", users: 80 },
  { day: "Thu", users: 120 },
  { day: "Fri", users: 160 },
  { day: "Sat", users: 200 },
  { day: "Sun", users: 240 },
];

const messagesPerDay = [
  { day: "Mon", messages: 1200 },
  { day: "Tue", messages: 1500 },
  { day: "Wed", messages: 1800 },
  { day: "Thu", messages: 2100 },
  { day: "Fri", messages: 2500 },
  { day: "Sat", messages: 3000 },
  { day: "Sun", messages: 3234 },
];

const statusPie = [
  { name: "Active", value: 421 },
  { name: "Blocked", value: 59 },
  { name: "Deleted", value: 12 },
];
const PIE_COLORS = ["#10B981", "#FBBF24", "#EF4444"]; // green, yellow, red

export default function AdminDashboard() {
  // top-level state shared between pages (mocked)
  const [stats, setStats] = useState(statsInitial);
  const [users, setUsers] = useState(sampleUsers);
  // const [reports, setReports] = useState(sampleReports);
  const [announcement, setAnnouncement] = useState("");
  const [settings, setSettings] = useState({
    allowSignups: true,
    maxMessageLength: 2000,
    darkMode: true,
  });
  const [activityLogs, setActivityLogs] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("");

  useEffect(() => {
    // populate some activity logs
    setActivityLogs([
      { id: 1, text: "Admin logged in", time: new Date().toISOString() },
      { id: 2, text: "Checked reports", time: new Date().toISOString() },
    ]);
  }, []);

  function formatDate(iso) {
    const d = new Date(iso);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  }

  // All actions update local state (mock behavior)
  function handleAction(userId, action) {
    setUsers((prev) =>
      prev.map((u) => {
        if (u._id !== userId) return u;
        if (action === "block") return { ...u, is_blocked: true };
        if (action === "unblock") return { ...u, is_blocked: false };
        if (action === "delete") return { ...u, is_deleted: true };
        if (action === "restore") return { ...u, is_deleted: false };
        return u;
      })
    );
    setActivityLogs((l) => [
      { id: Date.now(), text: `Admin performed ${action} on ${userId}`, time: new Date().toISOString() },
      ...l,
    ]);
  }

  function openModal(user, mode) {
    setSelectedUser(user);
    setModalMode(mode);
    setShowModal(true);
  }
  function closeModal() {
    setShowModal(false);
    setSelectedUser(null);
    setModalMode("");
  }

  function sendAnnouncement() {
    if (!announcement.trim()) return;
    setActivityLogs((l) => [
      { id: Date.now(), text: `Announcement: ${announcement}`, time: new Date().toISOString() },
      ...l,
    ]);
    setAnnouncement("");
    // demo: show a notification
    alert("Announcement broadcasted (demo)");
  }

  function toggleSetting(key) {
    setSettings((s) => ({ ...s, [key]: !s[key] }));
    setActivityLogs((l) => [
      { id: Date.now(), text: `Toggled ${key}`, time: new Date().toISOString() },
      ...l,
    ]);
  }

  return (
    <Router>
      <div className="bg-gray-900 text-gray-100">
        <div className="w-full px-6 py-8">
          <div className="grid grid-cols-12 gap-6">
            {/* SIDEBAR */}
            <aside className="col-span-12 md:col-span-3 lg:col-span-2 bg-gray-800 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-500 flex items-center justify-center text-2xl">U</div>
                <div>
                  <h3 className="font-semibold">UChat Admin</h3>
                  <p className="text-xs text-gray-400">Super Admin</p>
                </div>
              </div>

              <nav className="space-y-2">
                <SidebarLink to="/" icon={<FiUsers />} label="Overview" />
                <SidebarLink to="/users" icon={<FiUsers />} label="Users" />
                {/* <SidebarLink to="/reports" icon={<MdOutlineReport />} label="Reports" />
                <SidebarLink to="/conversations" icon={<FiMessageSquare />} label="Conversations" /> */}
                <SidebarLink to="/announcements" icon={<FiBell />} label="Announcements" />
                <SidebarLink to="/system" icon={<FiSettings />} label="System" />
              </nav>
            </aside>

            {/* MAIN */}
            <main className="col-span-12 md:col-span-9 lg:col-span-10">
              <header className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>
              </header>

              <Routes>
                <Route path="/" element={<OverviewPage stats={stats} userGrowth={userGrowth} messagesPerDay={messagesPerDay} statusPie={statusPie} />} />
                <Route path="/users" element={<UsersPage users={users} onAction={handleAction} openModal={openModal} formatDate={formatDate} />} />
                {/* <Route path="/reports" element={<ReportsPage reports={reports} setReports={setReports} />} />
                <Route path="/conversations" element={<ConversationsPage />} /> */}
                <Route path="/announcements" element={<AnnouncementsPage announcement={announcement} setAnnouncement={setAnnouncement} sendAnnouncement={sendAnnouncement} />} />
                <Route path="/system" element={<SystemPage settings={settings} toggleSetting={toggleSetting} activityLogs={activityLogs} />} />
              </Routes>

              {/* Modal */}
              {showModal && selectedUser && (
                <Modal onClose={closeModal}>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">Confirm {modalMode}</h3>
                    <p className="text-sm text-gray-400 mb-4">Are you sure you want to {modalMode} <strong>{selectedUser.name}</strong>?</p>
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={closeModal} className="px-3 py-1 rounded bg-gray-700">Cancel</button>
                      <button onClick={() => { handleAction(selectedUser._id, modalMode); closeModal(); }} className="px-3 py-1 rounded bg-red-600">Confirm</button>
                    </div>
                  </div>
                </Modal>
              )}

            </main>
          </div>
        </div>
      </div>
    </Router>
  );
}

/* ---------------------- Pages & Components ---------------------- */

function OverviewPage({ stats, userGrowth, messagesPerDay, statusPie }) {
  return (
    <div className="space-y-6">
      {/* Stats row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <motion.div key={s.id} className="p-4 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-700 shadow-inner flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">{s.label}</div>
              <div className="text-2xl font-bold mt-1">{s.value.toLocaleString()}</div>
            </div>
            <div className="text-3xl opacity-80">{s.label === 'Total Users' ? <FiUsers /> : <AiOutlineUser />}</div>
          </motion.div>
        ))}
      </section>

      {/* Card-style charts */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">User Growth (weekly)</h3>
            <div className="text-xs text-gray-400">Last 7 days</div>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowth} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#111827" />
                <XAxis dataKey="day" tick={{ fill: '#9CA3AF' }} />
                <YAxis tick={{ fill: '#9CA3AF' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none' }} />
                <Line type="monotone" dataKey="users" stroke="#7C3AED" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Messages per Day</h3>
            <div className="text-xs text-gray-400">Last 7 days</div>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={messagesPerDay} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#111827" />
                <XAxis dataKey="day" tick={{ fill: '#9CA3AF' }} />
                <YAxis tick={{ fill: '#9CA3AF' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none' }} />
                <Bar dataKey="messages" radius={[6, 6, 6, 6]} fill="#06B6D4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">User Status</h3>
            <div className="text-xs text-gray-400">Active / Blocked / Deleted</div>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} fill="#8884d8" label={{ fill: '#9CA3AF' }}>
                  {statusPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}

function UsersPage({ users, onAction, openModal, formatDate }) {
  return (
    <div className="bg-gray-800 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Users</h2>
        <div className="text-sm text-gray-400">Total: {users.length}</div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left">
          <thead className="text-xs text-gray-400 uppercase">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Mobile</th>
              <th className="p-2">Location</th>
              <th className="p-2">Last Seen</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className={`border-t border-gray-700 ${u.is_deleted ? 'opacity-50 line-through' : ''}`}>
                <td className="p-2 align-middle">{u.name}</td>
                <td className="p-2">{u.mobile}</td>
                <td className="p-2">{u.city}, {u.state}</td>
                <td className="p-2 text-sm text-gray-400">{formatDate(u.last_seen)}</td>
                <td className="p-2">
                  {u.is_deleted ? <Badge label="Deleted" variant="red" /> : (u.is_blocked ? <Badge label="Blocked" variant="yellow" /> : <Badge label="Active" variant="green" />)}
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    {u.is_blocked ? (
                      <button onClick={() => onAction(u._id, 'unblock')} className="px-2 py-1 text-sm rounded bg-gray-700">Unblock</button>
                    ) : (
                      <button onClick={() => openModal(u, 'block')} className="px-2 py-1 text-sm rounded bg-yellow-600">Block</button>
                    )}

                    {u.is_deleted ? (
                      <button onClick={() => onAction(u._id, 'restore')} className="px-2 py-1 text-sm rounded bg-gray-700">Restore</button>
                    ) : (
                      <button onClick={() => openModal(u, 'delete')} className="px-2 py-1 text-sm rounded bg-red-600">Delete</button>
                    )}

                    <button onClick={() => alert('View chats - demo')} className="px-2 py-1 text-sm rounded bg-indigo-600">View</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// function ReportsPage({ reports, setReports }) {
//   return (
//     <div className="bg-gray-800 rounded-2xl p-4">
//       <div className="flex items-center justify-between mb-3">
//         <h2 className="text-lg font-semibold">Reports</h2>
//         <div className="text-sm text-gray-400">Total: {reports.length}</div>
//       </div>

//       <div className="space-y-2">
//         {reports.map((r) => (
//           <div key={r.id} className="p-2 rounded-lg bg-gray-900 border border-gray-700 flex items-center justify-between">
//             <div>
//               <div className="text-sm font-medium">{r.reportedUser}</div>
//               <div className="text-xs text-gray-400">{r.reason} • reported by {r.reportedBy}</div>
//             </div>
//             <div className="flex items-center gap-2">
//               <button onClick={() => alert('Review - demo')} className="px-2 py-1 rounded bg-indigo-600 text-sm">Review</button>
//               <button onClick={() => setReports((prev) => prev.filter(rr => rr.id !== r.id))} className="px-2 py-1 rounded bg-gray-700 text-sm">Ignore</button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// function ConversationsPage() {
//   return (
//     <div className="bg-gray-800 rounded-2xl p-4">
//       <h2 className="text-lg font-semibold mb-3">Conversations (demo)</h2>
//       <div className="text-sm text-gray-400">Conversation monitoring is disabled by default — only review reported threads.</div>
//     </div>
//   );
// }

function AnnouncementsPage({ announcement, setAnnouncement, sendAnnouncement }) {
  return (
    <div className="bg-gray-800 rounded-2xl p-4">
      <h2 className="text-lg font-semibold mb-3">Announcements</h2>
      <textarea value={announcement} onChange={(e) => setAnnouncement(e.target.value)} placeholder="Write announcement..." className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-sm h-40" />
      <div className="flex items-center gap-2 mt-2">
        <button onClick={sendAnnouncement} className="px-3 py-1 rounded bg-gradient-to-r from-indigo-600 to-purple-600 text-sm">Broadcast</button>
        <button onClick={() => setAnnouncement('')} className="px-3 py-1 rounded bg-gray-700 text-sm">Clear</button>
      </div>
    </div>
  );
}

function SystemPage({ settings, toggleSetting, activityLogs }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-gray-800 rounded-2xl p-4">
        <h2 className="text-lg font-semibold mb-3">System Settings</h2>
        <div className="space-y-3">
          <SettingRow label="Allow new signups" enabled={settings.allowSignups} onToggle={() => toggleSetting('allowSignups')} />
          <SettingRow label="Dark Mode" enabled={settings.darkMode} onToggle={() => toggleSetting('darkMode')} />
          <div className="text-xs text-gray-400 mt-2">Max message length: {settings.maxMessageLength}</div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-2xl p-4">
        <h2 className="text-lg font-semibold mb-3">Activity Logs</h2>
        <div className="h-64 overflow-y-auto text-xs text-gray-400 space-y-2">
          {activityLogs.map((a) => (
            <div key={a.id} className="p-2 rounded bg-gray-900 border border-gray-700">{a.text} • <span className="text-xxs text-gray-500">{new Date(a.time).toLocaleString()}</span></div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------- Small UI Helpers ---------------------- */
function SidebarLink({ to, icon, label }) {
  return (
    <NavLink to={to} end className={({ isActive }) => `flex items-center gap-3 p-2 rounded-lg ${isActive ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'text-gray-300 hover:bg-gray-900'}`}>
      <div className="text-xl opacity-90">{icon}</div>
      <div className="text-sm font-medium">{label}</div>
    </NavLink>
  );
}

function Badge({ label, variant = 'green' }) {
  const colors = {
    green: 'bg-green-700 text-green-100',
    yellow: 'bg-yellow-700 text-yellow-100',
    red: 'bg-red-700 text-red-100',
  };
  return <span className={`px-2 py-1 rounded text-xs ${colors[variant]}`}>{label}</span>;
}

function SettingRow({ label, enabled, onToggle }) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm">{label}</div>
      <button onClick={onToggle} className={`px-2 py-1 rounded ${enabled ? 'bg-indigo-600' : 'bg-gray-700'}`}>
        {enabled ? 'On' : 'Off'}
      </button>
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
      <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10 w-full max-w-md mx-4 rounded-2xl overflow-hidden bg-gray-800 border border-gray-700 shadow-lg">
        {children}
      </motion.div>
    </div>
  );
}
