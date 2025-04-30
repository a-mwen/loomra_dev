// API URL
export const API_URL = 'http://localhost:5000/api';

// Task priorities
export const TASK_PRIORITIES = [
  { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
  { value: 'medium', label: 'Medium', color: 'bg-warning-100 text-warning-800' },
  { value: 'high', label: 'High', color: 'bg-error-100 text-error-800' }
];

// Task statuses
export const TASK_STATUSES = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' }
];

// Meeting types
export const MEETING_TYPES = [
  { value: 'in_person', label: 'In Person' },
  { value: 'video', label: 'Video Call' },
  { value: 'phone', label: 'Phone Call' }
];

// User roles
export const USER_ROLES = [
  { value: 'hr', label: 'HR Professional' },
  { value: 'insurance', label: 'Insurance Agent' },
  { value: 'admin', label: 'Administrator' }
];

// Default client tags
export const DEFAULT_CLIENT_TAGS = [
  { value: 'prospect', label: 'Prospect', color: 'bg-primary-100 text-primary-800' },
  { value: 'active', label: 'Active', color: 'bg-success-100 text-success-800' },
  { value: 'inactive', label: 'Inactive', color: 'bg-gray-100 text-gray-800' },
  { value: 'vip', label: 'VIP', color: 'bg-accent-100 text-accent-800' }
];