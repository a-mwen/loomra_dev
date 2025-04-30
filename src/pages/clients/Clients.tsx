import React from 'react';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { Users } from 'lucide-react';

const Clients = () => {
  // This is a basic implementation that can be expanded later
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Clients</h1>
      
      <Card>
        <EmptyState
          icon={<Users className="w-12 h-12 text-gray-400" />}
          title="No clients yet"
          description="Get started by adding your first client"
          actionLabel="Add Client"
          onAction={() => {}}
        />
      </Card>
    </div>
  );
};

export default Clients;