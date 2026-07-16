import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getComplaintById } from '../../api/complaints';

function StatusBadge({ status }) {
  const styles = {
    Pending: 'bg-warning/10 text-warning',
    Assigned: 'bg-primary/10 text-primary',
    'In Progress': 'bg-primary/10 text-primary',
    Resolved: 'bg-success/10 text-success',
  };

  return (
    <span className={`rounded-full px-3 py-1 text-sm font-medium ${styles[status] || 'bg-border text-text-secondary'}`}>
      {status}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const styles = {
    High: 'bg-danger/10 text-danger',
    Medium: 'bg-warning/10 text-warning',
    Low: 'bg-border text-text-secondary',
  };

  return (
    <span className={`rounded-full px-3 py-1 text-sm font-medium ${styles[priority]}`}>
      {priority} priority
    </span>
  );
}

function DetailRow({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">{label}</p>
      <p className="mt-1 text-sm text-text-primary">{value || '—'}</p>
    </div>
  );
}

function ComplaintDetails() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComplaint = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getComplaintById(id);
        setComplaint(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load complaint');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  if (loading) {
    return <p className="text-sm text-text-secondary">Loading...</p>;
  }

  if (error) {
    return (
      <div>
        <div className="mb-4 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>
        <Link to="/student/complaints" className="text-sm font-medium text-primary hover:underline">
          Back to My Complaints
        </Link>
      </div>
    );
  }

  if (!complaint) {
    return null;
  }

  const sortedTimeline = [...(complaint.timeline || [])].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/student/complaints"
        className="mb-4 inline-block text-sm font-medium text-primary hover:underline"
      >
        ← Back to My Complaints
      </Link>

      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">{complaint.title}</h1>
            <p className="mt-1 text-sm text-text-secondary">
              Submitted on {new Date(complaint.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <PriorityBadge priority={complaint.priority} />
            <StatusBadge status={complaint.status} />
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 border-t border-border pt-4 sm:grid-cols-3">
          <DetailRow label="Category" value={complaint.category} />
          <DetailRow label="Location" value={complaint.location} />
          <DetailRow
            label="Assigned To"
            value={complaint.assignedTo ? complaint.assignedTo.name : 'Not yet assigned'}
          />
        </div>

        <div className="mb-6">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-secondary">
            Description
          </p>
          <p className="text-sm leading-relaxed text-text-primary">{complaint.description}</p>
        </div>

        {complaint.image && (
          <div className="mb-6">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-secondary">
              Photo
            </p>
            <img
              src={complaint.image}
              alt="Complaint"
              className="h-56 w-56 rounded-lg border border-border object-cover"
            />
          </div>
        )}

        {complaint.completionImage && (
          <div className="mb-6">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-secondary">
              Completion Photo
            </p>
            <img
              src={complaint.completionImage}
              alt="Completion"
              className="h-56 w-56 rounded-lg border border-border object-cover"
            />
          </div>
        )}

        {complaint.staffNotes && (
          <div className="mb-6">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-secondary">
              Staff Notes
            </p>
            <p className="text-sm leading-relaxed text-text-primary">{complaint.staffNotes}</p>
          </div>
        )}

        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-text-secondary">
            Status Timeline
          </p>
          <ol className="space-y-4 border-l-2 border-border pl-4">
            {sortedTimeline.map((entry, index) => (
              <li key={index} className="relative">
                <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-primary" />
                <p className="text-sm font-medium text-text-primary">{entry.status}</p>
                {entry.note && <p className="text-sm text-text-secondary">{entry.note}</p>}
                <p className="mt-0.5 text-xs text-text-secondary">
                  {new Date(entry.date).toLocaleString()}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default ComplaintDetails;