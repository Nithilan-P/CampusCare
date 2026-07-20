import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getUsers, updateUser, deleteUser, createStaff } from '../../api/users';
import PasswordInput from '../../components/PasswordInput';

const createStaffSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  department: z.string().trim().optional(),
  employeeId: z.string().trim().optional(),
  phone: z.string().trim().optional(),
});

function CreateStaffForm({ onCreated }) {
  const [serverError, setServerError] = useState('');
  const [serverMessage, setServerMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(createStaffSchema) });

  const onSubmit = async (formData) => {
    setServerError('');
    setServerMessage('');
    try {
      const res = await createStaff(formData);
      setServerMessage(res.data.message);
      reset();
      onCreated();
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to create staff account');
    }
  };

  return (
    <div className="mb-6 rounded-xl border border-border bg-surface p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-text-primary">Create Staff Account</h2>

      {serverMessage && (
        <div className="mb-4 rounded-lg bg-success/10 px-4 py-3 text-sm text-success">{serverMessage}</div>
      )}
      {serverError && (
        <div className="mb-4 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">{serverError}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-text-primary">Name</label>
          <input
            type="text"
            {...register('name')}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {errors.name && <p className="mt-1 text-sm text-danger">{errors.name.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text-primary">Email</label>
          <input
            type="email"
            {...register('email')}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {errors.email && <p className="mt-1 text-sm text-danger">{errors.email.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text-primary">Password</label>
          <PasswordInput {...register('password')} />
          {errors.password && <p className="mt-1 text-sm text-danger">{errors.password.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text-primary">Department</label>
          <input
            type="text"
            {...register('department')}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text-primary">Employee ID</label>
          <input
            type="text"
            {...register('employeeId')}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text-primary">Phone</label>
          <input
            type="tel"
            {...register('phone')}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark disabled:opacity-60"
          >
            {isSubmitting ? 'Creating...' : 'Create Staff Account'}
          </button>
        </div>
      </form>
    </div>
  );
}

function ManageStaff() {
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', department: '', phone: '' });
  const [actionMessage, setActionMessage] = useState('');
  const [actionError, setActionError] = useState('');

  const fetchStaff = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getUsers({ role: 'staff' });
      setStaffMembers(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load staff');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const startEdit = (staff) => {
    setEditingId(staff._id);
    setEditForm({
      name: staff.name || '',
      department: staff.department || '',
      phone: staff.phone || '',
    });
    setActionMessage('');
    setActionError('');
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async (id) => {
    setActionError('');
    setActionMessage('');
    try {
      const res = await updateUser(id, editForm);
      setStaffMembers((prev) => prev.map((s) => (s._id === id ? res.data.data : s)));
      setActionMessage('Staff updated successfully');
      setEditingId(null);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to update staff');
    }
  };

  const toggleActive = async (staff) => {
    setActionError('');
    setActionMessage('');
    try {
      if (staff.isActive) {
        await deleteUser(staff._id);
        setStaffMembers((prev) =>
          prev.map((s) => (s._id === staff._id ? { ...s, isActive: false } : s))
        );
        setActionMessage('Staff disabled successfully');
      } else {
        const res = await updateUser(staff._id, { isActive: true });
        setStaffMembers((prev) => prev.map((s) => (s._id === staff._id ? res.data.data : s)));
        setActionMessage('Staff re-enabled successfully');
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to update staff status');
    }
  };

  const filteredStaff = staffMembers.filter((s) =>
    search ? s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-text-primary">Manage Staff</h1>
        <p className="text-sm text-text-secondary">Create and manage staff accounts.</p>
      </div>

      <CreateStaffForm onCreated={fetchStaff} />

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
        ) : filteredStaff.length === 0 ? (
          <p className="p-6 text-sm text-text-secondary">No staff found.</p>
        ) : (
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-border bg-background">
              <tr>
                <th className="px-4 py-3 font-medium text-text-secondary">Name</th>
                <th className="px-4 py-3 font-medium text-text-secondary">Email</th>
                <th className="px-4 py-3 font-medium text-text-secondary">Department</th>
                <th className="px-4 py-3 font-medium text-text-secondary">Employee ID</th>
                <th className="px-4 py-3 font-medium text-text-secondary">Status</th>
                <th className="px-4 py-3 font-medium text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((staff) => (
                <tr key={staff._id} className="border-b border-border last:border-0">
                  {editingId === staff._id ? (
                    <>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full rounded-lg border border-border px-2 py-1 text-sm"
                        />
                      </td>
                      <td className="px-4 py-3 text-text-secondary">{staff.email}</td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={editForm.department}
                          onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                          className="w-full rounded-lg border border-border px-2 py-1 text-sm"
                        />
                      </td>
                      <td className="px-4 py-3 text-text-secondary">{staff.employeeId || '—'}</td>
                      <td className="px-4 py-3 text-text-secondary">
                        {staff.isActive ? 'Active' : 'Disabled'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdit(staff._id)}
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
                      <td className="px-4 py-3 font-medium text-text-primary">{staff.name}</td>
                      <td className="px-4 py-3 text-text-secondary">{staff.email}</td>
                      <td className="px-4 py-3 text-text-secondary">{staff.department || '—'}</td>
                      <td className="px-4 py-3 text-text-secondary">{staff.employeeId || '—'}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            staff.isActive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                          }`}
                        >
                          {staff.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(staff)}
                            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-background"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => toggleActive(staff)}
                            className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${
                              staff.isActive
                                ? 'border-danger text-danger hover:bg-danger/10'
                                : 'border-success text-success hover:bg-success/10'
                            }`}
                          >
                            {staff.isActive ? 'Disable' : 'Enable'}
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

export default ManageStaff;