import { Link } from 'react-router-dom';
import { BarChart3, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-xl bg-primary-600 flex items-center justify-center">
            <BarChart3 className="h-10 w-10 text-white" />
          </div>
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Page not found</p>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
          Sorry, we couldn't find the page you're looking for. Perhaps you've mistyped the URL or the page has been moved.
        </p>
        
        <Link to="/dashboard" className="btn btn-primary inline-flex items-center">
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;