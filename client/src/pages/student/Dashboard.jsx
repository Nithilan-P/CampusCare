import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStudentDashboard } from '../../api/dashboard';
import { useAuth } from '../../context/AuthContext';

function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
      <p className="text-sm text-text-secondary">{label}</p>
      <p className={`mt-2 text-3xl font-semibold ${accent}`}>{value}</p>
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
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getStudentDashboard();
        setStats(res.data.data.stats);
        setRecentComplaints(res.data.data.recentComplaints);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-sm text-text-secondary">Here's what's happening with your complaints.</p>
        </div>
        <Link
          to="/student/complaints/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark"
        >
          New Complaint
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>
      )}

      {loading ? (
        <p className="text-text-secondary">Loading...</p>
      ) : (
        <>
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Complaints" value={stats.total} accent="text-text-primary" />
            <StatCard label="Pending" value={stats.pending} accent="text-warning" />
            <StatCard label="In Progress" value={stats.inProgress} accent="text-primary" />
            <StatCard label="Resolved" value={stats.resolved} accent="text-success" />
          </div>

          <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary">Recent Complaints</h2>
              <Link to="/student/complaints" className="text-sm font-medium text-primary hover:underline">
                View all
              </Link>
            </div>

            {recentComplaints.length === 0 ? (
              <p className="text-sm text-text-secondary">
                You haven't submitted any complaints yet.
              </p>
            ) : (
              <div className="space-y-3">
                {recentComplaints.map((complaint) => (
                  <Link
                    key={complaint._id}
                    to={`/student/complaints/${complaint._id}`}
                    className="flex items-center justify-between rounded-lg border border-border px-4 py-3 transition hover:border-primary"
                  >
                    <div>
                      <p className="font-medium text-text-primary">{complaint.title}</p>
                      <p className="text-xs text-text-secondary">
                        {complaint.category} · {complaint.location}
                      </p>
                    </div>
                    <StatusBadge status={complaint.status} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;