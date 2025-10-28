// src/pages/Dashboard.tsx
import { useEffect, useMemo, useState, type ReactElement } from "react";
import {
  FaTachometerAlt,
  FaTicketAlt,
  FaUsers,
  FaChartBar,
  FaChevronLeft,
  FaSearch,
  FaBell,
  FaUserCircle,
  FaMoon,
  FaPlus,
  FaEdit,
  FaTrash,
  FaInbox,
  FaCheckCircle,
  FaBars,
} from "react-icons/fa";

type TicketStatus = "open" | "in_progress" | "closed";

type Ticket = {
  id: string;
  title: string;
  description?: string;
  status: TicketStatus;
  createdAt: number;
};

type Session = {
  email: string;
  token: string;
  expiresAt: number;
};

export default function Dashboard(): ReactElement {
  const [collapsed] = useState<boolean>(false);
  const [mobileSidebar, setMobileSidebar] = useState<boolean>(false);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TicketStatus>("open");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("ticketapp_session");
      if (!raw) {
        window.location.href = "/auth/login";
        return;
      }
      const parsed: Session = JSON.parse(raw);
      if (!parsed.expiresAt || parsed.expiresAt < Date.now()) {
        sessionStorage.removeItem("ticketapp_session");
        window.location.href = "/auth/login";
        return;
      }
      setSessionEmail(parsed.email ?? null);
    } catch {
      sessionStorage.removeItem("ticketapp_session");
      window.location.href = "/auth/login";
    }
  }, []);

  useEffect(() => {
    if (!sessionEmail) return;
    setLoading(true);
    try {
      const key = `ticketapp_tickets_${sessionEmail}`;
      const raw = localStorage.getItem(key);
      if (!raw) {
        const demo: Ticket[] = [
          {
            id: "t1",
            title: "Site down",
            description: "Main site unreachable",
            status: "open",
            createdAt: Date.now() - 86400000 * 2,
          },
          {
            id: "t2",
            title: "Checkout bug",
            description: "Payments failing for some cards",
            status: "in_progress",
            createdAt: Date.now() - 86400000 * 4,
          },
          {
            id: "t3",
            title: "Feature request: dark mode",
            description: "UI request",
            status: "closed",
            createdAt: Date.now() - 86400000 * 10,
          },
        ];
        localStorage.setItem(key, JSON.stringify(demo));
        setTickets(demo);
      } else {
        const arr = JSON.parse(raw) as Ticket[];
        setTickets(Array.isArray(arr) ? arr : []);
      }
    } catch {
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, [sessionEmail]);

  const stats = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter((t) => t.status === "open").length;
    const resolved = tickets.filter((t) => t.status === "closed").length;
    const in_progress = tickets.filter(
      (t) => t.status === "in_progress"
    ).length;
    return { total, open, resolved, in_progress };
  }, [tickets]);

  const chartData = useMemo(() => {
    const days: { label: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const dt = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const label = dt.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
      const start = new Date(
        dt.getFullYear(),
        dt.getMonth(),
        dt.getDate()
      ).getTime();
      const end = start + 24 * 60 * 60 * 1000;
      const count = tickets.filter(
        (t) => t.createdAt >= start && t.createdAt < end
      ).length;
      days.push({ label, count });
    }
    return days;
  }, [tickets]);

  const persistTickets = (next: Ticket[]) => {
    if (!sessionEmail) return;
    const key = `ticketapp_tickets_${sessionEmail}`;
    localStorage.setItem(key, JSON.stringify(next));
    setTickets(next);
  };

  const handleOpenCreate = () => {
    setEditingTicket(null);
    setTitle("");
    setDescription("");
    setStatus("open");
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!title || title.trim().length < 3)
      errs.title = "Title is required (3+ characters).";
    if (!["open", "in_progress", "closed"].includes(status))
      errs.status = "Invalid status.";
    if (description && description.length > 2000)
      errs.description = "Description max 2000 chars.";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    if (editingTicket) {
      const next = tickets.map((t) =>
        t.id === editingTicket.id
          ? {
              ...t,
              title: title.trim(),
              description: description.trim(),
              status,
            }
          : t
      );
      persistTickets(next);
      setToast({ type: "success", msg: "Ticket updated." });
    } else {
      const newTicket: Ticket = {
        id: `t${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        status,
        createdAt: Date.now(),
      };
      persistTickets([newTicket, ...tickets]);
      setToast({ type: "success", msg: "Ticket created." });
    }
    setIsModalOpen(false);
    setEditingTicket(null);
    setTitle("");
    setDescription("");
    setStatus("open");
    setTimeout(() => setToast(null), 2500);
  };

  const handleEdit = (t: Ticket) => {
    setEditingTicket(t);
    setTitle(t.title);
    setDescription(t.description ?? "");
    setStatus(t.status);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this ticket?")) return;
    persistTickets(tickets.filter((t) => t.id !== id));
    setToast({ type: "success", msg: "Ticket deleted." });
    setTimeout(() => setToast(null), 2000);
  };

  const handleLogout = () => {
    window.location.href = "/login";
  };

  const statusClass = (s: TicketStatus) =>
    s === "open"
      ? "status-open"
      : s === "in_progress"
      ? "status-in_progress"
      : "status-closed";

  const navItems = [
    {
      key: "overview",
      label: "Overview",
      icon: <FaTachometerAlt />,
      url: "/dashboard",
    },
    {
      key: "tickets",
      label: "My Tickets",
      icon: <FaTicketAlt />,
      url: "/tickets",
    },
    {
      key: "create",
      label: "Create Ticket",
      icon: <FaPlus />,
      url: "/tickets/create",
    },
    {
      key: "users",
      label: "Profile / Settings",
      icon: <FaUsers />,
      url: "/profile",
    },
    { key: "reports", label: "Reports", icon: <FaChartBar />, url: "/reports" },
  ];

  return (
    <div className="min-h-screen flex bg-[#0d0d0d] text-gray-200">
      {/* Mobile overlay */}
      {mobileSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen transition-all duration-200 bg-[#0b0b0b] border-r border-gray-800
        ${collapsed ? "w-16" : "w-64"} 
        ${
          mobileSidebar ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full flex flex-col">
          <div className="px-3 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`rounded-md p-2`}>
                <div className="text-white text-lg font-bold">
                  {!collapsed ? (
                    <>
                      Ticket<span className="text-blue-400">App</span>
                    </>
                  ) : (
                    <span className="text-blue-400">TA</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex md:hidden">
              <button
                onClick={() => setMobileSidebar(false)}
                className="text-gray-300 hover:text-blue-300"
              >
                <FaChevronLeft />
              </button>
            </div>
          </div>

          <nav
            className="mt-4 flex-1 px-1 space-y-1"
            role="navigation"
            aria-label="Main menu"
          >
            {navItems.map((n) => (
              <a
                key={n.key}
                href={n.url}
                className={`flex items-center gap-3 text-gray-200 hover:bg-gray-900 px-3 py-2 rounded-md mx-2 transition ${
                  collapsed ? "justify-center" : ""
                }`}
              >
                <span className="text-lg">{n.icon}</span>
                {!collapsed && <span className="text-sm">{n.label}</span>}
              </a>
            ))}
          </nav>

          <div className="px-3 py-4">
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 w-full text-sm text-red-400 hover:bg-gray-900 px-3 py-2 rounded-md transition ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <FaTicketAlt />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Top header */}
        <header
          className={`fixed top-0 left-0 right-0 md:left-64 w-full bg-[#0d0d0d] border-b border-gray-800 z-30 transition-all duration-200`}
        >
          <div className="max-w-[1440px] mx-auto px-4 py-3 flex items-center justify-between gap-2 md:gap-4">
            <div className="flex items-center gap-2 md:gap-3">
              <button
                className="md:hidden p-2 text-gray-300 hover:text-blue-300"
                onClick={() => setMobileSidebar(true)}
              >
                <FaBars />
              </button>
              <div className="relative">
                <label htmlFor="search" className="sr-only">
                  Search
                </label>
                <div className="flex items-center bg-[#111214] rounded-md border border-gray-800 px-3 py-1 w-full md:w-64">
                  <FaSearch className="text-gray-400 mr-2" />
                  <input
                    id="search"
                    placeholder="Search tickets, users..."
                    className="bg-transparent border-none outline-none text-sm text-gray-200 w-full"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <button
                aria-label="Toggle theme"
                className="p-2 rounded-md text-gray-300 hover:text-blue-300"
              >
                <FaMoon />
              </button>

              <button
                aria-label="Notifications"
                className="relative p-2 rounded-md text-gray-300 hover:text-blue-300"
              >
                <FaBell />
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold leading-none text-white bg-red-500 rounded-full">
                  3
                </span>
              </button>

              <div className="relative">
                <button
                  className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-gray-800 focus:outline-none"
                  aria-expanded="false"
                >
                  <FaUserCircle className="text-2xl text-gray-300" />
                  <div className="hidden md:block text-left">
                    <div className="text-sm text-gray-200">
                      {sessionEmail ?? "User"}
                    </div>
                    <div className="text-xs text-gray-400">Admin</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 md:p-6 max-w-[1440px] mx-auto mt-16 overflow-y-auto flex-1">
          {/* Stats */}
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="card-dark p-4 rounded-lg flex items-center gap-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-blue-700 to-blue-500 text-white">
                <FaTicketAlt />
              </div>
              <div>
                <div className="text-sm text-gray-400">Total Tickets</div>
                <div className="text-2xl font-bold">{stats.total}</div>
              </div>
            </div>

            <div className="card-dark p-4 rounded-lg flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-600 text-white">
                <FaInbox />
              </div>
              <div>
                <div className="text-sm text-gray-400">Open</div>
                <div className="text-2xl font-bold text-green-300">
                  {stats.open}
                </div>
              </div>
            </div>

            <div className="card-dark p-4 rounded-lg flex items-center gap-4">
              <div className="p-3 rounded-full bg-gray-600 text-white">
                <FaCheckCircle />
              </div>
              <div>
                <div className="text-sm text-gray-400">Resolved</div>
                <div className="text-2xl font-bold text-gray-300">
                  {stats.resolved}
                </div>
              </div>
            </div>
          </section>

          {/* Chart + Quick actions */}
          <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-2 card-dark p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">
                Tickets last 7 days
              </h3>
              <div className="w-full flex items-end gap-2 h-40">
                {chartData.map((d, i) => {
                  const h = Math.max(6, d.count * 12 + 6);
                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col-reverse items-center"
                    >
                      <div
                        className="w-full rounded-t-md"
                        style={{
                          height: `${h}px`,
                          background: "linear-gradient(180deg,#3b82f6,#2563eb)",
                        }}
                        title={`${d.count} tickets`}
                        role="img"
                        aria-label={`${d.count} tickets on ${d.label}`}
                      />
                      <div className="text-xs text-gray-400 mt-2">
                        {d.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card-dark p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleOpenCreate}
                  className="px-3 py-2 rounded bg-blue-600 text-white text-sm text-center flex items-center gap-2 justify-center"
                >
                  <FaPlus /> Manage / Create Ticket
                </button>
                <a
                  href="/tickets"
                  className="px-3 py-2 rounded border border-gray-700 text-sm text-center"
                >
                  Go to Tickets
                </a>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded text-sm border border-gray-700 text-red-400 text-center"
                >
                  Sign out
                </button>
              </div>
            </div>
          </section>

          {/* Recent Tickets */}
          <section className="mt-6 card-dark p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Recent Tickets</h3>
            {loading ? (
              <div>Loading...</div>
            ) : tickets.length === 0 ? (
              <div className="text-gray-400">
                No tickets yet. Create your first ticket.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tickets.slice(0, 6).map((t) => (
                  <article
                    key={t.id}
                    className="p-3 rounded border border-gray-800 bg-[#0f1112]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm text-gray-300 font-semibold">
                          {t.title}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {t.description}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          {new Date(t.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${statusClass(
                            t.status
                          )}`}
                        >
                          {t.status}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(t)}
                            className="px-2 py-1 text-sm rounded bg-gray-700 hover:bg-gray-600"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="px-2 py-1 text-sm rounded bg-red-700 hover:bg-red-600"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-lg card-dark p-6 rounded-lg">
            <h3 className="text-xl mb-3">
              {editingTicket ? "Edit Ticket" : "Create Ticket"}
            </h3>
            {toast && (
              <div
                className={`mb-3 p-2 rounded text-sm ${
                  toast.type === "success"
                    ? "bg-green-600/20 text-green-300"
                    : "bg-red-600/20 text-red-300"
                }`}
              >
                {toast.msg}
              </div>
            )}
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 rounded bg-[#0d0d0d] border border-gray-800"
                />
                {formErrors.title && (
                  <div className="text-red-400 text-sm mt-1">
                    {formErrors.title}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TicketStatus)}
                  className="w-full p-2 rounded bg-[#0d0d0d] border border-gray-800"
                >
                  <option value="open">open</option>
                  <option value="in_progress">in_progress</option>
                  <option value="closed">closed</option>
                </select>
                {formErrors.status && (
                  <div className="text-red-400 text-sm mt-1">
                    {formErrors.status}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full p-2 rounded bg-[#0d0d0d] border border-gray-800"
                />
                {formErrors.description && (
                  <div className="text-red-400 text-sm mt-1">
                    {formErrors.description}
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end mt-4">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingTicket(null);
                  }}
                  className="px-3 py-2 rounded border border-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-2 rounded bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style>{`
        .status-open { background-color: #ecfdf5; color: #065f46; padding: 2px 8px; border-radius: 9999px; }
        .status-in_progress { background-color: #fff7ed; color: #92400e; padding: 2px 8px; border-radius: 9999px; }
        .status-closed { background-color: #f3f4f6; color: #374151; padding: 2px 8px; border-radius: 9999px; }
        .card-dark { background: #0f1114; border: 1px solid rgba(255,255,255,0.03); box-shadow: 0 8px 24px rgba(2,6,23,0.6); }
      `}</style>
    </div>
  );
}
