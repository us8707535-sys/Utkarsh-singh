
import { Medicine, Order, Supplier, SourcingStats } from '../types';

export const OFFICIAL_PHONE = "+91 8707535798";
export const OFFICIAL_ADDRESS = "570, P N to 1/6, Azad Nagar, Alambagh, 20, Lucknow, Uttar Pradesh, 226005";

/**
 * MOCK_DATABASE
 * A comprehensive drug information database with pricing and authorized metadata.
 */
const MOCK_DATABASE: Medicine[] = [
  {
    id: 'dk-001',
    name: 'Generic Paracetamol IP 500mg',
    description: 'Government authorized high-quality generic paracetamol for fast relief from fever and pain.',
    manufacturer: 'Jan Aushadhi (PMBJP)',
    category: 'Pain Relief',
    dosageForm: 'Tablet',
    expiryDate: '2027-01-01',
    mrp: 15.00,
    price: 9.50,
    stock: 2500,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
    requiresPrescription: false,
    sellerId: 'govt_hub',
    rating: 4.9,
    reviewsCount: 12400,
    apiSource: 'jan_aushadhi',
    isGeneric: true,
    approvalStatus: 'approved'
  },
  {
    id: 'dk-002',
    name: 'Metformin HCl 500mg',
    description: 'Primary medication for Type 2 Diabetes management. Helps control blood sugar levels.',
    manufacturer: 'Jan Aushadhi (PMBJP)',
    category: 'Diabetic',
    dosageForm: 'Tablet',
    expiryDate: '2026-11-20',
    mrp: 24.00,
    price: 18.00,
    stock: 5000,
    imageUrl: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&q=80&w=800',
    requiresPrescription: true,
    sellerId: 'govt_hub',
    rating: 4.8,
    reviewsCount: 8200,
    apiSource: 'jan_aushadhi',
    isGeneric: true,
    approvalStatus: 'approved'
  },
  {
    id: 'dk-003',
    name: 'Salbutamol Inhaler (100mcg)',
    description: 'Fast-acting bronchodilator for quick relief from asthma attacks and COPD symptoms.',
    manufacturer: 'Cipla Health',
    category: 'Inhaler',
    dosageForm: 'Inhaler',
    expiryDate: '2025-08-15',
    mrp: 175.00,
    price: 152.00,
    stock: 450,
    imageUrl: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&q=80&w=800',
    requiresPrescription: true,
    sellerId: 'local_pharmacy_1',
    rating: 4.7,
    reviewsCount: 3100,
    apiSource: 'local',
    approvalStatus: 'approved'
  },
  {
    id: 'dk-004',
    name: 'Benadryl DR Syrup',
    description: 'Powerful cough suppressant syrup for dry cough relief. Doctor authorized.',
    manufacturer: 'Johnson & Johnson',
    category: 'Cough & Cold',
    dosageForm: 'Syrup',
    expiryDate: '2026-03-10',
    mrp: 140.00,
    price: 125.00,
    stock: 800,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
    requiresPrescription: false,
    sellerId: 'local_pharmacy_1',
    rating: 4.6,
    reviewsCount: 5600,
    apiSource: 'local',
    approvalStatus: 'approved'
  },
  {
    id: 'dk-005',
    name: 'Geftinat 250mg',
    description: 'Targeted therapy for non-small cell lung cancer. Essential oncology medicine.',
    manufacturer: 'Natco Pharma',
    category: 'Cancer',
    dosageForm: 'Tablet',
    expiryDate: '2025-06-30',
    mrp: 10200.00,
    price: 8450.00,
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?auto=format&fit=crop&q=80&w=800',
    requiresPrescription: true,
    sellerId: 'specialty_meds',
    rating: 4.9,
    reviewsCount: 520,
    apiSource: 'local',
    isGeneric: true,
    approvalStatus: 'approved'
  },
  {
    id: 'dk-006',
    name: 'Sevelamer Carbonate 800mg',
    description: 'Phosphate binder used in patients with chronic kidney disease on dialysis.',
    manufacturer: 'Sanofi Genzyme',
    category: 'Nephrology',
    dosageForm: 'Tablet',
    expiryDate: '2026-01-15',
    mrp: 2600.00,
    price: 2320.00,
    stock: 120,
    imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800',
    requiresPrescription: true,
    sellerId: 'specialty_meds',
    rating: 4.8,
    reviewsCount: 1100,
    apiSource: 'west_pharma',
    approvalStatus: 'approved'
  },
  {
    id: 'dk-007',
    name: 'Vitamin D3 60K Capsules',
    description: 'High-dose Vitamin D3 for bone health and immunity support. Soft-gel capsules.',
    manufacturer: 'Cadila Pharma',
    category: 'Vitamins',
    dosageForm: 'Capsule',
    expiryDate: '2027-05-10',
    mrp: 65.00,
    price: 48.00,
    stock: 1500,
    imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800',
    requiresPrescription: false,
    sellerId: 'govt_hub',
    rating: 4.9,
    reviewsCount: 9500,
    apiSource: 'jan_aushadhi',
    isGeneric: true,
    approvalStatus: 'approved'
  },
  {
    id: 'dk-008',
    name: 'Januvia 100mg',
    description: 'Advanced Western diabetic medication for blood sugar control in Type 2 diabetes.',
    manufacturer: 'Merck & Co.',
    category: 'Diabetic',
    dosageForm: 'Tablet',
    expiryDate: '2026-04-20',
    mrp: 1480.00,
    price: 1340.00,
    stock: 90,
    imageUrl: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&q=80&w=800',
    requiresPrescription: true,
    sellerId: 'west_distributor',
    rating: 4.8,
    reviewsCount: 4200,
    apiSource: 'west_pharma',
    approvalStatus: 'approved'
  }
];

