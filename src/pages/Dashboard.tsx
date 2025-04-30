import React from 'react';
import { 
  Users, 
  CheckSquare, 
  Calendar, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatNumberWithCommas } from '../utils/formatters';
import { getTimeFromNow } from '../utils/dateUtils';

// Mock data for dashboard
const stats = {
  totalClients: 128,
  activeClients: 94,
  tasksByStatus: {
    todo: 18,
    inProgress: 7,
    completed: 35,
    cancelled: 3
  },
  upcomingMeetings: 12
};

const recentActivity = [
  { 
    id: '1', 
    type: 'client', 
    action: 'created', 
    entityName: 'John Smith', 
    date: '2023-06-15T10:30:00Z',
    userName: 'Alex Wilson'
  },
  { 
    id: '2', 
    type: 'task', 
    action: 'updated', 
    entityName: 'Review insurance policy', 
    date: '2023-06-15T09:15:00Z',
    userName: 'Sarah Johnson'
  },
  { 
    id: '3', 
    type: 'meeting', 
    action: 'created', 
    entityName: 'Quarterly Review', 
    date: '2023-06-14T16:45:00Z',
    userName: 'Alex Wilson'
  },
  { 
    id: '4', 
    type: 'note', 
    action: 'created', 
    entityName: 'Follow-up notes', 
    date: '2023-06-14T14:20:00Z',
    userName: 'Maria Garcia'
  },
  { 
    id: '5', 
    type: 'client', 
    action: 'updated', 
    entityName: 'Acme Corporation', 
    date: '2023-06-14T11:10:00Z',
    userName: 'Alex Wilson'
  }
];

// Mock upcoming tasks
const upcomingTasks = [
  {
    id: '1',
    title: 'Call James about health insurance',
    priority: 'high',
    dueDate: '2023-06-16T10:00:00Z',
    client: 'James Brown'
  },
  {
    id: '2',
    title: 'Send policy documents to new clients',
    priority: 'medium',
    dueDate: '2023-06-16T14:00:00Z',
    client: 'Acme Corp'
  },
  {
    id: '3',
    title: 'Review renewals for July',
    priority: 'medium',
    dueDate: '2023-06-17T09:00:00Z',
    client: null
  },
  {
    id: '4',
    title: 'Update client presentation',
    priority: 'low',
    dueDate: '2023-06-20T11:00:00Z',
    client: 'Tech Solutions Inc'
  }
];

// Mock upcoming meetings
const upcomingMeetings = [
  {
    id: '1',
    title: 'Policy Review Meeting',
    date: '2023-06-16T13:00:00Z',
    client: 'John Smith',
    isVirtual: true
  },
  {
    id: '2',
    title: 'New Client Onboarding',
    date: '2023-06-17T10:30:00Z',
    client: 'Sarah Johnson',
    isVirtual: false
  },
  {
    id: '3',
    title: 'Quarterly Team Meeting',
    date: '2023-06-19T09:00:00Z',
    client: null,
    isVirtual: true
  }
];

