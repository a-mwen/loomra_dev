// src/pages/meetings/NewMeeting.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL, MEETING_TYPES } from '../../config/constants';

interface Client {
  id: string;
  name: string;
}

const NewMeeting = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    type: '',
    location: '',
    clientId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get(`${API_URL}/clients`);
        setClients(res.data);

        const prefillClientId = searchParams.get('client');
        if (prefillClientId) {
          setFormData((prev) => ({ ...prev, clientId: prefillClientId }));
        }
      } catch {
        console.error('Failed to fetch clients');
      }
    };
    fetchClients();
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API_URL}/meetings`, {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        type: formData.type,
        location: formData.location,
        clientId: formData.clientId
      });
      navigate('/meetings');
    } catch{
      setError('Failed to schedule meeting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Schedule New Meeting</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="input" required />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="input" />
        <input name="date" type="datetime-local" value={formData.date} onChange={handleChange} className="input" required />
        <input name="location" value={formData.location} onChange={handleChange} placeholder="Location or Link" className="input" />

        <select name="type" value={formData.type} onChange={handleChange} className="select" required>
          <option value="">Select Type</option>
          {MEETING_TYPES.map((type) => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>

        <select name="clientId" value={formData.clientId} onChange={handleChange} className="select" required>
          <option value="">Select Client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>{client.name}</option>
          ))}
        </select>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Scheduling...' : 'Schedule Meeting'}
        </button>
      </form>
    </div>
  );
};

export default NewMeeting;
