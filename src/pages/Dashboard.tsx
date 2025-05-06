import { useState, useEffect } from 'react';
import { Calendar, CheckSquare, FileText, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/constants';

interface DashboardStats {
  totalClients: number;
  activeTasks: number;
  upcomingMeetings: number;
  completedTasks: number;
}

interface RecentActivity {
  id: string;
  type: 'client' | 'task' | 'meeting';
  title: string;
  date: string;
  status?: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    activeTasks: 0,
    upcomingMeetings: 0,
    completedTasks: 0
  });
  
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, activityRes] = await Promise.all([
          axios.get(`${API_URL}/dashboard/stats`),
          axios.get(`${API_URL}/dashboard/activity`)
        ]);
        
        setStats(statsRes.data);
        setRecentActivity(activityRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
        // For demo purposes, set some dummy data
        setStats({
          totalClients: 24,
          activeTasks: 8,
          upcomingMeetings: 5,
          completedTasks: 16
        });
        
        setRecentActivity([
          { id: '1', type: 'client', title: 'New client: Acme Corp', date: '2025-04-05T10:30:00Z' },
          { id: '2', type: 'task', title: 'Follow up on insurance claim', date: '2025-04-04T14:00:00Z', status: 'completed' },
          { id: '3', type: 'meeting', title: 'Client onboarding call', date: '2025-04-06T09:00:00Z' },
          { id: '4', type: 'task', title: 'Review policy documents', date: '2025-04-04T11:30:00Z', status: 'in_progress' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'client':
        return <Users className="h-5 w-5 text-primary-500" />;
      case 'task':
        return <CheckSquare className="h-5 w-5 text-secondary-500" />;
      case 'meeting':
        return <Calendar className="h-5 w-5 text-accent-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <div className="flex space-x-2">
          <Link
            to="/clients/new"
            className="btn btn-primary"
          >
            Add Client
          </Link>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-white dark:bg-gray-800">
          <div className="flex items-start">
            <div className="p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20">
              <Users className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Clients</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalClients}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/clients" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
              View all clients →
            </Link>
          </div>
        </div>

        <div className="card bg-white dark:bg-gray-800">
          <div className="flex items-start">
            <div className="p-3 rounded-lg bg-secondary-50 dark:bg-secondary-900/20">
            <CheckSquare key="active-tasks-icon" className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Tasks</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.activeTasks}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/tasks" className="text-sm text-secondary-600 hover:text-secondary-700 dark:text-secondary-400">
              Manage tasks →
            </Link>
          </div>
        </div>

        <div className="card bg-white dark:bg-gray-800">
          <div className="flex items-start">
            <div className="p-3 rounded-lg bg-accent-50 dark:bg-accent-900/20">
              <Calendar className="h-6 w-6 text-accent-600 dark:text-accent-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Upcoming Meetings</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.upcomingMeetings}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/meetings" className="text-sm text-accent-600 hover:text-accent-700 dark:text-accent-400">
              View schedule →
            </Link>
          </div>
        </div>

        <div className="card bg-white dark:bg-gray-800">
          <div className="flex items-start">
            <div className="p-3 rounded-lg bg-success-50 dark:bg-success-900/20">
            <CheckSquare key="completed-tasks-icon" className="h-6 w-6 text-success-600 dark:text-success-400" />            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed Tasks</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.completedTasks}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/tasks?status=done" className="text-sm text-success-600 hover:text-success-700 dark:text-success-400">
              View completed →
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatDate(activity.date)}</p>
                      </div>
                      {activity.status && (
                        <span 
                          className={`text-xs py-1 px-2 rounded-full ${
                            activity.status === 'completed' 
                              ? 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300' 
                              : 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300'
                          }`}
                        >
                          {activity.status === 'completed' ? 'Completed' : 'In Progress'}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
                </div>
              )}
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 px-6 py-3 border-t border-gray-200 dark:border-gray-700">
              <a href="#" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
                View all activity →
              </a>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-4">
              <Link
                to="/clients/new"
                className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
              >
                <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-md">
                  <Users className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Add New Client</p>
                </div>
              </Link>

              <Link
                to="/tasks/new"
                className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
              >
                <div className="p-2 bg-secondary-50 dark:bg-secondary-900/20 rounded-md">
                  <CheckSquare className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Create New Task</p>
                </div>
              </Link>

              <Link
                to="/meetings/new"
                className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
              >
                <div className="p-2 bg-accent-50 dark:bg-accent-900/20 rounded-md">
                  <Calendar className="h-5 w-5 text-accent-600 dark:text-accent-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Schedule Meeting</p>
                </div>
              </Link>

              <Link
                to="/clients/import"
                className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
              >
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                  <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Import Clients</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;