
import React, { useState, useEffect, useContext, createContext } from 'react';
import { 
  ShoppingBag, Search, User as UserIcon, Plus, Menu, X, 
  TrendingUp, Package, ShieldCheck, AlertCircle, CreditCard, Stethoscope,
  CheckCircle2, ShoppingCart, Phone, Heart, Award, Shield, Factory, BarChart3,
  Globe, Briefcase, FileCheck, Info, MessageSquare, Accessibility, Settings,
  Type, Eye, LayoutDashboard, Truck
} from 'lucide-react';
import { HashRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';

import { User, Medicine, CartItem, Order, Supplier, SourcingStats, AccessibilitySettings } from './types';
import { 
  fetchMedicines, OFFICIAL_PHONE, 
  fetchSuppliers, fetchSourcingStats, createOrder, fetchPendingApprovals, approveMedicine, submitMedicineForSupply, fetchOrders 
} from './services/api';
import { Button, Input, Card, Badge, Modal } from './components/Components';

// --- Contexts ---

interface AuthContextType {
  user: User | null;
  login: (role: 'buyer' | 'seller' | 'admin') => void;
  logout: () => void;
  toggleRole: () => void;
}
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface CartContextType {
  cart: CartItem[];
  addToCart: (med: Medicine) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  total: number;
}
const CartContext = createContext<CartContextType>({} as CartContextType);

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}
interface ToastContextType {
  addToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}
const ToastContext = createContext<ToastContextType>({} as ToastContextType);

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (updates: Partial<AccessibilitySettings>) => void;
  isSettingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
}
const AccessibilityContext = createContext<AccessibilityContextType>({} as AccessibilityContextType);

// --- Providers ---

const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    fontSize: 'standard',
    reducedMotion: false,
    dyslexicFont: false
  });
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  const updateSettings = (updates: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('acc-high-contrast', settings.highContrast);
    root.classList.toggle('acc-dyslexic', settings.dyslexicFont);
    root.classList.toggle('acc-reduced-motion', settings.reducedMotion);
    root.classList.toggle('acc-font-large', settings.fontSize === 'large');
    root.classList.toggle('acc-font-extra-large', settings.fontSize === 'extra-large');
  }, [settings]);

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings, isSettingsOpen, setSettingsOpen }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const login = (role: 'buyer' | 'seller' | 'admin') => {
    setUser({ id: 'u123', name: 'Ayush Sharma', email: 'ayush@example.com', role });
  };
  const logout = () => setUser(null);
  const toggleRole = () => {
    if (user) {
      const roles: ('buyer' | 'seller' | 'admin')[] = ['buyer', 'seller', 'admin'];
      const currentIndex = roles.indexOf(user.role);
      const nextRole = roles[(currentIndex + 1) % roles.length];
      setUser({ ...user, role: nextRole });
    }
  };
  return <AuthContext.Provider value={{ user, login, logout, toggleRole }}>{children}</AuthContext.Provider>;
};

