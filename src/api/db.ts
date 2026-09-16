export type Role = 'Superadmin' | 'Admin' | 'Manager' | 'Staff';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
};

export type CustomerStatus = 'Enquiry' | 'Measurement' | 'Production' | 'Delivery & Installation';

export type Customer = {
  id: string;
  name: string;
  phone: string;
  address: string;
  service: string;
  status: CustomerStatus;
  dateAdded: string;
  notes?: string;
  
  // Detailed tracking fields
  category?: string;
  measurements?: string;
  measurementDate?: string;
  fabricDetails?: string;
  productionTimeline?: string;
  deliveryDate?: string;
};

export type ProjectStatus = 'Planning' | 'Execution' | 'Review' | 'Completed';

export type Project = {
  id: string;
  projectName: string;
  customerName: string;
  category: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  budget: number;
  progress: number; // 0 to 100
};

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  projectId?: string;
  projectName?: string;
  assigneeName?: string;
};

export type QuotationStatus = 'DRAFT' | 'SENT' | 'APPROVED' | 'REJECTED';

export type LineItem = {
  id: string;
  item: string;
  description: string;
  qty: number;
  rate: number;
};

export type Quotation = {
  id: string;
  projectId: string;
  projectName: string;
  customerName: string;
  date: string;
  status: QuotationStatus;
  items: LineItem[];
  subtotal: number;
  tax: number;
  total: number;
};

export type OrderStatus = 'PROCESSING' | 'READY' | 'DELIVERED';
export type Order = {
  id: string;
  projectId: string;
  projectName: string;
  customerName: string;
  date: string;
  status: OrderStatus;
  amount: number;
  itemsCount: number;
};

export type ProductionStage = 'PROCUREMENT' | 'MEASUREMENT' | 'TAILORING' | 'READY';
export type ProductionJob = {
  id: string;
  projectId: string;
  projectName: string;
  assigneeName?: string;
  stage: ProductionStage;
};

export type InstallationStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
export type Installation = {
  id: string;
  projectId: string;
  projectName: string;
  customerName: string;
  assigneeName: string;
  scheduledDate: string;
  status: InstallationStatus;
};

// Initial Mock Data
export const mockUsers: User[] = [
  { id: 'u1', name: 'Alice Super', email: 'alice@furnish.com', role: 'Superadmin' },
  { id: 'u2', name: 'Bob Admin', email: 'bob@furnish.com', role: 'Admin' },
  { id: 'u3', name: 'Charlie Manager', email: 'charlie@furnish.com', role: 'Manager' },
  { id: 'u4', name: 'Diana Staff', email: 'diana@furnish.com', role: 'Staff' },
];

export const mockProjects: Project[] = [
  { id: 'p1', projectName: 'Skyline Penthouse Redesign', customerName: 'John Doe', category: 'Full Home Interiors', status: 'Planning', startDate: '2026-09-20', endDate: '2026-11-15', budget: 45000, progress: 10 },
  { id: 'p2', projectName: 'Smith Kitchen Upgrade', customerName: 'Jane Smith', category: 'Modular Kitchen', status: 'Execution', startDate: '2026-09-01', endDate: '2026-10-15', budget: 15000, progress: 45 },
  { id: 'p3', projectName: 'Downtown Office Setup', customerName: 'Robert Brown', category: 'Commercial Spaces', status: 'Review', startDate: '2026-08-10', endDate: '2026-09-20', budget: 85000, progress: 90 },
  { id: 'p4', projectName: 'Cozy Villa Living Room', customerName: 'Emily White', category: 'Luxury Furniture', status: 'Completed', startDate: '2026-07-01', endDate: '2026-08-15', budget: 12000, progress: 100 },
];

