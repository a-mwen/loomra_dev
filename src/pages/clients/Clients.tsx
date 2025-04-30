import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Plus, Search, SlidersHorizontal, Tag, Users } from 'lucide-react';
import axios from 'axios';
import { API_URL, DEFAULT_CLIENT_TAGS } from '../../config/constants';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  tags: string[];
  createdAt: string;
}

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(`${API_URL}/clients`);
        setClients(response.data);
      } catch (error) {
        console.error('Failed to fetch clients', error);
        // For demo purposes, set some dummy data
        setClients([
          {
            id: '1',
            name: 'Acme Corporation',
            email: 'contact@acme.com',
            phone: '(555) 123-4567',
            company: 'Acme Corp',
            tags: ['active', 'vip'],
            createdAt: '2025-03-15T10:00:00Z'
          },
          {
            id: '2',
            name: 'Globex Industries',
            email: 'info@globex.com',
            phone: '(555) 987-6543',
            company: 'Globex',
            tags: ['prospect'],
            createdAt: '2025-03-20T14:30:00Z'
          },
          {
            id: '3',
            name: 'Stark Enterprises',
            email: 'hello@stark.com',
            phone: '(555) 555-1234',
            company: 'Stark',
            tags: ['active'],
            createdAt: '2025-03-25T09:15:00Z'
          },
          {
            id: '4',
            name: 'Wayne Industries',
            email: 'info@wayne.com',
            phone: '(555) 876-5432',
            company: 'Wayne',
            tags: ['inactive'],
            createdAt: '2025-03-10T11:45:00Z'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const filterClients = () => {
    let filtered = clients;
    
    // Filter by search term
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter(client => 
        client.name.toLowerCase().includes(searchTermLower) ||
        client.email.toLowerCase().includes(searchTermLower) ||
        client.company.toLowerCase().includes(searchTermLower)
      );
    }
    
    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(client => 
        selectedTags.some(tag => client.tags.includes(tag))
      );
    }
    
    return filtered;
  };

  const getTagColor = (tag: string) => {
    const foundTag = DEFAULT_CLIENT_TAGS.find(t => t.value === tag);
    return foundTag ? foundTag.color : 'bg-gray-100 text-gray-800';
  };

  const filteredClients = filterClients();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Clients</h1>
        <div className="flex space-x-2">
          <Link to="/clients/import" className="btn btn-outline flex items-center">
            <FileText className="mr-1.5 h-4 w-4" />
            Import
          </Link>
          <Link to="/clients/new" className="btn btn-primary flex items-center">
            <Plus className="mr-1.5 h-4 w-4" />
            Add Client
          </Link>
        </div>
      </div>

      {/* Search and filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button 
            className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="mr-1.5 h-4 w-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <Tag className="mr-1.5 h-4 w-4" />
                Filter by tags
              </p>
              <div className="flex flex-wrap gap-2">
                {DEFAULT_CLIENT_TAGS.map((tag) => (
                  <button
                    key={tag.value}
                    onClick={() => toggleTag(tag.value)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      selectedTags.includes(tag.value)
                        ? `${tag.color} ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-primary-500`
                        : `bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600`
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Client list */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Company
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tags
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            <Link to={`/clients/${client.id}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                              {client.name}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{client.email}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{client.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{client.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {client.tags.map((tag) => (
                          <span key={tag} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTagColor(tag)}`}>
                            {DEFAULT_CLIENT_TAGS.find(t => t.value === tag)?.label || tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        to={`/clients/${client.id}`} 
                        className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Users className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No clients found</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        {searchTerm || selectedTags.length > 0
                          ? "No clients match your search criteria. Try adjusting your filters."
                          : "You haven't added any clients yet. Add your first client to get started."}
                      </p>
                      {!(searchTerm || selectedTags.length > 0) && (
                        <Link to="/clients/new" className="btn btn-primary">
                          <Plus className="mr-1.5 h-4 w-4" />
                          Add Client
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Clients;