const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { addToast } = useContext(ToastContext);
  const addToCart = (med: Medicine) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === med.id);
      if (existing) return prev.map(item => item.id === med.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...med, quantity: 1 }];
    });
    addToast(`${med.name} added to cart!`, 'success');
  };
  const removeFromCart = (id: string) => setCart(prev => prev.filter(item => item.id !== id));
  const clearCart = () => setCart([]);
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  return <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total }}>{children}</CartContext.Provider>;
};

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };
  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-3 pointer-events-none w-full max-w-sm px-4">
        {toasts.map(toast => (
          <div key={toast.id} className={`
            ${toast.type === 'success' ? 'bg-emerald-600' : toast.type === 'warning' ? 'bg-amber-600' : 'bg-slate-800'} 
            text-white shadow-2xl px-6 py-3 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto w-full border border-white/10
          `}>
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : toast.type === 'warning' ? <AlertCircle size={18} /> : <Info size={18} />}
            <span className="text-sm font-semibold">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// --- Components & Pages ---

const AccessibilityModal = () => {
  const { settings, updateSettings, isSettingsOpen, setSettingsOpen } = useContext(AccessibilityContext);

  return (
    <Modal isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} title="Accessibility Settings">
      <div className="space-y-6 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye size={20} className="text-emerald-600" />
            <div>
              <p className="font-bold text-slate-900">High Contrast</p>
              <p className="text-xs text-slate-400">Improve visibility for low vision users</p>
            </div>
          </div>
          <button 
            onClick={() => updateSettings({ highContrast: !settings.highContrast })}
            className={`w-12 h-6 rounded-full transition-colors relative ${settings.highContrast ? 'bg-emerald-600' : 'bg-slate-200'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.highContrast ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Type size={20} className="text-emerald-600" />
            <div>
              <p className="font-bold text-slate-900">Text Size</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(['standard', 'large', 'extra-large'] as const).map(size => (
              <button
                key={size}
                onClick={() => updateSettings({ fontSize: size })}
                className={`py-2 px-3 rounded-lg text-xs font-bold border-2 transition-all ${settings.fontSize === size ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-slate-100 bg-white text-slate-400'}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Accessibility size={20} className="text-emerald-600" />
            <div>
              <p className="font-bold text-slate-900">Dyslexic Font</p>
            </div>
          </div>
          <button 
            onClick={() => updateSettings({ dyslexicFont: !settings.dyslexicFont })}
            className={`w-12 h-6 rounded-full transition-colors relative ${settings.dyslexicFont ? 'bg-emerald-600' : 'bg-slate-200'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.dyslexicFont ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
      </div>
    </Modal>
  );
};

const Navbar = () => {
  const { user, login, logout, toggleRole } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const { setSettingsOpen } = useContext(AccessibilityContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#10B981] rounded-xl flex items-center justify-center text-white shadow-sm">
              <Plus size={24} strokeWidth={3} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">Davakhana</span>
              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Health First</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Pharmacy</Link>
            <Link to="/suppliers" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Govt Hub</Link>
            
            {user?.role === 'seller' && (
              <Link to="/seller" className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
                <Truck size={16} /> Supply Medicine
              </Link>
            )}
            
            {user?.role === 'admin' && (
              <Link to="/approval" className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
                <FileCheck size={16} /> Approvals
              </Link>
            )}
            
            <div className="flex items-center gap-4 border-l border-slate-200 pl-4">
              <button onClick={() => setSettingsOpen(true)} className="text-slate-600 hover:text-emerald-600"><Accessibility size={22} /></button>
              <Link to="/cart" className="relative text-slate-600 hover:text-emerald-600">
                <ShoppingBag size={22} />
                {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">{cart.length}</span>}
              </Link>
            </div>

            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100"><UserIcon size={16} /></div>
                  <span className="hidden lg:block">{user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-slate-100 z-50">
                  <button onClick={toggleRole} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Switch Role ({user.role})</button>
                  <Link to="/orders" className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">My Orders</Link>
                  <hr className="my-1 border-slate-100" />
                  <button onClick={() => { logout(); navigate('/'); }} className="block w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50">Sign Out</button>
                </div>
              </div>
            ) : (
              <Button onClick={() => login('buyer')} size="sm">Login</Button>
            )}
          </div>

          <div className="md:hidden flex items-center gap-4">
             <button onClick={() => setSettingsOpen(true)} className="text-slate-500"><Accessibility size={24} /></button>
             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-500">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const SellerDashboard = () => {
  const { addToast } = useContext(ToastContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '', manufacturer: '', category: 'Pain Relief', dosageForm: 'Tablet',
    description: '', mrp: '', price: '', stock: '', imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
    expiryDate: '2026-12-01', requiresPrescription: false
  });

  const handleSupply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitMedicineForSupply({
        ...formData,
        mrp: Number(formData.mrp),
        price: Number(formData.price),
        stock: Number(formData.stock),
        sellerId: 'user_supply_node',
        apiSource: 'local'
      });
      addToast("Supply application submitted! Awaiting Admin Approval.", "success");
      setFormData({ ...formData, name: '', description: '', mrp: '', price: '', stock: '' });
    } catch (e) {
      addToast("Failed to submit supply.", "warning");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-16 px-4 max-w-4xl mx-auto min-h-screen">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Supply My Medicine</h1>
        <p className="text-slate-500">List your authorized medicine stock to be sold on MediMart. Admin verification required.</p>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSupply} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Medicine Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <Input label="Manufacturer" required value={formData.manufacturer} onChange={e => setFormData({...formData, manufacturer: e.target.value})} />
            <div className="space-y-1.5">
               <label className="text-xs font-semibold text-slate-500">Category</label>
               <select className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-lg p-3 focus:ring-2 focus:ring-emerald-500" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option>Pain Relief</option><option>Diabetic</option><option>Cancer</option><option>Nephrology</option><option>Inhaler</option><option>Vitamins</option>
               </select>
            </div>
            <div className="space-y-1.5">
               <label className="text-xs font-semibold text-slate-500">Dosage Form</label>
               <select className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-lg p-3 focus:ring-2 focus:ring-emerald-500" value={formData.dosageForm} onChange={e => setFormData({...formData, dosageForm: e.target.value})}>
                  <option>Tablet</option><option>Capsule</option><option>Syrup</option><option>Inhaler</option><option>Injection</option>
               </select>
            </div>
          </div>
          <Input label="Short Description" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input label="MRP (₹)" type="number" required value={formData.mrp} onChange={e => setFormData({...formData, mrp: e.target.value})} />
            <Input label="Your Price (₹)" type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            <Input label="Stock (Units)" type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
          </div>
          <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl">
             <input type="checkbox" className="w-4 h-4 text-emerald-600" checked={formData.requiresPrescription} onChange={e => setFormData({...formData, requiresPrescription: e.target.checked})} />
             <label className="text-sm font-semibold text-slate-700">Requires Doctor Prescription (Rx)</label>
          </div>
          <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>Submit Stock for Approval</Button>
        </form>
      </Card>
    </div>
  );
};

const ApprovalPage = () => {
  const [pending, setPending] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useContext(ToastContext);

  const load = async () => {
    setLoading(true);
    const data = await fetchPendingApprovals();
    setPending(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id: string) => {
    const success = await approveMedicine(id);
    if (success) {
      addToast("Supply approved! Now live on catalog.", "success");
      load();
    }
  };

  if (loading) return <div className="pt-32 text-center">Loading pending supply requests...</div>;

  return (
    <div className="pt-32 pb-16 px-4 max-w-4xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3"><FileCheck className="text-emerald-500" /> Pending Supply Approval</h1>
      {pending.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
          <p className="text-slate-400 font-medium">No pending supply requests.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map(med => (
            <Card key={med.id} className="p-6 flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                   <h4 className="font-bold text-slate-900 text-lg">{med.name}</h4>
                   <Badge type="info">Local Supply</Badge>
                </div>
                <p className="text-sm text-slate-400">{med.manufacturer} • {med.dosageForm}</p>
                <div className="mt-3 grid grid-cols-3 gap-4 border-t border-slate-100 pt-3">
                   <div><span className="block text-[10px] uppercase font-bold text-slate-400">MRP</span><span className="font-bold">₹{med.mrp}</span></div>
                   <div><span className="block text-[10px] uppercase font-bold text-slate-400">Offer</span><span className="font-bold text-emerald-600">₹{med.price}</span></div>
                   <div><span className="block text-[10px] uppercase font-bold text-slate-400">Stock</span><span className="font-bold">{med.stock}</span></div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">Reject</Button>
                <Button variant="primary" size="sm" onClick={() => handleApprove(med.id)}>Approve Supply</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const ProductGrid = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const { addToCart } = useContext(CartContext);
  const [selectedMed, setSelectedMed] = useState<Medicine | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchMedicines(query);
      setMedicines(data);
      setLoading(false);
    };
    const timer = setTimeout(load, 500);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <section id="catalog" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Pharmacy Catalog</h2>
          <p className="text-slate-500">Verified medicines from Govt PMBJP API & Local Authorized Suppliers.</p>
        </div>
        <div className="w-full md:w-96">
          <Input icon={Search} placeholder="Search medicines..." value={query} onChange={e => setQuery(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
           {[1,2,3,4].map(i => <div key={i} className="h-80 bg-slate-100 rounded-2xl"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {medicines.map(med => (
            <Card key={med.id} className="flex flex-col h-full bg-white border-slate-200">
              <div className="aspect-square bg-slate-50 p-6 flex items-center justify-center relative cursor-pointer" onClick={() => setSelectedMed(med)}>
                <img src={med.imageUrl} className="w-full h-full object-contain mix-blend-multiply" alt={med.name} />
                <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                   {med.apiSource === 'jan_aushadhi' ? <Badge type="govt">Govt API</Badge> : <Badge type="info">Local</Badge>}
                   {med.requiresPrescription && <span className="bg-slate-900/10 text-slate-700 text-[9px] font-bold px-2 py-1 rounded uppercase flex items-center gap-1"><Stethoscope size={10} /> Rx</span>}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">{med.category}</span>
                <h3 className="text-base font-bold text-slate-900 mt-1 line-clamp-1">{med.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{med.manufacturer}</p>
                <div className="mt-auto pt-4 flex justify-between items-center">
                   <div>
                     <span className="text-lg font-black text-slate-900">₹{med.price}</span>
                     <span className="ml-2 text-xs text-slate-400 line-through">₹{med.mrp}</span>
                   </div>
                   <Button size="sm" className="h-10 w-10 !p-0" onClick={() => addToCart(med)}><ShoppingCart size={18} /></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={!!selectedMed} onClose={() => setSelectedMed(null)} title={selectedMed?.name}>
        {selectedMed && (
          <div className="space-y-6">
             <div className="aspect-video bg-slate-50 rounded-xl flex items-center justify-center p-4">
               <img src={selectedMed.imageUrl} className="h-full object-contain mix-blend-multiply" alt={selectedMed.name} />
             </div>
             <div>
                <div className="flex justify-between items-center mb-4">
                   <Badge type={selectedMed.apiSource === 'jan_aushadhi' ? 'govt' : 'info'}>{selectedMed.apiSource === 'jan_aushadhi' ? 'Govt Provided' : 'Local Supply'}</Badge>
                   <span className="text-2xl font-black">₹{selectedMed.price}</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">{selectedMed.description}</p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                   <div className="p-3 bg-slate-50 rounded-lg"><span className="block text-[10px] font-bold text-slate-400 uppercase">Form</span><span className="font-bold">{selectedMed.dosageForm}</span></div>
                   <div className="p-3 bg-slate-50 rounded-lg"><span className="block text-[10px] font-bold text-slate-400 uppercase">Expiry</span><span className="font-bold">{selectedMed.expiryDate}</span></div>
                </div>
                <Button className="w-full" size="lg" onClick={() => { addToCart(selectedMed); setSelectedMed(null); }}>Add to Cart</Button>
             </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

// --- Standard Pages ---
const Hero = () => (
  <section className="pt-32 pb-16 px-4 max-w-7xl mx-auto flex flex-col items-center text-center">
    <Badge type="govt" className="mb-4">Indian Health Initiative</Badge>
    <h1 className="text-5xl lg:text-7xl font-black text-slate-900 mb-6 leading-[1.1]">Trusted Care, <span className="text-emerald-500">Real Savings.</span></h1>
    <p className="text-xl text-slate-600 max-w-2xl mb-10">Access Government-verified generic medicines and local supply networks. Integrated with official Indian health APIs.</p>
    <div className="flex flex-wrap gap-4 justify-center">
       <Button size="lg" onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}>Browse Medicines</Button>
       <a href={`tel:${OFFICIAL_PHONE}`}><Button variant="secondary" size="lg" className="gap-2"><Phone size={20} /> {OFFICIAL_PHONE}</Button></a>
    </div>
  </section>
);

const Cart = () => {
  const { cart, removeFromCart, total, clearCart } = useContext(CartContext);
  const { addToast } = useContext(ToastContext);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    const order = await createOrder({ items: cart, total, date: new Date().toLocaleDateString(), status: 'processing' });
    addToast(`"You have received an order" message sent to admin!`, 'success');
    clearCart();
    setIsCheckingOut(false);
  };

  if (cart.length === 0) return <div className="pt-32 text-center min-h-screen"><h2 className="text-2xl font-bold mb-4">Cart is Empty</h2><Link to="/"><Button>Back to Shop</Button></Link></div>;

  return (
    <div className="pt-32 pb-16 px-4 max-w-4xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold mb-10">Checkout</h1>
      <div className="space-y-6">
        {cart.map(item => (
          <div key={item.id} className="flex gap-6 items-center border-b pb-6">
             <div className="w-20 h-20 bg-slate-50 rounded-lg p-2"><img src={item.imageUrl} className="w-full h-full object-contain mix-blend-multiply" /></div>
             <div className="flex-1">
                <h4 className="font-bold">{item.name}</h4>
                <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
             </div>
             <div className="text-right">
                <p className="font-bold">₹{item.price * item.quantity}</p>
                <button onClick={() => removeFromCart(item.id)} className="text-xs text-rose-500 font-bold uppercase mt-2">Remove</button>
             </div>
          </div>
        ))}
        <div className="pt-6">
          <div className="flex justify-between items-baseline mb-8">
            <span className="text-xl font-bold">Total Payable</span>
            <span className="text-3xl font-black">₹{total}</span>
          </div>
          <Button className="w-full" size="lg" isLoading={isCheckingOut} onClick={handleCheckout}>Place Order & Notify Admin</Button>
        </div>
      </div>
    </div>
  );
};

const AppContent = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <AccessibilityModal />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<><Hero /><ProductGrid /></>} />
          <Route path="/seller" element={<SellerDashboard />} />
          <Route path="/approval" element={<ApprovalPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<div className="pt-32 text-center min-h-screen">Order tracking coming soon...</div>} />
          <Route path="/suppliers" element={<div className="pt-32 text-center min-h-screen">Official Govt Supplier Hub.</div>} />
        </Routes>
      </main>
      <footer className="bg-slate-900 text-white p-12 text-center">
         <p className="text-sm text-slate-500">MediMart (Davakhana) - Powered by Govt. Health API Hub. Official Care: {OFFICIAL_PHONE}</p>
      </footer>
    </div>
  );
};

const App: React.FC = () => (
  <HashRouter>
    <AccessibilityProvider>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </AccessibilityProvider>
  </HashRouter>
);

export default App;
