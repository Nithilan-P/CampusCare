import { useEffect, useState } from 'react';
import { getUsers, updateUser, deleteUser } from '../../api/users';

function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', department: '', phone: '' });
  const [actionMessage, setActionMessage] = useState('');
  const [actionError, setActionError] = useState('');

  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getUsers({ role: 'student' });
      setStudents(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const startEdit = (student) => {
    setEditingId(student._id);
    setEditForm({
      name: student.name || '',
      department: student.department || '',
      phone: student.phone || '',
    });
    setActionMessage('');
    setActionError('');
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id) => {
    setActionError('');
    setActionMessage('');
    try {
      const res = await updateUser(id, editForm);
      setStudents((prev) => prev.map((s) => (s._id === id ? res.data.data : s)));
      setActionMessage('Student updated successfully');
      setEditingId(null);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to update student');
    }
  };

  const toggleActive = async (student) => {
    setActionError('');
    setActionMessage('');
    try {
      if (student.isActive) {
        await deleteUser(student._id);
        setStudents((prev) =>
          prev.map((s) => (s._id === student._id ? { ...s, isActive: false } : s))
        );
        setActionMessage('Student disabled successfully');
      } else {
        const res = await updateUser(student._id, { isActive: true });
        setStudents((prev) => prev.map((s) => (s._id === student._id ? res.data.data : s)));
        setActionMessage('Student re-enabled successfully');
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to update student status');
    }
  };

  const filteredStudents = students.filter((s) =>
    search ? s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-text-primary">Manage Students</h1>
        <p className="text-sm text-text-secondary">View, edit, and manage student accounts.</p>
      </div>

      <div className="mb-4 rounded-xl border border-border bg-surface p-4 shadow-sm">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-lg border border-border px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {actionMessage && (
        <div className="mb-4 rounded-lg bg-success/10 px-4 py-3 text-sm text-success">{actionMessage}</div>
      )}
      {actionError && (
        <div className="mb-4 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">{actionError}</div>
      )}
      {error && (
        <div className="mb-4 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>
      )}

      <div className="overflow-x-auto rounded-xl border border-border bg-surface shadow-sm">
        {loading ? (
          <p className="p-6 text-sm text-text-secondary">Loading...</p>
        ) : filteredStudents.length === 0 ? (
          <p className="p-6 text-sm text-text-secondary">No students found.</p>
        ) : (
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-border bg-background">
              <tr>
                <th className="px-4 py-3 font-medium text-text-secondary">Name</th>
                <th className="px-4 py-3 font-medium text-text-secondary">Email</th>
                <th className="px-4 py-3 font-medium text-text-secondary">Department</th>
                <th className="px-4 py-3 font-medium text-text-secondary">Roll No.</th>
                <th className="px-4 py-3 font-medium text-text-secondary">Status</th>
                <th className="px-4 py-3 font-medium text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student._id} className="border-b border-border last:border-0">
                  {editingId === student._id ? (
                    <>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full rounded-lg border border-border px-2 py-1 text-sm"
                        />
                      </td>
                      <td className="px-4 py-3 text-text-secondary">{student.email}</td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={editForm.department}
                          onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                          className="w-full rounded-lg border border-border px-2 py-1 text-sm"
                        />
                      </td>
                      <td className="px-4 py-3 text-text-secondary">{student.rollNumber || '—'}</td>
                      <td className="px-4 py-3 text-text-secondary">
                        {student.isActive ? 'Active' : 'Disabled'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdit(student._id)}
                            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-dark"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-background"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 font-medium text-text-primary">{student.name}</td>
                      <td className="px-4 py-3 text-text-secondary">{student.email}</td>
                      <td className="px-4 py-3 text-text-secondary">{student.department || '—'}</td>
                      <td className="px-4 py-3 text-text-secondary">{student.rollNumber || '—'}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            student.isActive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                          }`}
                        >
                          {student.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(student)}
                            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-background"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => toggleActive(student)}
                            className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${
                              student.isActive
                                ? 'border-danger text-danger hover:bg-danger/10'
                                : 'border-success text-success hover:bg-success/10'
                            }`}
                          >
                            {student.isActive ? 'Disable' : 'Enable'}
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ManageStudents; 