export const mockTasks: Task[] = [
  { id: 't1', title: 'Finalize Floor Plans', description: 'Get approval from John Doe', status: 'TODO', priority: 'HIGH', dueDate: '2026-09-18', projectName: 'Skyline Penthouse Redesign', assigneeName: 'Alice Super' },
  { id: 't2', title: 'Order Cabinet Materials', description: 'Order plywood and laminates', status: 'IN_PROGRESS', priority: 'URGENT', dueDate: '2026-09-15', projectName: 'Smith Kitchen Upgrade', assigneeName: 'Charlie Manager' },
  { id: 't3', title: 'Site Inspection', description: 'Check electricals', status: 'REVIEW', priority: 'MEDIUM', dueDate: '2026-09-17', projectName: 'Downtown Office Setup', assigneeName: 'Bob Admin' },
  { id: 't4', title: 'Deliver Sofa', description: 'Ensure safe transport', status: 'DONE', priority: 'LOW', dueDate: '2026-08-10', projectName: 'Cozy Villa Living Room', assigneeName: 'Diana Staff' },
  { id: 't5', title: 'Client Meeting', status: 'TODO', priority: 'MEDIUM', dueDate: '2026-09-22', assigneeName: 'Alice Super' }
];

export const mockQuotations: Quotation[] = [
  {
    id: 'q1',
    projectId: 'p1',
    projectName: 'Skyline Penthouse Redesign',
    customerName: 'John Doe',
    date: '2026-09-12',
    status: 'APPROVED',
    items: [
      { id: '1', item: 'Italian Marble Flooring', description: 'Premium grade for living room', qty: 500, rate: 450 },
      { id: '2', item: 'False Ceiling', description: 'Gypsum with cove lighting', qty: 1, rate: 85000 }
    ],
    subtotal: 310000,
    tax: 55800,
    total: 365800
  },
  {
    id: 'q2',
    projectId: 'p2',
    projectName: 'Smith Kitchen Upgrade',
    customerName: 'Jane Smith',
    date: '2026-09-15',
    status: 'DRAFT',
    items: [
      { id: '1', item: 'Modular Cabinets', description: 'High gloss acrylic finish', qty: 1, rate: 120000 },
      { id: '2', item: 'Quartz Countertop', description: 'White with grey veins', qty: 45, rate: 650 }
    ],
    subtotal: 149250,
    tax: 26865,
    total: 176115
  }
];

export const mockOrders: Order[] = [
  { id: 'ORD-001', projectId: 'p1', projectName: 'Skyline Penthouse Redesign', customerName: 'John Doe', date: '2026-09-12', status: 'PROCESSING', amount: 365800, itemsCount: 2 },
  { id: 'ORD-002', projectId: 'p3', projectName: 'Downtown Office Setup', customerName: 'Robert Brown', date: '2026-08-15', status: 'READY', amount: 85000, itemsCount: 4 },
  { id: 'ORD-003', projectId: 'p4', projectName: 'Cozy Villa Living Room', customerName: 'Emily White', date: '2026-07-05', status: 'DELIVERED', amount: 12000, itemsCount: 1 }
];

export const mockProductionJobs: ProductionJob[] = [
  { id: 'PROD-001', projectId: 'p1', projectName: 'Skyline Penthouse Redesign', assigneeName: 'Alice Super', stage: 'PROCUREMENT' },
  { id: 'PROD-002', projectId: 'p2', projectName: 'Smith Kitchen Upgrade', assigneeName: 'Charlie Manager', stage: 'MEASUREMENT' },
  { id: 'PROD-003', projectId: 'p3', projectName: 'Downtown Office Setup', assigneeName: 'Bob Admin', stage: 'TAILORING' },
  { id: 'PROD-004', projectId: 'p4', projectName: 'Cozy Villa Living Room', assigneeName: 'Diana Staff', stage: 'READY' }
];

export const mockInstallations: Installation[] = [
  { id: 'INST-001', projectId: 'p3', projectName: 'Downtown Office Setup', customerName: 'Robert Brown', assigneeName: 'Diana Staff', scheduledDate: '2026-09-18T10:00', status: 'SCHEDULED' },
  { id: 'INST-002', projectId: 'p2', projectName: 'Smith Kitchen Upgrade', customerName: 'Jane Smith', assigneeName: 'Charlie Manager', scheduledDate: '2026-09-15T09:00', status: 'IN_PROGRESS' },
  { id: 'INST-003', projectId: 'p4', projectName: 'Cozy Villa Living Room', customerName: 'Emily White', assigneeName: 'Bob Admin', scheduledDate: '2026-08-12T14:00', status: 'COMPLETED' }
];