let PENDING_SUBMISSIONS: Medicine[] = [];
const ORDERS: Order[] = [];

export const fetchMedicines = async (query: string = ''): Promise<Medicine[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  if (!query) return MOCK_DATABASE;
  const lowerQuery = query.toLowerCase();
  return MOCK_DATABASE.filter(m => 
    m.name.toLowerCase().includes(lowerQuery) || 
    m.category.toLowerCase().includes(lowerQuery) ||
    m.manufacturer.toLowerCase().includes(lowerQuery)
  );
};

export const submitMedicineForSupply = async (medicine: Omit<Medicine, 'id' | 'approvalStatus' | 'rating' | 'reviewsCount'>): Promise<Medicine> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const newMedicine: Medicine = {
    ...medicine,
    id: `pending-${Math.random().toString(36).substr(2, 5)}`,
    approvalStatus: 'pending',
    rating: 0,
    reviewsCount: 0
  };
  PENDING_SUBMISSIONS.unshift(newMedicine);
  return newMedicine;
};

export const fetchPendingApprovals = async (): Promise<Medicine[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return PENDING_SUBMISSIONS;
};

export const approveMedicine = async (id: string): Promise<boolean> => {
  const index = PENDING_SUBMISSIONS.findIndex(m => m.id === id);
  if (index !== -1) {
    const med = { ...PENDING_SUBMISSIONS[index], approvalStatus: 'approved' as const };
    MOCK_DATABASE.unshift(med);
    PENDING_SUBMISSIONS.splice(index, 1);
    return true;
  }
  return false;
};

export const createOrder = async (order: Omit<Order, 'id'>): Promise<Order> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Randomly decide if local for simulation (Lucknow/Alambagh area)
  const isLocal = Math.random() > 0.3;
  const status = isLocal ? 'shipped' : 'processing';
  const eta = isLocal ? '35 minutes' : 'Tomorrow, 9 AM';
  
  const newOrder: Order = {
    ...order,
    id: `DK-ORD-${Math.floor(10000 + Math.random() * 90000)}`,
    isLocal,
    status,
    estimatedArrival: eta,
    // Coordinates for Azad Nagar, Alambagh, Lucknow (~26.8143, 80.9168)
    deliveryCoords: isLocal ? [26.8143 + (Math.random() - 0.5) * 0.01, 80.9168 + (Math.random() - 0.5) * 0.01] : undefined 
  };
  ORDERS.unshift(newOrder);
  // SMS Alert simulation
  console.log(`[Dawakhana Notification] SMS to ${OFFICIAL_PHONE}: "New Order ${newOrder.id} received. Total: ₹${newOrder.total}"`);
  return newOrder;
};

export const fetchOrders = async (): Promise<Order[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return ORDERS;
};

export const fetchSuppliers = async (): Promise<Supplier[]> => {
  return [
    {
      id: 'sup-1',
      name: 'Bharat Pharma API Hub',
      location: 'Hyderabad, India',
      licenseNo: 'LIC-2024-BHARAT',
      isGovtApproved: true,
      apiProvided: ['Paracetamol IP', 'Metformin API'],
      rating: 4.9
    }
  ];
};

export const fetchSourcingStats = async (): Promise<SourcingStats> => {
  return {
    totalMonthlyTurnover: 8500000,
    requiredSourcingMin: 425000,
    requiredSourcingMax: 850000,
    currentSourcingValue: 620000
  };
};
