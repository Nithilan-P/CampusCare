import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getMyComplaints } from '../../api/complaints';

const CATEGORIES = ['Electrical', 'Plumbing', 'Furniture', 'Internet', 'Cleaning', 'Others'];
const STATUSES = ['Pending', 'Assigned', 'In Progress', 'Resolved'];

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

function PriorityBadge({ priority }) {
  const styles = {
    High: 'text-danger',
    Medium: 'text-warning',
    Low: 'text-text-secondary',
  };

  return <span className={`text-xs font-medium ${styles[priority]}`}>{priority}</span>;
}

function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sort, setSort] = useState('desc');

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search) params.search = search;
      if (filterStatus) params.filterStatus = filterStatus;
      if (filterCategory) params.filterCategory = filterCategory;
      if (sort) params.sort = sort;

      const res = await getMyComplaints(params);
      setComplaints(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load complaints');
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus, filterCategory, sort]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchComplaints();
    }, 300);

    return () => clearTimeout(timeout);
  }, [fetchComplaints]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">My Complaints</h1>
          <p className="text-sm text-text-secondary">View and track all complaints you've submitted.</p>
        </div>
        <Link
          to="/student/complaints/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark"
        >
          New Complaint
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] rounded-lg border border-border px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-lg border border-border px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="rounded-lg border border-border px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-lg border border-border px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="desc">Newest first</option>
          <option value="asc">Oldest first</option>
        </select>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>
      )}

      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        {loading ? (
          <p className="p-6 text-sm text-text-secondary">Loading...</p>
        ) : complaints.length === 0 ? (
          <p className="p-6 text-sm text-text-secondary">No complaints found.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-background">
              <tr>
                <th className="px-4 py-3 font-medium text-text-secondary">Title</th>
                <th className="px-4 py-3 font-medium text-text-secondary">Category</th>
                <th className="px-4 py-3 font-medium text-text-secondary">Location</th>
                <th className="px-4 py-3 font-medium text-text-secondary">Priority</th>
                <th className="px-4 py-3 font-medium text-text-secondary">Status</th>
                <th className="px-4 py-3 font-medium text-text-secondary">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr
                  key={complaint._id}
                  className="border-b border-border last:border-0 hover:bg-background"
                >
                  <td className="px-4 py-3 font-medium text-text-primary">
                    <Link to={`/student/complaints/${complaint._id}`} className="hover:text-primary">
                      {complaint.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{complaint.category}</td>
                  <td className="px-4 py-3 text-text-secondary">{complaint.location}</td>
                  <td className="px-4 py-3">
                    <PriorityBadge priority={complaint.priority} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={complaint.status} />
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default MyComplaints;