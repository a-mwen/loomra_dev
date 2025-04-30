import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, Plus, Search, SlidersHorizontal } from 'lucide-react';
import axios from 'axios';
import { API_URL, TASK_PRIORITIES, TASK_STATUSES } from '../../config/constants';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  client: {
    id: string;
    name: string;
  };
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API_URL}/tasks`);
        setTasks(response.data);
      } catch (error) {
        console.error('Failed to fetch tasks', error);
        // For demo purposes, set some dummy data
        setTasks([
          {
            id: '1',
            title: 'Review policy renewal for Acme Corp',
            description: 'Review the details of the policy renewal and prepare recommendations for better coverage.',
            status: 'todo',
            priority: 'high',
            dueDate: '2025-05-15T00:00:00Z',
            client: {
              id: '1',
              name: 'Acme Corporation'
            }
          },
          {
            id: '2',
            title: 'Schedule quarterly review meeting with Globex',
            description: 'Prepare presentation and schedule the quarterly review meeting to discuss performance and future goals.',
            status: 'in_progress',
            priority: 'medium',
            dueDate: '2025-05-10T00:00:00Z',
            client: {
              id: '2',
              name: 'Globex Industries'
            }
          },
          {
            id: '3',
            title: 'Send follow-up email to Stark Enterprises',
            description: 'Follow up on the last meeting and provide additional information requested.',
            status: 'done',
            priority: 'low',
            dueDate: '2025-05-05T00:00:00Z',
            client: {
              id: '3',
              name: 'Stark Enterprises'
            }
          },
          {
            id: '4',
            title: 'Update client information for Wayne Industries',
            description: 'Update the contact information and address for Wayne Industries in the database.',
            status: 'todo',
            priority: 'medium',
            dueDate: '2025-05-20T00:00:00Z',
            client: {
              id: '4',
              name: 'Wayne Industries'
            }
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev => 
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const togglePriority = (priority: string) => {
    setSelectedPriorities(prev => 
      prev.includes(priority)
        ? prev.filter(p => p !== priority)
        : [...prev, priority]
    );
  };

  const filterTasks = () => {
    let filtered = tasks;
    
    // Filter by search term
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTermLower) ||
        task.description.toLowerCase().includes(searchTermLower) ||
        task.client.name.toLowerCase().includes(searchTermLower)
      );
    }
    
    // Filter by selected statuses
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter(task => selectedStatuses.includes(task.status));
    }
    
    // Filter by selected priorities
    if (selectedPriorities.length > 0) {
      filtered = filtered.filter(task => selectedPriorities.includes(task.priority));
    }
    
    return filtered;
  };

  const getStatusLabel = (status: string) => {
    const foundStatus = TASK_STATUSES.find(s => s.value === status);
    return foundStatus ? foundStatus.label : status;
  };

  const getPriorityLabel = (priority: string) => {
    const foundPriority = TASK_PRIORITIES.find(p => p.value === priority);
    return foundPriority ? foundPriority.label : priority;
  };

  const getPriorityColor = (priority: string) => {
    const foundPriority = TASK_PRIORITIES.find(p => p.value === priority);
    return foundPriority ? foundPriority.color : 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredTasks = filterTasks();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks</h1>
        <div className="flex space-x-2">
          <Link to="/tasks/new" className="btn btn-primary flex items-center">
            <Plus className="mr-1.5 h-4 w-4" />
            Add Task
          </Link>
        </div>
      </div>

      {/* Search and filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button 
            className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="mr-1.5 h-4 w-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</p>
              <div className="flex flex-wrap gap-2">
                {TASK_STATUSES.map((status) => (
                  <button
                    key={status.value}
                    onClick={() => toggleStatus(status.value)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      selectedStatuses.includes(status.value)
                        ? `${getStatusColor(status.value)} ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-primary-500`
                        : `bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600`
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority</p>
              <div className="flex flex-wrap gap-2">
                {TASK_PRIORITIES.map((priority) => (
                  <button
                    key={priority.value}
                    onClick={() => togglePriority(priority.value)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      selectedPriorities.includes(priority.value)
                        ? `${priority.color} ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-primary-500`
                        : `bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600`
                    }`}
                  >
                    {priority.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Task list */}
      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div 
              key={task.id} 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`mt-0.5 p-1.5 rounded-md ${
                    task.status === 'done' 
                      ? 'bg-success-100 dark:bg-success-900/30' 
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    <CheckSquare className={`h-5 w-5 ${
                      task.status === 'done' 
                        ? 'text-success-600 dark:text-success-400' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <Link 
                      to={`/tasks/${task.id}`} 
                      className="text-lg font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      {task.title}
                    </Link>
                    <div className="flex items-center mt-1 space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {getStatusLabel(task.status)}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {getPriorityLabel(task.priority)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Due {formatDate(task.dueDate)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {task.description}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <Link to={`/clients/${task.client.id}`}>
                    {task.client.name}
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
            <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No tasks found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm || selectedStatuses.length > 0 || selectedPriorities.length > 0
                ? "No tasks match your search criteria. Try adjusting your filters."
                : "You haven't created any tasks yet. Add your first task to get started."}
            </p>
            {!(searchTerm || selectedStatuses.length > 0 || selectedPriorities.length > 0) && (
              <Link to="/tasks/new" className="btn btn-primary inline-flex items-center">
                <Plus className="mr-1.5 h-4 w-4" />
                Add Task
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;