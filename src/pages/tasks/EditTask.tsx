// src/pages/tasks/EditTask.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL, TASK_PRIORITIES, TASK_STATUSES } from '../../config/constants';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [clientId, setClientId] = useState('');
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskRes, clientsRes] = await Promise.all([
          axios.get(`${API_URL}/tasks/${id}`),
          axios.get(`${API_URL}/clients`)
        ]);

        const task = taskRes.data;
        setTitle(task.title);
        setDescription(task.description);
        setStatus(task.status);
        setPriority(task.priority);
        setDueDate(task.dueDate.slice(0, 10));
        setClientId(task.client.id);
        setClients(clientsRes.data);
      } catch (err) {
        console.error('Failed to load task or clients', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleUpdate = async () => {
    setSubmitting(true);
    try {
      await axios.put(`${API_URL}/tasks/${id}`, {
        title,
        description,
        status,
        priority,
        dueDate,
        clientId,
      });
      navigate('/tasks');
    } catch (err) {
      console.error('Failed to update task', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm('Are you sure you want to delete this task?');
    if (!confirm) return;
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      navigate('/tasks');
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Edit Task</h1>

      <div className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="input w-full"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="textarea w-full"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="select w-full"
        >
          {TASK_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="select w-full"
        >
          {TASK_PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="input w-full"
        />

        <select
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          className="select w-full"
        >
          <option value="">Select Client</option>
          {clients.map((c: any) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={handleDelete}
          className="btn btn-danger"
        >
          Delete Task
        </button>
        <button
          onClick={handleUpdate}
          disabled={submitting}
          className="btn btn-primary"
        >
          {submitting ? 'Updating...' : 'Update Task'}
        </button>
      </div>
    </div>
  );
};

export default EditTask;
