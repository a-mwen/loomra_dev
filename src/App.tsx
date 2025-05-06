// src/App.tsx 
import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Loading from './components/ui/Loading';
import PublicRoute from './components/routing/PublicRoute';
import PrivateRoute from './components/routing/PrivateRoute';
import Landing from './pages/Landing'; // Import the Landing component

// Lazy loaded components
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Clients = lazy(() => import('./pages/clients/Clients'));
const ClientDetails = lazy(() => import('./pages/clients/ClientDetails'));
const NewOrEditClient = lazy(() => import('./pages/clients/NeworEditClient'));
const Notes = lazy(() => import('./pages/notes/Notes')); // Add this
const Tasks = lazy(() => import('./pages/tasks/Tasks'));
const NewTask = lazy(() => import('./pages/tasks/newTask')); // ← Add this
const EditTask = lazy(() => import('./pages/tasks/EditTask'));
const Meetings = lazy(() => import('./pages/meetings/Meetings'));
const NewMeeting = lazy(() => import('./pages/meetings/newMeeting')); // New route
const Settings = lazy(() => import('./pages/settings/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        
        <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/new" element={<NewOrEditClient />} />
          <Route path="/clients/:id/edit" element={<NewOrEditClient />} />
          <Route path="/clients/:id" element={<ClientDetails />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tasks/new" element={<NewTask />} />
          <Route path="/tasks/:id/edit" element={<EditTask />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/meetings/new" element={<NewMeeting />} /> {/* <-- Added this */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/notes" element={<Notes />} />

        </Route>
        
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
