import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getAllComplaints } from '../../api/complaints';

const CATEGORIES = ['Electrical', 'Plumbing', 'Furniture', 'Internet', 'Cleaning', 'Others'];
const STATUSES = ['Pending', 'Assigned', 'In Progress', 'Resolved'];
const PRIORITIES = ['Low', 'Medium', 'High'];

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

function AllComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filterCategory) params.category = filterCategory;
      if (filterStatus) params.status = filterStatus;
      if (filterPriority) params.priority = filterPriority;
      if (filterDepartment) params.department = filterDepartment;

      const res = await getAllComplaints(params);
      setComplaints(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load complaints');
    } finally {
      setLoading(false);
    }
  }, [filterCategory, filterStatus, filterPriority, filterDepartment]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-text-primary">All Complaints</h1>
        <p className="text-sm text-text-secondary">View and manage every complaint across campus.</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-lg border border-border px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="rounded-lg border border-border px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="rounded-lg border border-border px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">All priorities</option>
          {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>

        <input
          type="text"
          placeholder="Filter by department..."
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="flex-1 min-w-[160px] rounded-lg border border-border px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
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
                <th className="px-4 py-3 font-medium text-text-secondary">Student</th>
                <th className="px-4 py-3 font-medium text-text-secondary">Category</th>
                <th className="px-4 py-3 font-medium text-text-secondary">Assigned To</th>
                <th className="px-4 py-3 font-medium text-text-secondary">Priority</th>
                <th className="px-4 py-3 font-medium text-text-secondary">Status</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint._id} className="border-b border-border last:border-0 hover:bg-background">
                  <td className="px-4 py-3 font-medium text-text-primary">
                    <Link to={`/admin/complaints/${complaint._id}`} className="hover:text-primary">
                      {complaint.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{complaint.studentId?.name || '—'}</td>
                  <td className="px-4 py-3 text-text-secondary">{complaint.category}</td>
                  <td className="px-4 py-3 text-text-secondary">{complaint.assignedTo?.name || 'Unassigned'}</td>
                  <td className="px-4 py-3"><PriorityBadge priority={complaint.priority} /></td>
                  <td className="px-4 py-3"><StatusBadge status={complaint.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AllComplaints;