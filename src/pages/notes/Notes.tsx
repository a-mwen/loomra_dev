import React from 'react';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { FileText } from 'lucide-react';

const Notes = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Notes</h1>
      
      <Card>
        <EmptyState
          icon={<FileText className="w-12 h-12 text-gray-400" />}
          title="No notes yet"
          description="Create your first note to get started"
          actionLabel="Create Note"
          onAction={() => {}}
        />
      </Card>
    </div>
  );
};

export default Notes;