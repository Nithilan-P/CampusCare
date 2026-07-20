import { useEffect, useState } from 'react';
import { getAllComplaints } from '../../api/complaints';
import { getAdminDashboard } from '../../api/dashboard';

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-sm sm:p-5">
      <p className="text-xs text-text-secondary sm:text-sm">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-text-primary sm:text-3xl">{value}</p>
    </div>
  );
}

function convertToCSV(complaints) {
  const headers = [
    'Title',
    'Description',
    'Category',
    'Location',
    'Priority',
    'Status',
    'Student Name',
    'Student Email',
    'Assigned To',
    'Created At',
  ];

  const escapeCell = (value) => {
    const str = String(value ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = complaints.map((c) => [
    escapeCell(c.title),
    escapeCell(c.description),
    escapeCell(c.category),
    escapeCell(c.location),
    escapeCell(c.priority),
    escapeCell(c.status),
    escapeCell(c.studentId?.name),
    escapeCell(c.studentId?.email),
    escapeCell(c.assignedTo?.name || 'Unassigned'),
    escapeCell(new Date(c.createdAt).toLocaleString()),
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}

function downloadCSV(csvContent, filename) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function Reports() {
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [dashboardRes, complaintsRes] = await Promise.all([
          getAdminDashboard(),
          getAllComplaints(),
        ]);
        setStats(dashboardRes.data.data.stats);
        setComplaints(complaintsRes.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load report data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleExportCSV = () => {
    setExporting(true);
    try {
      const csv = convertToCSV(complaints);
      const timestamp = new Date().toISOString().split('T')[0];
      downloadCSV(csv, `campuscare-complaints-${timestamp}.csv`);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-text-secondary">Loading...</p>;
  }

  if (error) {
    return <div className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>;
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Reports & Analytics</h1>
          <p className="text-sm text-text-secondary">Export complaint data for offline analysis.</p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={exporting || complaints.length === 0}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark disabled:opacity-60"
        >
          {exporting ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard label="Total Complaints" value={stats.totalComplaints} />
        <StatCard label="Pending" value={stats.pending} />
        <StatCard label="Resolved" value={stats.resolved} />
        <StatCard label="Resolution Rate" value={`${stats.totalComplaints > 0 ? Math.round((stats.resolved / stats.totalComplaints) * 100) : 0}%`} />
      </div>

      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <p className="text-sm text-text-secondary">
          The CSV export includes all {complaints.length} complaints currently in the system, with
          full details: title, description, category, location, priority, status, student info,
          assigned staff, and submission date.
        </p>
      </div>
    </div>
  );
}

export default Reports;