import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  getComplaintById,
  assignComplaint,
  updateComplaintPriority,
  deleteComplaint,
} from '../../api/complaints';
import { getUsers } from '../../api/users';

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
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedStaff, setSelectedStaff] = useState('');
  const [assignSaving, setAssignSaving] = useState(false);
  const [assignMessage, setAssignMessage] = useState('');
  const [assignError, setAssignError] = useState('');

  const [selectedPriority, setSelectedPriority] = useState('');
  const [prioritySaving, setPrioritySaving] = useState(false);
  const [priorityMessage, setPriorityMessage] = useState('');
  const [priorityError, setPriorityError] = useState('');

  const [deleteError, setDeleteError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [complaintRes, staffRes] = await Promise.all([
        getComplaintById(id),
        getUsers({ role: 'staff' }),
      ]);
      setComplaint(complaintRes.data.data);
      setSelectedPriority(complaintRes.data.data.priority);
      setSelectedStaff(complaintRes.data.data.assignedTo?._id || '');
      setStaffList(staffRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load complaint');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAssign = async () => {
    setAssignError('');
    setAssignMessage('');
    if (!selectedStaff) {
      setAssignError('Please select a staff member');
      return;
    }
    setAssignSaving(true);
    try {
      const res = await assignComplaint(id, { staffId: selectedStaff });
      setComplaint(res.data.data);
      setAssignMessage(res.data.message);
    } catch (err) {
      setAssignError(err.response?.data?.message || 'Failed to assign complaint');
    } finally {
      setAssignSaving(false);
    }
  };

  const handlePriorityChange = async () => {
    setPriorityError('');
    setPriorityMessage('');
    setPrioritySaving(true);
    try {
      const res = await updateComplaintPriority(id, { priority: selectedPriority });
      setComplaint(res.data.data);
      setPriorityMessage(res.data.message);
    } catch (err) {
      setPriorityError(err.response?.data?.message || 'Failed to update priority');
    } finally {
      setPrioritySaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleteError('');
    if (!window.confirm('Are you sure you want to delete this complaint? This cannot be undone.')) {
      return;
    }
    try {
      await deleteComplaint(id);
      navigate('/admin/complaints', { replace: true });
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete complaint');
    }
  };

  if (loading) {
    return <p className="text-sm text-text-secondary">Loading...</p>;
  }

  if (error) {
    return (
      <div>
        <div className="mb-4 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>
        <Link to="/admin/complaints" className="text-sm font-medium text-primary hover:underline">
          Back to All Complaints
        </Link>
      </div>
    );
  }

  if (!complaint) return null;

  const sortedTimeline = [...(complaint.timeline || [])].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/admin/complaints" className="mb-4 inline-block text-sm font-medium text-primary hover:underline">
        ← Back to All Complaints
      </Link>

      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">{complaint.title}</h1>
            <p className="mt-1 text-sm text-text-secondary">
              Submitted {new Date(complaint.createdAt).toLocaleDateString()}
            </p>
          </div>
          <StatusBadge status={complaint.status} />
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 border-t border-border pt-4 sm:grid-cols-3">
          <DetailRow label="Category" value={complaint.category} />
          <DetailRow label="Location" value={complaint.location} />
          <DetailRow label="Student" value={complaint.studentId?.name} />
          <DetailRow label="Student Email" value={complaint.studentId?.email} />
          <DetailRow label="Current Priority" value={complaint.priority} />
          <DetailRow label="Assigned To" value={complaint.assignedTo?.name || 'Unassigned'} />
        </div>

        <div className="mb-6">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-secondary">Description</p>
          <p className="text-sm leading-relaxed text-text-primary">{complaint.description}</p>
        </div>

        {complaint.image && (
          <div className="mb-6">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-secondary">Photo</p>
            <img src={complaint.image} alt="Complaint" className="h-56 w-56 rounded-lg border border-border object-cover" />
          </div>
        )}

        {complaint.completionImage && (
          <div className="mb-6">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-secondary">Completion Photo</p>
            <img src={complaint.completionImage} alt="Completion" className="h-56 w-56 rounded-lg border border-border object-cover" />
          </div>
        )}

        {complaint.staffNotes && (
          <div className="mb-6">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-secondary">Staff Notes</p>
            <p className="text-sm leading-relaxed text-text-primary">{complaint.staffNotes}</p>
          </div>
        )}

        {/* Assign panel */}
        <div className="mb-6 rounded-lg border border-border bg-background p-4">
          <p className="mb-3 text-sm font-medium text-text-primary">Assign to Staff</p>

          {assignMessage && (
            <div className="mb-3 rounded-lg bg-success/10 px-3 py-2 text-sm text-success">{assignMessage}</div>
          )}
          {assignError && (
            <div className="mb-3 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{assignError}</div>
          )}

          <div className="flex flex-wrap gap-3">
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="flex-1 min-w-[200px] rounded-lg border border-border px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select staff member</option>
              {staffList.map((staff) => (
                <option key={staff._id} value={staff._id}>
                  {staff.name} {staff.department ? `(${staff.department})` : ''}
                </option>
              ))}
            </select>
            <button
              onClick={handleAssign}
              disabled={assignSaving}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark disabled:opacity-60"
            >
              {assignSaving ? 'Assigning...' : 'Assign'}
            </button>
          </div>
        </div>

        {/* Priority panel */}
        <div className="mb-6 rounded-lg border border-border bg-background p-4">
          <p className="mb-3 text-sm font-medium text-text-primary">Set Priority</p>

          {priorityMessage && (
            <div className="mb-3 rounded-lg bg-success/10 px-3 py-2 text-sm text-success">{priorityMessage}</div>
          )}
          {priorityError && (
            <div className="mb-3 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{priorityError}</div>
          )}

          <div className="flex flex-wrap gap-3">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="rounded-lg border border-border px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <button
              onClick={handlePriorityChange}
              disabled={prioritySaving}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark disabled:opacity-60"
            >
              {prioritySaving ? 'Saving...' : 'Update Priority'}
            </button>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-text-secondary">Status Timeline</p>
          <ol className="space-y-4 border-l-2 border-border pl-4">
            {sortedTimeline.map((entry, index) => (
              <li key={index} className="relative">
                <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-primary" />
                <p className="text-sm font-medium text-text-primary">{entry.status}</p>
                {entry.note && <p className="text-sm text-text-secondary">{entry.note}</p>}
                <p className="mt-0.5 text-xs text-text-secondary">{new Date(entry.date).toLocaleString()}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-6 border-t border-border pt-4">
          {deleteError && (
            <div className="mb-3 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{deleteError}</div>
          )}
          <button
            onClick={handleDelete}
            className="rounded-lg border border-danger px-4 py-2 text-sm font-medium text-danger transition hover:bg-danger/10"
          >
            Delete Complaint
          </button>
        </div>
      </div>
    </div>
  );
}

export default ComplaintDetails;