import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus, Search, SlidersHorizontal } from 'lucide-react';
import axios from 'axios';
import { API_URL, MEETING_TYPES } from '../../config/constants';

interface Meeting {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  location: string;
  client: {
    id: string;
    name: string;
  };
}

const Meetings = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState('upcoming'); // 'upcoming', 'past', 'all'
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get(`${API_URL}/meetings`);
        setMeetings(response.data);
      } catch (error) {
        console.error('Failed to fetch meetings', error);
        // For demo purposes, set some dummy data
        const now = new Date();
        const pastDate = new Date(now);
        pastDate.setDate(now.getDate() - 7);
        
        const upcomingDate1 = new Date(now);
        upcomingDate1.setDate(now.getDate() + 3);
        
        const upcomingDate2 = new Date(now);
        upcomingDate2.setDate(now.getDate() + 7);
        
        setMeetings([
          {
            id: '1',
            title: 'Quarterly Review Meeting',
            description: 'Review the performance and discuss future goals.',
            date: upcomingDate1.toISOString(),
            type: 'video',
            location: 'Zoom Link: https://zoom.us/j/1234567890',
            client: {
              id: '1',
              name: 'Acme Corporation'
            }
          },
          {
            id: '2',
            title: 'Policy Discussion',
            description: 'Discuss the new insurance policy and coverage details.',
            date: pastDate.toISOString(),
            type: 'in_person',
            location: 'Acme Corp HQ, 123 Business Ave, San Francisco',
            client: {
              id: '1',
              name: 'Acme Corporation'
            }
          },
          {
            id: '3',
            title: 'Introduction Call',
            description: 'Initial call to understand their insurance needs.',
            date: upcomingDate2.toISOString(),
            type: 'phone',
            location: 'Phone: (555) 123-4567',
            client: {
              id: '2',
              name: 'Globex Industries'
            }
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const filterMeetings = () => {
    let filtered = meetings;
    
    // Filter by search term
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter(meeting => 
        meeting.title.toLowerCase().includes(searchTermLower) ||
        meeting.description.toLowerCase().includes(searchTermLower) ||
        meeting.client.name.toLowerCase().includes(searchTermLower)
      );
    }
    
    // Filter by selected types
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(meeting => selectedTypes.includes(meeting.type));
    }
    
    // Filter by date
    const now = new Date();
    if (dateFilter === 'upcoming') {
      filtered = filtered.filter(meeting => new Date(meeting.date) >= now);
    } else if (dateFilter === 'past') {
      filtered = filtered.filter(meeting => new Date(meeting.date) < now);
    }
    
    // Sort by date
    filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return filtered;
  };

  const getTypeLabel = (type: string) => {
    const foundType = MEETING_TYPES.find(t => t.value === type);
    return foundType ? foundType.label : type;
  };

  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return (
          <div className="p-2 rounded-full bg-accent-50 dark:bg-accent-900/20">
            <svg className="h-4 w-4 text-accent-600 dark:text-accent-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case 'in_person':
        return (
          <div className="p-2 rounded-full bg-primary-50 dark:bg-primary-900/20">
            <svg className="h-4 w-4 text-primary-600 dark:text-primary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        );
      case 'phone':
        return (
          <div className="p-2 rounded-full bg-secondary-50 dark:bg-secondary-900/20">
            <svg className="h-4 w-4 text-secondary-600 dark:text-secondary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
            <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </div>
        );
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  const isPastMeeting = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  const filteredMeetings = filterMeetings();

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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Meetings</h1>
        <div className="flex space-x-2">
          <Link to="/meetings/new" className="btn btn-primary flex items-center">
            <Plus className="mr-1.5 h-4 w-4" />
            Schedule Meeting
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
              placeholder="Search meetings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="select py-2 px-3"
            >
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
              <option value="all">All</option>
            </select>
            
            <button 
              className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition p-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="mr-1.5 h-4 w-4" />
              {showFilters ? 'Hide Filters' : 'Filters'}
            </button>
          </div>
        </div>
        
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Meeting Type</p>
              <div className="flex flex-wrap gap-2">
                {MEETING_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => toggleType(type.value)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      selectedTypes.includes(type.value)
                        ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-primary-500'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Meeting list */}
      <div className="space-y-6">
        {filteredMeetings.length > 0 ? (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredMeetings.map((meeting) => (
                  <div 
                    key={meeting.id} 
                    className={`flex items-start p-6 hover:bg-gray-50 dark:hover:bg-gray-700/30 ${
                      isPastMeeting(meeting.date) ? 'opacity-75' : ''
                    }`}
                  >
                    <div className="flex-shrink-0 mr-4">
                      {getMeetingTypeIcon(meeting.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link 
                            to={`/meetings/${meeting.id}`} 
                            className="text-lg font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
                          >
                            {meeting.title}
                          </Link>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {formatDateTime(meeting.date)}
                            {isPastMeeting(meeting.date) && ' (Past)'}
                          </p>
                        </div>
                        <div className="text-sm text-right">
                          <Link 
                            to={`/clients/${meeting.client.id}`} 
                            className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                          >
                            {meeting.client.name}
                          </Link>
                          <p className="text-gray-500 dark:text-gray-400 mt-1">
                            {getTypeLabel(meeting.type)}
                          </p>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        {meeting.description.length > 100
                          ? `${meeting.description.substring(0, 100)}...`
                          : meeting.description}
                      </p>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-medium">Location:</span> {meeting.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No meetings found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm || selectedTypes.length > 0 || dateFilter !== 'all'
                ? "No meetings match your search criteria. Try adjusting your filters."
                : "You haven't scheduled any meetings yet. Schedule your first meeting to get started."}
            </p>
            {!(searchTerm || selectedTypes.length > 0) && (
              <Link to="/meetings/new" className="btn btn-primary inline-flex items-center">
                <Plus className="mr-1.5 h-4 w-4" />
                Schedule Meeting
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Meetings;