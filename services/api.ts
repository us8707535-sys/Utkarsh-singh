
import { Medicine, Order, Supplier, SourcingStats } from '../types';

export const OFFICIAL_PHONE = "+91-7905388194";
export const SECONDARY_PHONE = "+91-8707535798";
export const OFFICIAL_ADDRESS = "570, P N to 1/6, Azad Nagar, Alambagh, 20, Lucknow, Uttar Pradesh, 226005";

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

// Helper for business day calculation (No Sat/Sun delivery)
const getBusinessDate = (days: number) => {
  let date = new Date();
  let count = 0;
  while(count < days) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) count++;
  }
  while(date.getDay() === 0 || date.getDay() === 6) {
    date.setDate(date.getDate() + 1);
  }
  return date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
};

export const createOrder = async (order: Omit<Order, 'id'>): Promise<Order> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Logic updated to use fee to determine base ETA
  // Distance Logic: Within 40km same day, else max 3 days. Long distance 4-5 days. No weekends.
  const city = (order.address.city || '').toLowerCase().trim();
  const distance = city === 'lucknow' ? 10 : city === 'delhi' ? 500 : 80;

  let eta = "";
  if (distance <= 40) {
    const today = new Date();
    if (today.getDay() === 0 || today.getDay() === 6) {
      eta = "Next Monday";
    } else {
      eta = "Same Day (Today)";
    }
  } else if (distance > 40 && distance <= 150) {
    eta = order.deliveryFee === 50 ? getBusinessDate(1) : getBusinessDate(3);
  } else {
    eta = getBusinessDate(5);
  }
  
  const newOrder: Order = {
    ...order,
    id: `VH-ORD-${Math.floor(10000 + Math.random() * 90000)}`,
    status: 'shipped',
    estimatedArrival: eta,
    deliveryCoords: [26.8143 + (Math.random() - 0.5) * 0.01, 80.9168 + (Math.random() - 0.5) * 0.01] 
  };
  ORDERS.unshift(newOrder);
  console.log(`[VedaHealth Hub] New Order ${newOrder.id} received. Speed: ${eta}. Distance: ${distance}km.`);
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
      name: 'Veda Bharat API Hub',
      location: 'Hyderabad, India',
      licenseNo: 'LIC-2024-VEDA',
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
