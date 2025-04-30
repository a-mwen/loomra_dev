import { useState } from 'react';
import { Bell, Download, Moon, Sun, Upload, UserCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Settings = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    taskReminders: true,
    meetingReminders: true,
    clientUpdates: false,
  });
  
  const [csvExportOptions, setCsvExportOptions] = useState({
    includeNotes: true,
    includeCustomFields: true,
    includeInactiveClients: false,
  });

  const handleNotificationChange = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const handleCsvOptionChange = (key: string) => {
    setCsvExportOptions(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`
                py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                ${activeTab === 'profile'
                  ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'}
              `}
            >
              <UserCircle className="inline-block mr-2 h-4 w-4" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('appearance')}
              className={`
                py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                ${activeTab === 'appearance'
                  ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'}
              `}
            >
              {theme === 'dark' ? (
                <Moon className="inline-block mr-2 h-4 w-4" />
              ) : (
                <Sun className="inline-block mr-2 h-4 w-4" />
              )}
              Appearance
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`
                py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                ${activeTab === 'notifications'
                  ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'}
              `}
            >
              <Bell className="inline-block mr-2 h-4 w-4" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className={`
                py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                ${activeTab === 'data'
                  ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'}
              `}
            >
              <Download className="inline-block mr-2 h-4 w-4" />
              Data Management
            </button>
          </nav>
        </div>

        {/* Tab content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Profile Information</h2>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-24 w-24 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                  <UserCircle className="h-16 w-16 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <button className="btn btn-outline">Change Photo</button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="label">Name</label>
                  <input
                    id="name"
                    type="text"
                    className="input"
                    defaultValue={user?.name}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="label">Email</label>
                  <input
                    id="email"
                    type="email"
                    className="input"
                    defaultValue={user?.email}
                    disabled
                  />
                </div>
                <div>
                  <label htmlFor="role" className="label">Role</label>
                  <input
                    id="role"
                    type="text"
                    className="input"
                    defaultValue={user?.role}
                    disabled
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="label">Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    className="input"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="bio" className="label">Bio</label>
                  <textarea
                    id="bio"
                    rows={4}
                    className="input"
                    placeholder="Tell us about yourself"
                  ></textarea>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Change Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="current-password" className="label">Current Password</label>
                    <input
                      id="current-password"
                      type="password"
                      className="input"
                      placeholder="••••••••"
                    />
                  </div>
                  <div></div>
                  <div>
                    <label htmlFor="new-password" className="label">New Password</label>
                    <input
                      id="new-password"
                      type="password"
                      className="input"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirm-password" className="label">Confirm New Password</label>
                    <input
                      id="confirm-password"
                      type="password"
                      className="input"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button type="button" className="btn btn-outline">
                  Cancel
                </button>
                <button type="button" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Appearance Settings</h2>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Theme</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    className={`
                      border rounded-lg p-6 cursor-pointer transition-all
                      ${theme === 'light'
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-400'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'}
                    `}
                    onClick={() => {
                      if (theme === 'dark') toggleTheme();
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-white border border-gray-200 rounded-md p-3">
                        <Sun className="h-6 w-6 text-yellow-500" />
                      </div>
                      {theme === 'light' && (
                        <div className="h-5 w-5 rounded-full bg-primary-500 flex items-center justify-center">
                          <svg className="h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Light Mode</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Classic light theme with high contrast
                    </p>
                  </div>
                  
                  <div
                    className={`
                      border rounded-lg p-6 cursor-pointer transition-all
                      ${theme === 'dark'
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-400'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'}
                    `}
                    onClick={() => {
                      if (theme === 'light') toggleTheme();
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-gray-800 border border-gray-700 rounded-md p-3">
                        <Moon className="h-6 w-6 text-gray-200" />
                      </div>
                      {theme === 'dark' && (
                        <div className="h-5 w-5 rounded-full bg-primary-500 flex items-center justify-center">
                          <svg className="h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Dark theme for reduced eye strain
                    </p>
                  </div>
                  
                  <div
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 cursor-pointer opacity-50"
                    title="Coming soon"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-gradient-to-r from-white to-gray-800 border border-gray-200 rounded-md p-3 flex items-center justify-center">
                        <svg className="h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                      </div>
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">System Default</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Follow your system appearance (Coming soon)
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Color Accent</h3>
                <div className="grid grid-cols-6 gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary-500 border-2 border-primary-600 cursor-pointer"></div>
                  <div className="h-10 w-10 rounded-full bg-blue-500 cursor-pointer"></div>
                  <div className="h-10 w-10 rounded-full bg-green-500 cursor-pointer"></div>
                  <div className="h-10 w-10 rounded-full bg-yellow-500 cursor-pointer"></div>
                  <div className="h-10 w-10 rounded-full bg-red-500 cursor-pointer"></div>
                  <div className="h-10 w-10 rounded-full bg-purple-500 cursor-pointer"></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Custom color selection coming soon
                </p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button type="button" className="btn btn-outline">
                  Reset to Default
                </button>
                <button type="button" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Notification Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <h3 className="text-md font-medium text-gray-900 dark:text-white">Email Notifications</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive notifications via email
                    </p>
                  </div>
                  <div className="relative inline-block w-12 h-6">
                    <input 
                      type="checkbox" 
                      id="email-toggle" 
                      className="sr-only" 
                      checked={notifications.email}
                      onChange={() => handleNotificationChange('email')} 
                    />
                    <label
                      htmlFor="email-toggle"
                      className={`block w-12 h-6 rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${
                        notifications.email ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <span
                        className={`absolute left-1 top-1 bg-white dark:bg-gray-200 w-4 h-4 rounded-full transition duration-200 ease-in-out transform ${
                          notifications.email ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      ></span>
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <h3 className="text-md font-medium text-gray-900 dark:text-white">Task Reminders</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Get reminders for upcoming and due tasks
                    </p>
                  </div>
                  <div className="relative inline-block w-12 h-6">
                    <input 
                      type="checkbox" 
                      id="task-toggle" 
                      className="sr-only" 
                      checked={notifications.taskReminders}
                      onChange={() => handleNotificationChange('taskReminders')} 
                    />
                    <label
                      htmlFor="task-toggle"
                      className={`block w-12 h-6 rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${
                        notifications.taskReminders ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <span
                        className={`absolute left-1 top-1 bg-white dark:bg-gray-200 w-4 h-4 rounded-full transition duration-200 ease-in-out transform ${
                          notifications.taskReminders ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      ></span>
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <h3 className="text-md font-medium text-gray-900 dark:text-white">Meeting Reminders</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Get reminders for upcoming meetings
                    </p>
                  </div>
                  <div className="relative inline-block w-12 h-6">
                    <input 
                      type="checkbox" 
                      id="meeting-toggle" 
                      className="sr-only" 
                      checked={notifications.meetingReminders}
                      onChange={() => handleNotificationChange('meetingReminders')} 
                    />
                    <label
                      htmlFor="meeting-toggle"
                      className={`block w-12 h-6 rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${
                        notifications.meetingReminders ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <span
                        className={`absolute left-1 top-1 bg-white dark:bg-gray-200 w-4 h-4 rounded-full transition duration-200 ease-in-out transform ${
                          notifications.meetingReminders ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      ></span>
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <h3 className="text-md font-medium text-gray-900 dark:text-white">Client Updates</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive notifications when client information is updated
                    </p>
                  </div>
                  <div className="relative inline-block w-12 h-6">
                    <input 
                      type="checkbox" 
                      id="client-toggle" 
                      className="sr-only" 
                      checked={notifications.clientUpdates}
                      onChange={() => handleNotificationChange('clientUpdates')} 
                    />
                    <label
                      htmlFor="client-toggle"
                      className={`block w-12 h-6 rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${
                        notifications.clientUpdates ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <span
                        className={`absolute left-1 top-1 bg-white dark:bg-gray-200 w-4 h-4 rounded-full transition duration-200 ease-in-out transform ${
                          notifications.clientUpdates ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      ></span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Notification Delivery</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Choose when and how you want to receive notifications
                </p>
                
                <div>
                  <div className="mb-3">
                    <label htmlFor="notification-time" className="label">Quiet Hours</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="start-time" className="text-xs text-gray-500 dark:text-gray-400">Start</label>
                        <input
                          id="start-time"
                          type="time"
                          className="input"
                          defaultValue="22:00"
                        />
                      </div>
                      <div>
                        <label htmlFor="end-time" className="text-xs text-gray-500 dark:text-gray-400">End</label>
                        <input
                          id="end-time"
                          type="time"
                          className="input"
                          defaultValue="08:00"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="frequency" className="label">Notification Frequency</label>
                    <select
                      id="frequency"
                      className="select"
                      defaultValue="immediate"
                    >
                      <option value="immediate">Immediate</option>
                      <option value="hourly">Hourly Digest</option>
                      <option value="daily">Daily Digest</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button type="button" className="btn btn-outline">
                  Reset to Default
                </button>
                <button type="button" className="btn btn-primary">
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Data Management</h2>
              
              {/* Export Data */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">Export Client Data</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Download your client data as a CSV file
                    </p>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="btn btn-primary inline-flex items-center"
                    >
                      <Download className="mr-1.5 h-4 w-4" />
                      Export CSV
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 space-y-3">
                  <div className="flex items-center">
                    <input
                      id="include-notes"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      checked={csvExportOptions.includeNotes}
                      onChange={() => handleCsvOptionChange('includeNotes')}
                    />
                    <label htmlFor="include-notes" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Include notes
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="include-custom-fields"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      checked={csvExportOptions.includeCustomFields}
                      onChange={() => handleCsvOptionChange('includeCustomFields')}
                    />
                    <label htmlFor="include-custom-fields" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Include custom fields
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="include-inactive"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      checked={csvExportOptions.includeInactiveClients}
                      onChange={() => handleCsvOptionChange('includeInactiveClients')}
                    />
                    <label htmlFor="include-inactive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Include inactive clients
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Import Data */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">Import Client Data</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Import clients from a CSV file
                    </p>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="btn btn-outline inline-flex items-center"
                    >
                      <Upload className="mr-1.5 h-4 w-4" />
                      Import CSV
                    </button>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Note:</span> Your CSV file should include columns for name, email, phone, company, and tags. 
                    <a href="#" className="text-primary-600 dark:text-primary-400 ml-1">
                      Download template
                    </a>
                  </p>
                </div>
              </div>
              
              {/* Data Retention */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">Data Retention</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Configure how long to keep your data
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="completed-tasks" className="label">Automatically delete completed tasks after</label>
                    <select
                      id="completed-tasks"
                      className="select"
                      defaultValue="never"
                    >
                      <option value="never">Never</option>
                      <option value="30">30 days</option>
                      <option value="90">90 days</option>
                      <option value="365">1 year</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="past-meetings" className="label">Automatically delete past meetings after</label>
                    <select
                      id="past-meetings"
                      className="select"
                      defaultValue="never"
                    >
                      <option value="never">Never</option>
                      <option value="30">30 days</option>
                      <option value="90">90 days</option>
                      <option value="365">1 year</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Delete Account */}
              <div className="border border-error-200 dark:border-error-800 bg-error-50 dark:bg-error-900/10 rounded-lg p-6">
                <h3 className="text-md font-medium text-error-800 dark:text-error-300 mb-2">Delete Account</h3>
                <p className="text-sm text-error-600 dark:text-error-400 mb-4">
                  Permanently delete your account and all your data. This action cannot be undone.
                </p>
                
                <button
                  type="button"
                  className="btn bg-error-600 hover:bg-error-700 text-white"
                >
                  Delete Account
                </button>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button type="button" className="btn btn-outline">
                  Cancel
                </button>
                <button type="button" className="btn btn-primary">
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;