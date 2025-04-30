import React from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';
import { UserCircle } from 'lucide-react';

const ClientDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = React.useState(true);
  const [client, setClient] = React.useState<any>(null);

  React.useEffect(() => {
    // Simulate loading client data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  if (!client) {
    return (
      <EmptyState
        icon={UserCircle}
        title="Client Not Found"
        description="The client you're looking for doesn't exist or has been removed."
      />
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold tracking-tight">Client Details</h1>
      <Card>
        <div className="p-6">
          <p className="text-gray-500">Client ID: {id}</p>
          {/* Additional client details will be added here */}
        </div>
      </Card>
    </div>
  );
};

export default ClientDetails;