import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { createComplaint } from '../../api/complaints';

const CATEGORIES = ['Electrical', 'Plumbing', 'Furniture', 'Internet', 'Cleaning', 'Others'];
const PRIORITIES = ['Low', 'Medium', 'High'];

const complaintSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().min(1, 'Description is required'),
  category: z.enum(CATEGORIES, { errorMap: () => ({ message: 'Please select a category' }) }),
  location: z.string().trim().min(1, 'Location is required'),
  priority: z.enum(PRIORITIES),
});

function NewComplaint() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(complaintSchema),
    defaultValues: { priority: 'Medium' },
  });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setServerError('Only image files are allowed');
      return;
    }

    setServerError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const onSubmit = async (formData) => {
    setServerError('');
    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('description', formData.description);
      payload.append('category', formData.category);
      payload.append('location', formData.location);
      payload.append('priority', formData.priority);
      if (imageFile) {
        payload.append('image', imageFile);
      }

      const res = await createComplaint(payload);
      navigate(`/student/complaints/${res.data.data._id}`, { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to submit complaint');
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 text-2xl font-semibold text-text-primary">New Complaint</h1>
      <p className="mb-6 text-sm text-text-secondary">
        Report an issue and we'll route it to the right staff member.
      </p>

      {serverError && (
        <div className="mb-4 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">
          {serverError}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 rounded-xl border border-border bg-surface p-6 shadow-sm"
      >
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium text-text-primary">
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="e.g. Flickering lights in Room 204"
            {...register('title')}
            className="w-full rounded-lg border border-border px-3 py-2 text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {errors.title && <p className="mt-1 text-sm text-danger">{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium text-text-primary">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            placeholder="Describe the issue in detail"
            {...register('description')}
            className="w-full rounded-lg border border-border px-3 py-2 text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-danger">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="mb-1 block text-sm font-medium text-text-primary">
              Category
            </label>
            <select
              id="category"
              {...register('category')}
              defaultValue=""
              className="w-full rounded-lg border border-border px-3 py-2 text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="" disabled>
                Select category
              </option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-danger">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="priority" className="mb-1 block text-sm font-medium text-text-primary">
              Priority
            </label>
            <select
              id="priority"
              {...register('priority')}
              className="w-full rounded-lg border border-border px-3 py-2 text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="location" className="mb-1 block text-sm font-medium text-text-primary">
            Location
          </label>
          <input
            id="location"
            type="text"
            placeholder="e.g. Block B, Room 204"
            {...register('location')}
            className="w-full rounded-lg border border-border px-3 py-2 text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-danger">{errors.location.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="image" className="mb-1 block text-sm font-medium text-text-primary">
            Photo <span className="text-text-secondary">(optional)</span>
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text-primary file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-3 h-40 w-40 rounded-lg border border-border object-cover"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-primary py-2 font-medium text-white transition hover:bg-primary-dark disabled:opacity-60"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>
    </div>
  );
}

export default NewComplaint;