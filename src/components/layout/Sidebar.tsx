import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Calendar, ClipboardList, Home, Settings, Users, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const location = useLocation();
  const { user } = useAuth();
  
  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Clients', path: '/clients', icon: Users },
    { name: 'Tasks', path: '/tasks', icon: ClipboardList },
    { name: 'Meetings', path: '/meetings', icon: Calendar },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className={`
      lg:block fixed lg:relative inset-y-0 left-0 z-30 w-64 
      transition duration-300 transform bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      <div className="flex items-center justify-between px-4 py-5">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">Loomra</span>
        </div>
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="px-2 py-4">
        {/* User profile short */}
        <div className="px-4 py-3 mb-6 rounded-lg bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-primary-500 text-white flex items-center justify-center">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => toggleSidebar()}
                className={`
                  group flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all
                  ${isActive
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/30'}
                `}
              >
                <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* Version */}
      <div className="absolute bottom-0 w-full border-t border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-400 dark:text-gray-500">v1.0.0</div>
          <a href="#" className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400">
            Help
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;