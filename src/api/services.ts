import type { Customer, CustomerStatus, User, PublicService, Project, ProjectStatus, Task, TaskStatus, Quotation, QuotationStatus, Order, OrderStatus, ProductionJob, ProductionStage, Installation, InstallationStatus, InventoryItem, Payment, PaymentStatus } from './db';

// Use Render backend in production, fallback to localhost for local development
const API_URL = import.meta.env.PROD 
  ? 'https://interior-crm-g0k5.onrender.com/api' 
  : 'http://localhost:5000/api';

const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
  return res.json();
};

export const getPublicServices = async (): Promise<PublicService[]> => fetchAPI('/public-services');
export const addPublicService = async (service: Omit<PublicService, 'id'>): Promise<PublicService> => fetchAPI('/public-services', { method: 'POST', body: JSON.stringify(service) });
export const deletePublicService = async (id: string): Promise<void> => fetchAPI(`/public-services/${id}`, { method: 'DELETE' });

export const getUsers = async (): Promise<User[]> => fetchAPI('/users');
export const addUser = async (user: Omit<User, 'id'>): Promise<User> => fetchAPI('/users', { method: 'POST', body: JSON.stringify(user) });
export const deleteUser = async (id: string): Promise<void> => fetchAPI(`/users/${id}`, { method: 'DELETE' });

export const getCustomers = async (): Promise<Customer[]> => fetchAPI('/customers');
export const getCustomerById = async (id: string): Promise<Customer | undefined> => fetchAPI(`/customers/${id}`);
export const updateCustomerStatus = async (id: string, newStatus: CustomerStatus): Promise<Customer | undefined> => fetchAPI(`/customers/${id}`, { method: 'PATCH', body: JSON.stringify({ status: newStatus }) });
export const updateCustomerDetails = async (id: string, updates: Partial<Customer>): Promise<Customer | undefined> => fetchAPI(`/customers/${id}`, { method: 'PATCH', body: JSON.stringify(updates) });
export const addCustomer = async (customer: Omit<Customer, 'id' | 'dateAdded'>): Promise<Customer> => {
  return fetchAPI('/customers', { 
    method: 'POST', 
    body: JSON.stringify({ ...customer, dateAdded: new Date().toISOString().split('T')[0] }) 
  });
};

export const getProjects = async (): Promise<Project[]> => fetchAPI('/projects');
export const getProjectById = async (id: string): Promise<Project | undefined> => fetchAPI(`/projects/${id}`);
export const updateProjectStatus = async (id: string, status: ProjectStatus): Promise<void> => {
  await fetchAPI(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify({ status, progress: status === 'Completed' ? 100 : undefined }) });
};
export const addProject = async (project: Omit<Project, 'id' | 'progress'>): Promise<void> => {
  await fetchAPI('/projects', { method: 'POST', body: JSON.stringify({ ...project, progress: 0 }) });
};

export const getTasks = async (): Promise<Task[]> => fetchAPI('/tasks');
export const getTaskById = async (id: string): Promise<Task | undefined> => fetchAPI(`/tasks/${id}`);
export const updateTaskStatus = async (id: string, status: TaskStatus): Promise<void> => {
  await fetchAPI(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
};
export const addTask = async (task: Omit<Task, 'id'>): Promise<void> => {
  await fetchAPI('/tasks', { method: 'POST', body: JSON.stringify(task) });
};

export const getQuotations = async (): Promise<Quotation[]> => fetchAPI('/quotations');
export const getQuotationById = async (id: string): Promise<Quotation | undefined> => fetchAPI(`/quotations/${id}`);
export const addQuotation = async (quotation: Omit<Quotation, 'id'>): Promise<void> => {
  await fetchAPI('/quotations', { method: 'POST', body: JSON.stringify(quotation) });
};
export const updateQuotation = async (id: string, updates: Partial<Quotation>): Promise<void> => {
  await fetchAPI(`/quotations/${id}`, { method: 'PATCH', body: JSON.stringify(updates) });
};
export const updateQuotationStatus = async (id: string, status: QuotationStatus): Promise<void> => {
  await fetchAPI(`/quotations/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
};

export const getOrders = async (): Promise<Order[]> => fetchAPI('/orders');
export const addOrder = async (order: Omit<Order, 'id'>): Promise<void> => {
  await fetchAPI('/orders', { method: 'POST', body: JSON.stringify(order) });
};
export const updateOrderStatus = async (id: string, status: OrderStatus): Promise<void> => {
  await fetchAPI(`/orders/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
};

export const getProductionJobs = async (): Promise<ProductionJob[]> => fetchAPI('/production');
export const updateProductionStage = async (id: string, stage: ProductionStage): Promise<void> => {
  await fetchAPI(`/production/${id}`, { method: 'PATCH', body: JSON.stringify({ stage }) });
};

export const getInstallations = async (): Promise<Installation[]> => fetchAPI('/installations');
export const addInstallation = async (installation: Omit<Installation, 'id'>): Promise<void> => {
  await fetchAPI('/installations', { method: 'POST', body: JSON.stringify(installation) });
};
export const updateInstallationStatus = async (id: string, status: InstallationStatus): Promise<void> => {
  await fetchAPI(`/installations/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
};

export const getInventory = async (): Promise<InventoryItem[]> => fetchAPI('/inventory');
export const addInventoryItem = async (item: Omit<InventoryItem, 'id'>): Promise<void> => {
  await fetchAPI('/inventory', { method: 'POST', body: JSON.stringify(item) });
};

export const getPayments = async (): Promise<Payment[]> => fetchAPI('/payments');
export const addPayment = async (payment: Omit<Payment, 'id'>): Promise<void> => {
  await fetchAPI('/payments', { method: 'POST', body: JSON.stringify(payment) });
};
export const updatePaymentStatus = async (id: string, status: PaymentStatus): Promise<void> => {
  await fetchAPI(`/payments/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
};
