export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'agent';
  createdAt: string;
  updatedAt: string;
  settings?: UserSettings;
}

export interface UserSettings {
  id: string;
  userId: string;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    app: boolean;
    taskReminders: boolean;
    meetingReminders: boolean;
  };
  dashboardLayout?: {
    widgets: string[];
    layout: 'grid' | 'list';
  };
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  status: 'active' | 'inactive' | 'lead';
  tags: string[];
  notes?: string;
  customFields?: Record<string, string>;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  clientId?: string;
  assigneeId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  isVirtual: boolean;
  meetingLink?: string;
  notes?: string;
  aiSummary?: string;
  clientId?: string;
  attendees: string[]; // User IDs
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  content: string;
  clientId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'checkbox';
  options?: string[]; // For select and multiselect types
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: 'task' | 'meeting' | 'client' | 'system';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  userId: string;
  createdAt: string;
}

export interface DashboardStats {
  totalClients: number;
  activeClients: number;
  tasksByStatus: {
    todo: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  };
  upcomingMeetings: number;
  recentActivity: {
    type: 'client' | 'task' | 'meeting' | 'note';
    action: 'created' | 'updated' | 'deleted';
    entityId: string;
    entityName: string;
    date: string;
    userId: string;
    userName: string;
  }[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}