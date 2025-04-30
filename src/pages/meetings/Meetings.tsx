import React from 'react';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { Calendar } from 'lucide-react';

const Meetings = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Meetings</h1>
      
      <Card>
        <EmptyState
          icon={<Calendar className="w-12 h-12 text-gray-400" />}
          title="No meetings scheduled"
          description="Schedule your first meeting to get started"
          actionLabel="Schedule Meeting"
          onAction={() => {}}
        />
      </Card>
    </div>
  );
};

export default Meetings;