import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, CheckSquare, Edit, FileText, MoreHorizontal, Plus, Trash2, Users } from 'lucide-react';
import axios from 'axios';
import { API_URL, DEFAULT_CLIENT_TAGS } from '../../config/constants';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  tags: string[];
  notes: string;
  address: string;
  createdAt: string;
  customFields: { [key: string]: string };
}

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string;
}

interface Meeting {
  id: string;
  title: string;
  date: string;
  type: string;
}

const ClientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [client, setClient] = useState<Client | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        // In a real application, these would be separate API calls
        const [clientRes, tasksRes, meetingsRes] = await Promise.all([
          axios.get(`${API_URL}/clients/${id}`),
          axios.get(`${API_URL}/clients/${id}/tasks`),
          axios.get(`${API_URL}/clients/${id}/meetings`)
        ]);
        
        setClient(clientRes.data);
        setTasks(tasksRes.data);
        setMeetings(meetingsRes.data);
      } catch (error) {
        console.error('Failed to fetch client data', error);
        // For demo purposes, set some dummy data
        setClient({
          id: id || '1',
          name: 'Acme Corporation',
          email: 'contact@acme.com',
          phone: '(555) 123-4567',
          company: 'Acme Corp',
          address: '123 Business Ave, Suite 400, San Francisco, CA 94107',
          tags: ['active', 'vip'],
          notes: 'Acme is a long-term client interested in expanded insurance coverage for their new product line launching in Q3.',
          createdAt: '2025-03-15T10:00:00Z',
          customFields: {
            'Industry': 'Technology',
            'Size': 'Enterprise',
            'Annual Revenue': '$10M+'
          }
        });
        
        setTasks([
          {
            id: '1',
            title: 'Review insurance policy renewal',
            status: 'todo',
            priority: 'high',
            dueDate: '2025-05-15T00:00:00Z'
          },
          {
            id: '2',
            title: 'Send follow-up email about new benefits package',
            status: 'in_progress',
            priority: 'medium',
            dueDate: '2025-05-10T00:00:00Z'
          }
        ]);
        
        setMeetings([
          {
            id: '1',
            title: 'Quarterly Review Meeting',
            date: '2025-05-20T14:00:00Z',
            type: 'video'
          },
          {
            id: '2',
            title: 'Policy Discussion',
            date: '2025-05-12T11:00:00Z',
            type: 'in_person'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchClientData();
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  const getTagColor = (tag: string) => {
    const foundTag = DEFAULT_CLIENT_TAGS.find(t => t.value === tag);
    return foundTag ? foundTag.color : 'bg-gray-100 text-gray-800';
  };

  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return (
          <div className="p-2 rounded-full bg-accent-50 dark:bg-accent-900/20">
            <svg className="h-4 w-4 text-accent-600 dark:text-accent-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case 'in_person':
        return (
          <div className="p-2 rounded-full bg-primary-50 dark:bg-primary-900/20">
            <svg className="h-4 w-4 text-primary-600 dark:text-primary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        );
      case 'phone':
        return (
          <div className="p-2 rounded-full bg-secondary-50 dark:bg-secondary-900/20">
            <svg className="h-4 w-4 text-secondary-600 dark:text-secondary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
            <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </div>
        );
    }
  };

  const getTaskPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-300';
      case 'medium':
        return 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300';
      case 'low':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300';
      case 'in_progress':
        return 'bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-300';
      case 'todo':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Client not found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">The client you're looking for doesn't exist or has been removed.</p>
        <Link to="/clients" className="btn btn-primary inline-flex items-center">
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to Clients
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center">
          <Link to="/clients" className="mr-4 p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{client.name}</h1>
            <p className="text-gray-600 dark:text-gray-400">{client.company}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Link to={`/clients/${id}/edit`} className="btn btn-outline inline-flex items-center">
            <Edit className="mr-1.5 h-4 w-4" />
            Edit
          </Link>
          
          <div className="relative">
            <button
              onClick={() => setShowOptionsMenu(!showOptionsMenu)}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
            
            {showOptionsMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10 animate-fade-in">
                <div className="py-1">
                  <button
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      setShowOptionsMenu(false);
                      // Add export functionality
                    }}
                  >
                    <FileText className="inline-block mr-2 h-4 w-4" />
                    Export Details
                  </button>
                  <button
                    className="w-full text-left block px-4 py-2 text-sm text-error-600 dark:text-error-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      setShowOptionsMenu(false);
                      // Add delete functionality with confirmation
                      if (window.confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
                        // Delete client
                        navigate('/clients');
                      }
                    }}
                  >
                    <Trash2 className="inline-block mr-2 h-4 w-4" />
                    Delete Client
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`
              py-4 text-sm font-medium border-b-2 transition-colors
              ${activeTab === 'overview'
                ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'}
            `}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`
              py-4 text-sm font-medium border-b-2 transition-colors
              ${activeTab === 'tasks'
                ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'}
            `}
          >
            Tasks
          </button>
          <button
            onClick={() => setActiveTab('meetings')}
            className={`
              py-4 text-sm font-medium border-b-2 transition-colors
              ${activeTab === 'meetings'
                ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'}
            `}
          >
            Meetings
          </button>
        </nav>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                  <p className="mt-1 text-gray-900 dark:text-white">{client.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="mt-1 text-gray-900 dark:text-white">{client.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Company</p>
                  <p className="mt-1 text-gray-900 dark:text-white">{client.company}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</p>
                  <p className="mt-1 text-gray-900 dark:text-white">{client.address}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tags</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {client.tags.map((tag) => (
                      <span key={tag} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTagColor(tag)}`}>
                        {DEFAULT_CLIENT_TAGS.find(t => t.value === tag)?.label || tag}
                      </span>
                    ))}
                    <button className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
                      <Plus className="mr-0.5 h-3 w-3" />
                      Add Tag
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Notes</h2>
                <button className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
                  Edit
                </button>
              </div>
              <div className="prose max-w-none dark:prose-invert prose-p:text-gray-600 dark:prose-p:text-gray-400">
                <p>{client.notes || 'No notes added yet.'}</p>
              </div>
            </div>
            
            {/* Custom Fields */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Custom Fields</h2>
                <button className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center">
                  <Plus className="mr-1 h-4 w-4" />
                  Add Field
                </button>
              </div>
              {Object.keys(client.customFields).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(client.customFields).map(([key, value]) => (
                    <div key={key} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{key}</p>
                      <p className="mt-1 text-gray-900 dark:text-white">{value}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 dark:text-gray-400">No custom fields added yet.</p>
                  <button className="mt-2 btn btn-outline inline-flex items-center">
                    <Plus className="mr-1.5 h-4 w-4" />
                    Add First Field
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Side information */}
          <div className="space-y-6">
            {/* Client summary card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">{client.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Client since {formatDate(client.createdAt)}</p>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <div className="flex justify-between py-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Open Tasks</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{tasks.filter(t => t.status !== 'done').length}</p>
                </div>
                <div className="flex justify-between py-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Upcoming Meetings</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{meetings.length}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to={`/tasks/new?client=${id}`}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 border border-gray-200 dark:border-gray-700"
                >
                  <div className="p-2 bg-secondary-50 dark:bg-secondary-900/20 rounded-md">
                    <CheckSquare className="h-4 w-4 text-secondary-600 dark:text-secondary-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Create Task</p>
                  </div>
                </Link>
                <Link
                  to={`/meetings/new?client=${id}`}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 border border-gray-200 dark:border-gray-700"
                >
                  <div className="p-2 bg-accent-50 dark:bg-accent-900/20 rounded-md">
                    <Calendar className="h-4 w-4 text-accent-600 dark:text-accent-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Schedule Meeting</p>
                  </div>
                </Link>
                <Link
  to={`/notes?client=${id}`}
  className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 border border-gray-200 dark:border-gray-700"
>
  <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-md">
    <FileText className="h-4 w-4 text-primary-600 dark:text-primary-400" />
  </div>
  <div className="ml-3">
    <p className="text-sm font-medium text-gray-900 dark:text-white">Add Note</p>
  </div>
</Link>

              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <div className="flex justify-between">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Tasks</h2>
            <Link
              to={`/tasks/new?client=${id}`}
              className="btn btn-primary inline-flex items-center"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Create Task
            </Link>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            {tasks.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Task
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Priority
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {tasks.map((task) => (
                      <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {task.title}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTaskStatusColor(task.status)}`}>
                            {task.status === 'todo' && 'To Do'}
                            {task.status === 'in_progress' && 'In Progress'}
                            {task.status === 'done' && 'Completed'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTaskPriorityColor(task.priority)}`}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(task.dueDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link 
                            to={`/tasks/${task.id}`} 
                            className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No tasks yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Create your first task for this client
                </p>
                <Link
                  to={`/tasks/new?client=${id}`}
                  className="btn btn-primary inline-flex items-center"
                >
                  <Plus className="mr-1.5 h-4 w-4" />
                  Create Task
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'meetings' && (
        <div className="space-y-6">
          <div className="flex justify-between">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Meetings</h2>
            <Link
              to={`/meetings/new?client=${id}`}
              className="btn btn-primary inline-flex items-center"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Schedule Meeting
            </Link>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            {meetings.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {meetings.map((meeting) => (
                  <div key={meeting.id} className="flex items-start p-6 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <div className="flex-shrink-0 mr-4">
                      {getMeetingTypeIcon(meeting.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link to={`/meetings/${meeting.id}`} className="text-lg font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400">
                        {meeting.title}
                      </Link>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{formatDateTime(meeting.date)}</p>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        {meeting.type === 'video' && 'Video Call'}
                        {meeting.type === 'in_person' && 'In Person Meeting'}
                        {meeting.type === 'phone' && 'Phone Call'}
                      </p>
                    </div>
                    <div className="ml-4">
                      <Link 
                        to={`/meetings/${meeting.id}`} 
                        className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No meetings scheduled</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Schedule your first meeting with this client
                </p>
                <Link
                  to={`/meetings/new?client=${id}`}
                  className="btn btn-primary inline-flex items-center"
                >
                  <Plus className="mr-1.5 h-4 w-4" />
                  Schedule Meeting
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDetails;