import { mockCustomers, mockUsers, publicServices, mockProjects, mockTasks, mockQuotations, mockOrders, mockProductionJobs, mockInstallations, mockInventory, mockPayments } from './db';
import type { Customer, CustomerStatus, User, PublicService, Project, ProjectStatus, Task, TaskStatus, Quotation, QuotationStatus, Order, OrderStatus, ProductionJob, ProductionStage, Installation, InstallationStatus, InventoryItem, Payment, PaymentStatus } from './db';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let users = [...mockUsers];
let customers = [...mockCustomers];
let servicesList = [...publicServices];
let projectsDb = [...mockProjects];

export const getPublicServices = async (): Promise<PublicService[]> => {
  await delay(300);
  return [...servicesList];
};

export const addPublicService = async (service: Omit<PublicService, 'id'>): Promise<PublicService> => {
  await delay(300);
  const newService = { ...service, id: `s${Date.now()}` };
  servicesList.push(newService);
  return newService;
};

export const deletePublicService = async (id: string): Promise<void> => {
  await delay(300);
  servicesList = servicesList.filter(s => s.id !== id);
};

export const getUsers = async (): Promise<User[]> => {
  await delay(300);
  return [...users];
};

export const addUser = async (user: Omit<User, 'id'>): Promise<User> => {
  await delay(300);
  const newUser = { ...user, id: `u${Date.now()}` };
  users.push(newUser);
  return newUser;
};

export const deleteUser = async (id: string): Promise<void> => {
  await delay(300);
  users = users.filter(u => u.id !== id);
};

export const getCustomers = async (): Promise<Customer[]> => {
  await delay(300);
  return [...customers];
};

export const getCustomerById = async (id: string): Promise<Customer | undefined> => {
  await delay(300);
  return customers.find(c => c.id === id);
};

export const updateCustomerStatus = async (id: string, newStatus: CustomerStatus): Promise<Customer | undefined> => {
  await delay(300);
  const index = customers.findIndex(c => c.id === id);
  if (index !== -1) {
    customers[index].status = newStatus;
    return customers[index];
  }
  return undefined;
};

export const updateCustomerDetails = async (id: string, updates: Partial<Customer>): Promise<Customer | undefined> => {
  await delay(300);
  const index = customers.findIndex(c => c.id === id);
  if (index !== -1) {
    customers[index] = { ...customers[index], ...updates };
    return customers[index];
  }
  return undefined;
};

export const addCustomer = async (customer: Omit<Customer, 'id' | 'dateAdded'>): Promise<Customer> => {
  await delay(300);
  const newCustomer = { 
    ...customer, 
    id: `c${Date.now()}`,
    dateAdded: new Date().toISOString().split('T')[0]
  };
  customers.push(newCustomer as Customer);
  return newCustomer as Customer;
};

export const getProjects = async (): Promise<Project[]> => {
  await delay(300);
  return [...projectsDb];
};

export const getProjectById = async (id: string): Promise<Project | undefined> => {
  await delay(300);
  return projectsDb.find(p => p.id === id);
};

export const updateProjectStatus = async (id: string, status: ProjectStatus): Promise<void> => {
  await delay(300);
  const index = projectsDb.findIndex(p => p.id === id);
  if (index !== -1) {
    projectsDb[index].status = status;
    if (status === 'Completed') {
      projectsDb[index].progress = 100;
    }
  }
};

export const addProject = async (project: Omit<Project, 'id' | 'progress'>): Promise<void> => {
  await delay(300);
  const newProject: Project = {
    ...project,
    id: `p${Date.now()}`,
    progress: project.status === 'Completed' ? 100 : 0
  };
  projectsDb = [newProject, ...projectsDb];
};

let tasksDb = [...mockTasks];

export const getTasks = async (): Promise<Task[]> => {
  await delay(300);
  return [...tasksDb];
};

export const getTaskById = async (id: string): Promise<Task | undefined> => {
  await delay(300);
  return tasksDb.find(t => t.id === id);
};

export const updateTaskStatus = async (id: string, status: TaskStatus): Promise<void> => {
  await delay(300);
  const index = tasksDb.findIndex(t => t.id === id);
  if (index !== -1) {
    tasksDb[index].status = status;
  }
};

export const addTask = async (task: Omit<Task, 'id'>): Promise<void> => {
  await delay(300);
  const newTask: Task = {
    ...task,
    id: `t${Date.now()}`
  };
  tasksDb = [newTask, ...tasksDb];
};

let quotationsDb = [...mockQuotations];

export const getQuotations = async (): Promise<Quotation[]> => {
  await delay(300);
  return [...quotationsDb];
};

export const updateQuotationStatus = async (id: string, status: QuotationStatus): Promise<void> => {
  await delay(300);
  const index = quotationsDb.findIndex(q => q.id === id);
  if (index !== -1) {
    quotationsDb[index].status = status;
  }
};

export const addQuotation = async (quotation: Omit<Quotation, 'id'>): Promise<void> => {
  await delay(300);
  const newQuotation: Quotation = {
    ...quotation,
    id: `q${Date.now()}`
  };
  quotationsDb = [newQuotation, ...quotationsDb];
};

export const updateQuotation = async (id: string, updates: Partial<Quotation>): Promise<void> => {
  await delay(300);
  const index = quotationsDb.findIndex(q => q.id === id);
  if (index !== -1) {
    quotationsDb[index] = { ...quotationsDb[index], ...updates };
  }
};

let ordersDb = [...mockOrders];

export const getOrders = async (): Promise<Order[]> => {
  await delay(300);
  return [...ordersDb];
};

export const updateOrderStatus = async (id: string, status: OrderStatus): Promise<void> => {
  await delay(300);
  const index = ordersDb.findIndex(o => o.id === id);
  if (index !== -1) {
    ordersDb[index].status = status;
  }
};

let productionJobsDb = [...mockProductionJobs];

export const getProductionJobs = async (): Promise<ProductionJob[]> => {
  await delay(300);
  return [...productionJobsDb];
};

export const updateProductionStage = async (id: string, stage: ProductionStage): Promise<void> => {
  await delay(300);
  const index = productionJobsDb.findIndex(j => j.id === id);
  if (index !== -1) {
    productionJobsDb[index].stage = stage;
  }
};

let installationsDb = [...mockInstallations];

export const getInstallations = async (): Promise<Installation[]> => {
  await delay(300);
  return [...installationsDb];
};

export const addInstallation = async (installation: Omit<Installation, 'id'>): Promise<void> => {
  await delay(300);
  const newInstallation: Installation = {
    ...installation,
    id: `INST-${Date.now()}`
  };
  installationsDb = [newInstallation, ...installationsDb];
};

export const updateInstallationStatus = async (id: string, status: InstallationStatus): Promise<void> => {
  await delay(300);
  const index = installationsDb.findIndex(i => i.id === id);
  if (index !== -1) {
    installationsDb[index].status = status;
  }
};

let inventoryDb = [...mockInventory];

export const getInventory = async (): Promise<InventoryItem[]> => {
  await delay(300);
  return [...inventoryDb];
};

export const addInventoryItem = async (item: Omit<InventoryItem, 'id'>): Promise<void> => {
  await delay(300);
  const newItem: InventoryItem = {
    ...item,
    id: `INV-${Date.now()}`
  };
  inventoryDb = [newItem, ...inventoryDb];
};

let paymentsDb = [...mockPayments];

export const getPayments = async (): Promise<Payment[]> => {
  await delay(300);
  return [...paymentsDb];
};

export const addPayment = async (payment: Omit<Payment, 'id' | 'projectName' | 'customerName'>): Promise<void> => {
  await delay(300);
  const project = projectsDb.find(p => p.id === payment.projectId);
  if (!project) throw new Error("Project not found");
  
  const newPayment: Payment = {
    ...payment,
    id: `PAY-${Date.now()}`,
    projectName: project.projectName,
    customerName: project.customerName
  };
  paymentsDb = [newPayment, ...paymentsDb];
};

export const updatePaymentStatus = async (id: string, status: PaymentStatus): Promise<void> => {
  await delay(300);
  const index = paymentsDb.findIndex(p => p.id === id);
  if (index !== -1) {
    paymentsDb[index].status = status;
  }
};
