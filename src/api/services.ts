import { mockUsers, mockCustomers, publicServices, type User, type Customer, type CustomerStatus, type PublicService } from './db';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let users = [...mockUsers];
let customers = [...mockCustomers];
let servicesList = [...publicServices];

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
