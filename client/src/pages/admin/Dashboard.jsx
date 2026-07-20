import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { getAdminDashboard } from '../../api/dashboard';

const CATEGORY_COLORS = ['#4F46E5', '#14B8A6', '#F59E0B', '#F43F5E', '#10B981', '#64748B'];
const PRIORITY_COLORS = { High: '#F43F5E', Medium: '#F59E0B', Low: '#64748B' };

function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-sm sm:p-5">
      <p className="text-xs text-text-secondary sm:text-sm">{label}</p>
      <p className={`mt-2 text-2xl font-semibold sm:text-3xl ${accent}`}>{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Pending: 'bg-warning/10 text-warning',
    Assigned: 'bg-primary/10 text-primary',
    'In Progress': 'bg-primary/10 text-primary',
    Resolved: 'bg-success/10 text-success',
  };

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[status] || 'bg-border text-text-secondary'}`}>
      {status}
    </span>
  );
}

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [priorityBreakdown, setPriorityBreakdown] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getAdminDashboard();
        const { stats, categoryBreakdown, priorityBreakdown, recentComplaints } = res.data.data;
        setStats(stats);
        setCategoryBreakdown(
          categoryBreakdown.map((c) => ({ name: c._id, count: c.count }))
        );
        setPriorityBreakdown(
          priorityBreakdown.map((p) => ({ name: p._id, value: p.count }))
        );
        setRecentComplaints(recentComplaints);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <p className="text-sm text-text-secondary">Loading...</p>;
  }

  if (error) {
    return <div className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-text-primary">Admin Dashboard</h1>
        <p className="text-sm text-text-secondary">Overview of all campus complaints and users.</p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard label="Total Complaints" value={stats.totalComplaints} accent="text-text-primary" />
        <StatCard label="Pending" value={stats.pending} accent="text-warning" />
        <StatCard label="In Progress" value={stats.assigned + stats.inProgress} accent="text-primary" />
        <StatCard label="Resolved" value={stats.resolved} accent="text-success" />
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4">
        <StatCard label="Total Students" value={stats.totalStudents} accent="text-text-primary" />
        <StatCard label="Total Staff" value={stats.totalStaff} accent="text-text-primary" />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-4 shadow-sm sm:p-6">
          <h2 className="mb-4 text-base font-semibold text-text-primary sm:text-lg">Complaints by Category</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={categoryBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748B' }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {categoryBreakdown.map((entry, index) => (
                  <Cell key={entry.name} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-surface p-4 shadow-sm sm:p-6">
          <h2 className="mb-4 text-base font-semibold text-text-primary sm:text-lg">Complaints by Priority</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={priorityBreakdown}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {priorityBreakdown.map((entry) => (
                  <Cell key={entry.name} fill={PRIORITY_COLORS[entry.name] || '#64748B'} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-text-primary sm:text-lg">Recent Complaints</h2>
          <Link to="/admin/complaints" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </div>

        {recentComplaints.length === 0 ? (
          <p className="text-sm text-text-secondary">No complaints yet.</p>
        ) : (
          <div className="space-y-3">
            {recentComplaints.map((complaint) => (
              <Link
                key={complaint._id}
                to={`/admin/complaints/${complaint._id}`}
                className="flex items-center justify-between rounded-lg border border-border px-4 py-3 transition hover:border-primary"
              >
                <div>
                  <p className="font-medium text-text-primary">{complaint.title}</p>
                  <p className="text-xs text-text-secondary">
                    {complaint.category} · {complaint.studentId?.name || 'Unknown student'}
                  </p>
                </div>
                <StatusBadge status={complaint.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;