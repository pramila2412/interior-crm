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

// Initial Mock Data
export const mockUsers: User[] = [
  { id: 'u1', name: 'Alice Super', email: 'alice@furnish.com', role: 'Superadmin' },
  { id: 'u2', name: 'Bob Admin', email: 'bob@furnish.com', role: 'Admin' },
  { id: 'u3', name: 'Charlie Manager', email: 'charlie@furnish.com', role: 'Manager' },
  { id: 'u4', name: 'Diana Staff', email: 'diana@furnish.com', role: 'Staff' },
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