const DashboardCard: React.FC<{
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: number;
  change?: string;
  className?: string;
}> = ({ title, value, icon, trend, change, className = '' }) => {
  return (
    <Card className={`shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{value}</h3>
          
          {trend !== undefined && (
            <div className="mt-1 flex items-center">
              {trend > 0 ? (
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <ArrowUpRight size={16} className="mr-1" />
                  <span className="text-xs font-medium">{trend}% {change}</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600 dark:text-red-400">
                  <ArrowDownRight size={16} className="mr-1" />
                  <span className="text-xs font-medium">{Math.abs(trend)}% {change}</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="p-2 rounded-md bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
          {icon}
        </div>
      </div>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.firstName || 'User'}!
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Here's what's happening with your clients and tasks today.
          </p>
        </div>
        <div className="flex space-x-3">
          <Link to="/clients/new">
            <Button variant="primary" leftIcon={<Users size={16} />}>
              Add Client
            </Button>
          </Link>
          <Link to="/tasks/new">
            <Button variant="outline" leftIcon={<CheckSquare size={16} />}>
              New Task
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard 
          title="Total Clients"
          value={formatNumberWithCommas(stats.totalClients)}
          icon={<Users size={20} />}
          trend={12}
          change="this month"
        />
        <DashboardCard 
          title="Active Clients"
          value={formatNumberWithCommas(stats.activeClients)}
          icon={<Users size={20} />}
          trend={5}
          change="this month"
        />
        <DashboardCard 
          title="Tasks in Progress"
          value={stats.tasksByStatus.inProgress + stats.tasksByStatus.todo}
          icon={<CheckSquare size={20} />}
          trend={-8}
          change="vs. last week"
        />
        <DashboardCard 
          title="Upcoming Meetings"
          value={stats.upcomingMeetings}
          icon={<Calendar size={20} />}
          trend={15}
          change="vs. last week"
        />
      </div>
      
      {/* Tasks and Meetings section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upcoming tasks */}
        <Card
          title="Upcoming Tasks"
          headerAction={
            <Link to="/tasks">
              <Button variant="ghost" size="sm">
                View all
              </Button>
            </Link>
          }
        >
          <div className="space-y-4">
            {upcomingTasks.map(task => (
              <div key={task.id} className="flex items-start space-x-3 p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <div className="flex-shrink-0 mt-0.5">
                  {task.priority === 'high' ? (
                    <AlertCircle size={18} className="text-red-500" />
                  ) : task.priority === 'medium' ? (
                    <Clock size={18} className="text-yellow-500" />
                  ) : (
                    <CheckSquare size={18} className="text-blue-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {task.title}
                    </p>
                    <Badge 
                      size="sm" 
                      variant={
                        task.priority === 'high' ? 'error' :
                        task.priority === 'medium' ? 'warning' : 'info'
                      }
                    >
                      {task.priority}
                    </Badge>
                  </div>
                  <div className="mt-1 flex justify-between items-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Due {getTimeFromNow(task.dueDate)}
                    </div>
                    {task.client && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {task.client}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        {/* Upcoming meetings */}
        <Card
          title="Upcoming Meetings"
          headerAction={
            <Link to="/meetings">
              <Button variant="ghost" size="sm">
                View all
              </Button>
            </Link>
          }
        >
          <div className="space-y-4">
            {upcomingMeetings.map(meeting => (
              <div key={meeting.id} className="flex items-start space-x-3 p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <div className="flex-shrink-0 mt-0.5">
                  <Calendar size={18} className="text-primary-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {meeting.title}
                    </p>
                    <Badge 
                      size="sm" 
                      variant={meeting.isVirtual ? 'info' : 'success'}
                    >
                      {meeting.isVirtual ? 'Virtual' : 'In Person'}
                    </Badge>
                  </div>
                  <div className="mt-1 flex justify-between items-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {getTimeFromNow(meeting.date)}
                    </div>
                    {meeting.client && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {meeting.client}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      
      {/* Recent activity */}
      <Card title="Recent Activity">
        <div className="flow-root">
          <ul className="-mb-8">
            {recentActivity.map((activity, activityIdx) => (
              <li key={activity.id}>
                <div className="relative pb-8">
                  {activityIdx !== recentActivity.length - 1 ? (
                    <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
                  ) : null}
                  <div className="relative flex items-start space-x-3">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                        {activity.type === 'client' ? (
                          <Users className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        ) : activity.type === 'task' ? (
                          <CheckSquare className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        ) : activity.type === 'meeting' ? (
                          <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        ) : (
                          <TrendingUp className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        )}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div>
                        <div className="text-sm">
                          <a href="#" className="font-medium text-gray-900 dark:text-white">
                            {activity.userName}
                          </a>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                          {activity.action === 'created' ? 'Created a new' : 'Updated a'} {activity.type}:{' '}
                          <a href="#" className="font-medium text-gray-900 dark:text-white">
                            {activity.entityName}
                          </a>
                        </p>
                      </div>
                      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <p>{getTimeFromNow(activity.date)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6 text-center">
          <Button variant="outline" size="sm">
            View all activity
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;