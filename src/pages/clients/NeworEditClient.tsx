import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL, DEFAULT_CLIENT_TAGS } from '../../config/constants';

interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  notes: string;
  tags: string[];
}

const NewOrEditClient = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    notes: '',
    tags: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      axios
        .get(`${API_URL}/clients/${id}`)
        .then((res) => setFormData(res.data))
        .catch(() => setError('Failed to load client data.'))
        .finally(() => setLoading(false));
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.name.trim()) {
      setError('Name is required.');
      setLoading(false);
      return;
    }

    try {
      if (isEditMode) {
        await axios.put(`${API_URL}/clients/${id}`, formData);
      } else {
        await axios.post(`${API_URL}/clients`, formData);
      }
      navigate('/clients');
    } catch (err) {
      console.error(err);
      setError('Failed to save client.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        {isEditMode ? 'Edit Client' : 'New Client'}
      </h1>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-300 text-red-800 rounded p-3 dark:bg-red-900/30 dark:text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="input"
          required
        />
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="input"
        />
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="input"
        />
        <input
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="Company"
          className="input"
        />
        <input
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className="input"
        />
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Notes"
          className="input"
        />

        <div>
          <p className="font-medium mb-2">Tags</p>
          <div className="flex flex-wrap gap-2">
            {DEFAULT_CLIENT_TAGS.map((tag) => (
              <button
                type="button"
                key={tag.value}
                onClick={() => toggleTag(tag.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  formData.tags.includes(tag.value)
                    ? `${tag.color} ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 ring-primary-500`
                    : `bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600`
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : isEditMode ? 'Update Client' : 'Create Client'}
        </button>
      </form>
    </div>
  );
};

export default NewOrEditClient;