export const mockCustomers: Customer[] = [
  {
    id: 'c1', name: 'John Doe', phone: '+919876543210', address: '123 Park Ave, New York', service: 'Curtains & Blinds', category: 'Custom Curtains & Blinds', status: 'Enquiry', dateAdded: '2026-09-10',
    measurementDate: '2026-09-18', deliveryDate: '2026-09-25'
  },
  {
    id: 'c2', name: 'Jane Smith', phone: '+918765432109', address: '456 Oak St, London', service: 'Modular Wardrobe', category: 'Modular Wardrobes', status: 'Measurement', dateAdded: '2026-09-12',
    measurementDate: '2026-09-15', deliveryDate: '2026-09-30'
  },
  {
    id: 'c3', name: 'Robert Brown', phone: '+917654321098', address: '789 Pine Rd, Sydney', service: 'Full Home Interior', category: 'Full Home Interiors', status: 'Production', dateAdded: '2026-09-05',
    measurementDate: '2026-09-08', deliveryDate: '2026-10-10'
  },
  {
    id: 'c4', name: 'Emily White', phone: '+916543210987', address: '321 Elm St, Toronto', service: 'Sofa Customization', category: 'Luxury Furniture', status: 'Delivery & Installation', dateAdded: '2026-09-01',
    measurementDate: '2026-09-03', deliveryDate: '2026-09-16'
  },
  {
    id: 'c5', name: 'Michael Green', phone: '+919988776655', address: '99 Willow Way, Chicago', service: 'Kitchen Remodel', category: 'Full Home Interiors', status: 'Measurement', dateAdded: '2026-09-14',
    measurementDate: '2026-09-20', deliveryDate: '2026-10-15'
  },
  {
    id: 'c6', name: 'Sarah Connor', phone: '+918877665544', address: '44 Cypress Ct, Miami', service: 'Living Room Setup', category: 'Luxury Furniture', status: 'Production', dateAdded: '2026-09-11',
    measurementDate: '2026-09-13', deliveryDate: '2026-09-28'
  },
  {
    id: 'c7', name: 'David Lee', phone: '+917766554433', address: '77 Maple Dr, Seattle', service: 'Bedroom Wardrobe', category: 'Modular Wardrobes', status: 'Enquiry', dateAdded: '2026-09-15',
    measurementDate: '2026-09-22', deliveryDate: '2026-10-05'
  },
  {
    id: 'c8', name: 'Anna Taylor', phone: '+916655443322', address: '22 Birch Blvd, Austin', service: 'Window Blinds', category: 'Custom Curtains & Blinds', status: 'Production', dateAdded: '2026-09-09',
    measurementDate: '2026-09-11', deliveryDate: '2026-09-19'
  },
  {
    id: 'c9', name: 'James Wilson', phone: '+915544332211', address: '11 Cedar Ln, Denver', service: 'Dining Set', category: 'Luxury Furniture', status: 'Delivery & Installation', dateAdded: '2026-09-02',
    measurementDate: '2026-09-04', deliveryDate: '2026-09-17'
  },
  {
    id: 'c10', name: 'Olivia Martin', phone: '+914433221100', address: '55 Ash St, Boston', service: 'Full House Renovation', category: 'Full Home Interiors', status: 'Enquiry', dateAdded: '2026-09-15',
    measurementDate: '2026-09-25', deliveryDate: '2026-11-01'
  }
];

export type PublicService = {
  id: string;
  title: string;
  description: string;
  image: string;
};

export const publicServices: PublicService[] = [
  { id: 's1', title: 'Custom Curtains & Blinds', description: 'Premium window treatments tailored to your space.', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80' },
  { id: 's2', title: 'Modular Wardrobes', description: 'Smart storage solutions with elegant finishes.', image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80' },
  { id: 's3', title: 'Full Home Interiors', description: 'Complete end-to-end interior design and execution.', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80' },
  { id: 's4', title: 'Luxury Furniture', description: 'Handcrafted sofas, beds, and dining sets.', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80' },
];
