
import { Medicine, Order, Supplier, SourcingStats } from '../types';

export const OFFICIAL_PHONE = "8707535798";

/**
 * BASE_GOVT_API_DATA
 * Emulating the free PMBJP (Jan Aushadhi) API response.
 * These are high-quality generic medicines provided at cost.
 */
const BASE_GOVT_API_DATA: Medicine[] = [
  {
    id: 'gov-001',
    name: 'Generic Paracetamol IP 500mg',
    description: 'Government provided generic paracetamol. Quality tested and authorized.',
    manufacturer: 'Jan Aushadhi (PMBJP)',
    category: 'Pain Relief',
    dosageForm: 'Tablet',
    expiryDate: '2027-01-01',
    mrp: 12.00,
    price: 8.50,
    stock: 1000,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
    requiresPrescription: false,
    sellerId: 'govt_node',
    rating: 4.9,
    reviewsCount: 8900,
    apiSource: 'jan_aushadhi',
    isGeneric: true,
    approvalStatus: 'approved'
  },
  {
    id: 'gov-002',
    name: 'Metformin Hydrochloride 500mg (Generic)',
    description: 'Standard diabetic care generic medicine under the national health scheme.',
    manufacturer: 'Jan Aushadhi (PMBJP)',
    category: 'Diabetic',
    dosageForm: 'Tablet',
    expiryDate: '2026-12-01',
    mrp: 22.00,
    price: 15.00,
    stock: 5000,
    imageUrl: 'https://images.unsplash.com/photo-1579165466741-7f35a4755657?auto=format&fit=crop&q=80&w=800',
    requiresPrescription: true,
    sellerId: 'govt_node',
    rating: 4.8,
    reviewsCount: 4200,
    apiSource: 'jan_aushadhi',
    isGeneric: true,
    approvalStatus: 'approved'
  }
];

/**
 * LOCAL_STORE
 * This holds medicines supplied by local sellers (the user) 
 * and other specialty sources.
 */
let LOCAL_STORE: Medicine[] = [
  {
    id: 'syr-001',
    name: 'Benadryl DR Syrup',
    description: 'Effective cough suppressant for dry cough. Doctor authorized.',
    manufacturer: 'Johnson & Johnson',
    category: 'Cough & Cold',
    dosageForm: 'Syrup',
    expiryDate: '2025-10-15',
    mrp: 145.00,
    price: 130.00,
    stock: 150,
    imageUrl: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&q=80&w=800',
    requiresPrescription: false,
    sellerId: 'retail_1',
    rating: 4.8,
    reviewsCount: 2400,
    apiSource: 'local',
    approvalStatus: 'approved'
  },
  {
    id: 'onc-001',
    name: 'Geftinat 250mg',
    description: 'Targeted therapy for Lung Cancer (Gefitinib). Specialty oncology medicine.',
    manufacturer: 'Natco Pharma',
    category: 'Cancer',
    dosageForm: 'Tablet',
    expiryDate: '2025-08-15',
    mrp: 10500.00,
    price: 8500.00,
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?auto=format&fit=crop&q=80&w=800',
    requiresPrescription: true,
    sellerId: 'specialty_pharm',
    rating: 4.9,
    reviewsCount: 450,
    apiSource: 'local',
    isGeneric: true,
    approvalStatus: 'approved'
  }
];

const MOCK_ORDERS: Order[] = [];

/**
 * FETCH MEDICINES
 * Merges Government API data with local supplier listings.
 */
export const fetchMedicines = async (query: string = ''): Promise<Medicine[]> => {
  // Simulate network delay for "Govt API fetch"
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const merged = [...BASE_GOVT_API_DATA, ...LOCAL_STORE];
  
  if (!query) return merged.filter(m => m.approvalStatus === 'approved');
  
  const lowerQuery = query.toLowerCase();
  return merged.filter(m => 
    (m.approvalStatus === 'approved' || m.approvalStatus === 'pending') && 
    (m.name.toLowerCase().includes(lowerQuery) || 
     m.category.toLowerCase().includes(lowerQuery) ||
     m.manufacturer.toLowerCase().includes(lowerQuery))
  );
};

/**
 * SUBMIT FOR SUPPLY
 * Allows the user (as a seller) to list their own medicine.
 * New listings are 'pending' until admin approves.
 */
export const submitMedicineForSupply = async (medicine: Omit<Medicine, 'id' | 'approvalStatus' | 'rating' | 'reviewsCount'>): Promise<Medicine> => {
  await new Promise(resolve => setTimeout(resolve, 1200));
  const newMedicine: Medicine = {
    ...medicine,
    id: `user-${Math.random().toString(36).substr(2, 5)}`,
    approvalStatus: 'pending',
    rating: 0,
    reviewsCount: 0
  };
  LOCAL_STORE.unshift(newMedicine);
  return newMedicine;
};

export const fetchPendingApprovals = async (): Promise<Medicine[]> => {
  return LOCAL_STORE.filter(m => m.approvalStatus === 'pending');
};

export const approveMedicine = async (id: string): Promise<boolean> => {
  const med = LOCAL_STORE.find(m => m.id === id);
  if (med) {
    med.approvalStatus = 'approved';
    return true;
  }
  return false;
};

export const sendOrderNotification = async (orderId: string): Promise<void> => {
  console.log(`[MediMart Alert] SMS to ${OFFICIAL_PHONE}: "You have received an order. Order ID: ${orderId}"`);
  await new Promise(resolve => setTimeout(resolve, 500));
};

export const createOrder = async (order: Omit<Order, 'id'>): Promise<Order> => {
  const newOrder: Order = {
    ...order,
    id: `DK-ORD-${Math.floor(1000 + Math.random() * 9000)}`
  };
  MOCK_ORDERS.unshift(newOrder);
  await sendOrderNotification(newOrder.id);
  return newOrder;
};

export const fetchOrders = async (userId: string): Promise<Order[]> => {
  return MOCK_ORDERS;
};

export const fetchSuppliers = async (): Promise<Supplier[]> => {
  return [
    {
      id: 'sup-001',
      name: 'National Pharma Network',
      location: 'Delhi, India',
      licenseNo: 'DL/2024/GOV',
      isGovtApproved: true,
      apiProvided: ['Jan Aushadhi Generic API'],
      rating: 4.9
    }
  ];
};

export const fetchSourcingStats = async (): Promise<SourcingStats> => {
  return {
    totalMonthlyTurnover: 5000000,
    requiredSourcingMin: 250000,
    requiredSourcingMax: 500000,
    currentSourcingValue: 420000
  };
};
