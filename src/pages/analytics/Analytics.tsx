import React from 'react';
import { Card } from '../../components/common/Card';
import { BarChart, LineChart, PieChart, TrendingUp } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Task Completion">
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <BarChart className="w-12 h-12 text-gray-400 mx-auto" />
              <p className="mt-4 text-sm text-gray-500">Task completion data will appear here</p>
            </div>
          </div>
        </Card>
        
        <Card title="Active Clients">
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <LineChart className="w-12 h-12 text-gray-400 mx-auto" />
              <p className="mt-4 text-sm text-gray-500">Client activity data will appear here</p>
            </div>
          </div>
        </Card>
        
        <Card title="Meeting Statistics">
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <PieChart className="w-12 h-12 text-gray-400 mx-auto" />
              <p className="mt-4 text-sm text-gray-500">Meeting statistics will appear here</p>
            </div>
          </div>
        </Card>
        
        <Card title="Growth Metrics">
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto" />
              <p className="mt-4 text-sm text-gray-500">Growth metrics will appear here</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;