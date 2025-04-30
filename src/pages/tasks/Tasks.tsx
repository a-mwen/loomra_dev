import React from 'react';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { ClipboardList } from 'lucide-react';

const Tasks = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Tasks</h1>
      
      <Card>
        <EmptyState
          icon={<ClipboardList className="w-12 h-12 text-gray-400" />}
          title="No tasks yet"
          description="Create your first task to get started"
          actionLabel="Create Task"
          onAction={() => {}}
        />
      </Card>
    </div>
  );
};

export default Tasks;