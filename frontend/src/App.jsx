import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import MainLayout from './components/Layout/MainLayout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import NotFound from './pages/NotFound.jsx';
import Home from './pages/Home.jsx';
import LeadList from './pages/Leads/LeadList.jsx';
import LeadCreate from './pages/Leads/LeadCreate.jsx';
import LeadEdit from './pages/Leads/LeadEdit.jsx';
import LeadDetails from './pages/Leads/LeadDetails.jsx';
import CustomerList from './pages/Customers/CustomerList.jsx';
import CustomerCreate from './pages/Customers/CustomerCreate.jsx';
import CustomerEdit from './pages/Customers/CustomerEdit.jsx';
import TaskList from './pages/Tasks/TaskList.jsx';
import TaskCreate from './pages/Tasks/TaskCreate.jsx';
import TaskEdit from './pages/Tasks/TaskEdit.jsx';
import Profile from './pages/Profile/Profile.jsx';
import Settings from './pages/Settings/index.jsx';
import Register from './pages/Register.jsx';
import TemplateList from './pages/Templates/TemplateList.jsx';
import TemplateForm from './pages/Templates/TemplateForm.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Leads Routes */}
            <Route path="/leads" element={<LeadList />} />
            <Route path="/leads/create" element={<LeadCreate />} />
            <Route path="/leads/:id" element={<LeadDetails />} />
            <Route path="/leads/:id/edit" element={<LeadEdit />} />
            
            {/* Customers Routes */}
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/customers/create" element={<CustomerCreate />} />
            <Route path="/customers/:id/edit" element={<CustomerEdit />} />
            
            {/* Tasks Routes */}
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/tasks/create" element={<TaskCreate />} />
            <Route path="/tasks/:id/edit" element={<TaskEdit />} />
			
            {/* Templates Routes */}
            <Route path="/templates" element={<TemplateList />} />
            <Route path="/templates/create" element={<TemplateForm />} />
            <Route path="/templates/:id/edit" element={<TemplateForm />} />

            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
