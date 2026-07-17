import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getComplaintById, updateComplaintStatus, addStaffNotes } from '../../api/complaints';

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
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusError, setStatusError] = useState('');
  const [completionImage, setCompletionImage] = useState(null);

  const [notesInput, setNotesInput] = useState('');
  const [notesSaving, setNotesSaving] = useState(false);
  const [notesMessage, setNotesMessage] = useState('');
  const [notesError, setNotesError] = useState('');

  const fetchComplaint = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getComplaintById(id);
      setComplaint(res.data.data);
      setNotesInput(res.data.data.staffNotes || '');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load complaint');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setStatusError('');
    setStatusUpdating(true);
    try {
      const formData = new FormData();
      formData.append('status', newStatus);
      if (newStatus === 'Resolved' && completionImage) {
        formData.append('image', completionImage);
      }

      await updateComplaintStatus(id, formData);
      await fetchComplaint();
      setCompletionImage(null);
    } catch (err) {
      setStatusError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleNotesSave = async () => {
    setNotesError('');
    setNotesMessage('');
    setNotesSaving(true);
    try {
      const res = await addStaffNotes(id, { staffNotes: notesInput });
      setNotesMessage(res.data.message);
      setComplaint(res.data.data);
    } catch (err) {
      setNotesError(err.response?.data?.message || 'Failed to save notes');
    } finally {
      setNotesSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-text-secondary">Loading...</p>;
  }

  if (error) {
    return (
      <div>
        <div className="mb-4 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>
        <Link to="/staff/complaints" className="text-sm font-medium text-primary hover:underline">
          Back to Assigned Complaints
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
        to="/staff/complaints"
        className="mb-4 inline-block text-sm font-medium text-primary hover:underline"
      >
        ← Back to Assigned Complaints
      </Link>

      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">{complaint.title}</h1>
            <p className="mt-1 text-sm text-text-secondary">
              Reported by {complaint.studentId?.name} on{' '}
              {new Date(complaint.createdAt).toLocaleDateString()}
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
          <DetailRow label="Student Email" value={complaint.studentId?.email} />
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

        {/* Status action panel */}
        {complaint.status !== 'Resolved' && (
          <div className="mb-6 rounded-lg border border-border bg-background p-4">
            <p className="mb-3 text-sm font-medium text-text-primary">Update Status</p>

            {statusError && (
              <div className="mb-3 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
                {statusError}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {complaint.status === 'Assigned' && (
                <button
                  onClick={() => handleStatusChange('In Progress')}
                  disabled={statusUpdating}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark disabled:opacity-60"
                >
                  {statusUpdating ? 'Updating...' : 'Start Work'}
                </button>
              )}

              {complaint.status === 'In Progress' && (
                <>
                  <div className="w-full">
                    <label className="mb-1 block text-sm text-text-secondary">
                      Completion photo <span className="text-text-secondary">(optional)</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCompletionImage(e.target.files?.[0] || null)}
                      className="mb-3 w-full rounded-lg border border-border px-3 py-2 text-sm text-text-primary file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white"
                    />
                  </div>
                  <button
                    onClick={() => handleStatusChange('Resolved')}
                    disabled={statusUpdating}
                    className="rounded-lg bg-success px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
                  >
                    {statusUpdating ? 'Updating...' : 'Mark Resolved'}
                  </button>
                </>
              )}
            </div>
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

        {/* Staff notes editor */}
        <div className="mb-6 rounded-lg border border-border bg-background p-4">
          <p className="mb-2 text-sm font-medium text-text-primary">Staff Notes</p>

          {notesMessage && (
            <div className="mb-3 rounded-lg bg-success/10 px-3 py-2 text-sm text-success">
              {notesMessage}
            </div>
          )}
          {notesError && (
            <div className="mb-3 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
              {notesError}
            </div>
          )}

          <textarea
            rows={3}
            value={notesInput}
            onChange={(e) => setNotesInput(e.target.value)}
            placeholder="Add notes about this complaint..."
            className="mb-3 w-full rounded-lg border border-border px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />

          <button
            onClick={handleNotesSave}
            disabled={notesSaving}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark disabled:opacity-60"
          >
            {notesSaving ? 'Saving...' : 'Save Notes'}
          </button>
        </div>

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