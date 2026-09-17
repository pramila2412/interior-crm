import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Users } from './pages/Users';
import { Customers } from './pages/Customers';
import { CustomerDetails } from './pages/CustomerDetails';
import { ServicesManagement } from './pages/ServicesManagement';
import { CalendarView } from './pages/CalendarView';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { Projects } from './pages/Projects';
import { ProjectDetails } from './pages/ProjectDetails';
import { Tasks } from './pages/Tasks';
import { TaskDetails } from './pages/TaskDetails';
import { Quotations } from './pages/Quotations';
import { Orders } from './pages/Orders';
import { Production } from './pages/Production';
import { Installations } from './pages/Installations';
import { Inventory } from './pages/Inventory';
import { Reports } from './pages/Reports';
import { Payments } from './pages/Payments';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetails />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="tasks/:id" element={<TaskDetails />} />
          <Route path="customers" element={<Customers />} />
          <Route path="customers/:id" element={<CustomerDetails />} />
          <Route path="quotations" element={<Quotations />} />
          <Route path="orders" element={<Orders />} />
          <Route path="production" element={<Production />} />
          <Route path="installations" element={<Installations />} />
          <Route path="payments" element={<Payments />} />
          <Route path="calendar" element={<CalendarView />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="users" element={<Users />} />
          <Route path="services" element={<ServicesManagement />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<PlaceholderPage title="System Settings" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
