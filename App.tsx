
import React, { useState, useEffect, useContext, createContext, useRef } from 'react';
import { 
  ShoppingBag, Search, User as UserIcon, Plus, Menu, X, 
  TrendingUp, Package, ShieldCheck, AlertCircle, CreditCard, Stethoscope,
  CheckCircle2, ShoppingCart, Phone, Heart, Award, Shield, Factory, BarChart3,
  Globe, Briefcase, FileCheck, Info, MessageSquare, Accessibility, Settings,
  Type, Eye, LayoutDashboard, Truck, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin,
  UserPlus, HelpCircle, Lock, ChevronRight, CreditCard as CardIcon, LogOut, ArrowRight, Map as MapIcon, Zap
} from 'lucide-react';
import { HashRouter, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';

import { User, Medicine, CartItem, Order, Supplier, SourcingStats, AccessibilitySettings } from './types';
import { 
  fetchMedicines, OFFICIAL_PHONE, OFFICIAL_ADDRESS,
  fetchSuppliers, fetchSourcingStats, createOrder, fetchPendingApprovals, approveMedicine, submitMedicineForSupply, fetchOrders 
} from './services/api';
import { Button, Input, Card, Badge, Modal } from './components/Components';

// --- Global Leaflet type helper (since we load it via CDN script) ---
declare const L: any;

// --- Contexts ---

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string, role: 'buyer' | 'seller') => Promise<boolean>;
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

interface Toast { id: string; message: string; type?: 'success' | 'info' | 'warning'; }
interface ToastContextType { addToast: (message: string, type?: 'success' | 'info' | 'warning') => void; }
const ToastContext = createContext<ToastContextType>({} as ToastContextType);

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (updates: Partial<AccessibilitySettings>) => void;
  isSettingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
}
const AccessibilityContext = createContext<AccessibilityContextType>({} as AccessibilityContextType);

// --- Logo Component: DK Merge ---
const DKLogo = () => (
  <div className="w-11 h-11 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg transform hover:scale-105 transition-transform">
    <div className="relative font-black text-2xl tracking-tighter flex items-center justify-center leading-none">
      <span className="translate-x-1">D</span>
      <span className="-translate-x-1.5 opacity-80">K</span>
    </div>
  </div>
);

// --- Providers ---

const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false, fontSize: 'standard', reducedMotion: false, dyslexicFont: false
  });
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const updateSettings = (updates: Partial<AccessibilitySettings>) => setSettings(prev => ({ ...prev, ...updates }));

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('acc-high-contrast', settings.highContrast);
    root.classList.toggle('acc-dyslexic', settings.dyslexicFont);
    root.classList.toggle('acc-reduced-motion', settings.reducedMotion);
    root.classList.toggle('acc-font-large', settings.fontSize === 'large');
    root.classList.toggle('acc-font-extra-large', settings.fontSize === 'extra-large');
  }, [settings]);

  return <AccessibilityContext.Provider value={{ settings, updateSettings, isSettingsOpen, setSettingsOpen }}>{children}</AccessibilityContext.Provider>;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { addToast } = useContext(ToastContext);

  const login = async (email: string, pass: string) => {
    await new Promise(r => setTimeout(r, 800));
    setUser({ id: 'u123', name: 'Ayush Sharma', email, role: email.includes('admin') ? 'admin' : 'buyer' });
    addToast("Login successful! Welcome back.", "success");
    return true;
  };

  const register = async (name: string, email: string, pass: string, role: 'buyer' | 'seller') => {
    await new Promise(r => setTimeout(r, 1000));
    setUser({ id: 'u' + Math.random(), name, email, role });
    addToast("Profile created successfully!", "success");
    return true;
  };

  const logout = () => { setUser(null); addToast("Logged out safely.", "info"); };
  const toggleRole = () => {
    if (user) {
      const roles: ('buyer' | 'seller' | 'admin')[] = ['buyer', 'seller', 'admin'];
      const nextRole = roles[(roles.indexOf(user.role) + 1) % roles.length];
      setUser({ ...user, role: nextRole });
    }
  };
  return <AuthContext.Provider value={{ user, login, register, logout, toggleRole }}>{children}</AuthContext.Provider>;
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
    addToast(`${med.name} added to cart.`, 'success');
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
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 6000);
  };
  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none w-full max-w-sm px-4">
        {toasts.map(toast => (
          <div key={toast.id} className={`
            ${toast.type === 'success' ? 'bg-emerald-600' : toast.type === 'warning' ? 'bg-amber-600' : 'bg-slate-800'} 
            text-white shadow-xl px-5 py-3 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 pointer-events-auto w-full border border-white/10
          `}>
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : toast.type === 'warning' ? <AlertCircle size={18} /> : <Info size={18} />}
            <span className="text-sm font-bold tracking-tight">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// --- Accessibility Modal ---

const AccessibilityModal = () => {
  const { settings, updateSettings, isSettingsOpen, setSettingsOpen } = useContext(AccessibilityContext);

  return (
    <Modal isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} title="Accessibility Hub">
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
          <div className="flex items-center gap-3">
            <Eye size={20} className="text-emerald-600" />
            <span className="text-sm font-bold text-slate-900">High Contrast</span>
          </div>
          <button 
            onClick={() => updateSettings({ highContrast: !settings.highContrast })}
            className={`w-12 h-6 rounded-full relative transition-colors ${settings.highContrast ? 'bg-emerald-600' : 'bg-slate-300'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.highContrast ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3 ml-1 mb-2">
            <Type size={20} className="text-emerald-600" />
            <span className="text-sm font-bold text-slate-900">Font Scale</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(['standard', 'large', 'extra-large'] as const).map(size => (
              <button
                key={size}
                onClick={() => updateSettings({ fontSize: size })}
                className={`py-2 rounded-xl text-xs font-bold border-2 transition-all ${settings.fontSize === size ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-slate-100 bg-white text-slate-400'}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
          <div className="flex items-center gap-3">
            <Accessibility size={20} className="text-emerald-600" />
            <span className="text-sm font-bold text-slate-900">Dyslexic Font</span>
          </div>
          <button 
            onClick={() => updateSettings({ dyslexicFont: !settings.dyslexicFont })}
            className={`w-12 h-6 rounded-full relative transition-colors ${settings.dyslexicFont ? 'bg-emerald-600' : 'bg-slate-300'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.dyslexicFont ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
      </div>
    </Modal>
  );
};

// --- Leaflet Map Component ---

const LiveMap = ({ orderId, coords }: { orderId: string, coords: [number, number] }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      // Initialize map
      mapInstance.current = L.map(mapRef.current).setView(coords, 14);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance.current);

      // Add markers
      const deliveryIcon = L.divIcon({
        html: `<div class="bg-emerald-600 p-2 rounded-full border-2 border-white shadow-lg animate-pulse"><img src="https://img.icons8.com/ios-filled/50/ffffff/scooter.png" style="width:16px;height:16px;" /></div>`,
        className: 'custom-div-icon',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      const userIcon = L.divIcon({
        html: `<div class="bg-blue-600 p-2 rounded-full border-2 border-white shadow-lg"><img src="https://img.icons8.com/ios-filled/50/ffffff/home.png" style="width:16px;height:16px;" /></div>`,
        className: 'custom-div-icon',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      // Target Home (User Location)
      L.marker(coords, { icon: userIcon }).addTo(mapInstance.current).bindPopup("Your Home").openPopup();

      // Agent Location (Simulated nearby)
      const agentCoords: [number, number] = [coords[0] + 0.003, coords[1] + 0.003];
      L.marker(agentCoords, { icon: deliveryIcon }).addTo(mapInstance.current).bindPopup("Medicine In Transit");

      // Draw path
      L.polyline([agentCoords, coords], { color: '#10B981', weight: 4, dashArray: '10, 10', opacity: 0.6 }).addTo(mapInstance.current);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [coords]);

  return (
    <div className="relative w-full h-[300px] bg-slate-100 rounded-3xl overflow-hidden border border-slate-200">
      <div ref={mapRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-slate-100 flex items-center gap-2">
        <Zap size={14} className="text-emerald-600" />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Express Lucknow Delivery Active</span>
      </div>
    </div>
  );
};

// --- Tracking Stepper ---

const TrackingStepper = ({ status, isLocal }: { status: string, isLocal?: boolean }) => {
  const steps = [
    { label: 'Confirmed', icon: CheckCircle2, active: true },
    { label: isLocal ? 'Packing' : 'Processing', icon: Settings, active: status === 'processing' || status === 'shipped' || status === 'delivered' },
    { label: isLocal ? 'Out for Delivery' : 'Shipped', icon: Truck, active: status === 'shipped' || status === 'delivered' },
    { label: 'Received', icon: Package, active: status === 'delivered' }
  ];

  return (
    <div className="flex justify-between items-start mt-8 px-2">
      {steps.map((step, idx) => (
        <div key={idx} className="flex flex-col items-center flex-1 relative">
          <div className={`z-10 w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${step.active ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'bg-slate-100 text-slate-400'}`}>
            <step.icon size={20} />
          </div>
          <span className={`text-[9px] mt-2 font-black uppercase tracking-widest text-center max-w-[80px] leading-tight ${step.active ? 'text-emerald-700' : 'text-slate-400'}`}>{step.label}</span>
          {idx < steps.length - 1 && (
            <div className={`absolute top-5 left-1/2 w-full h-1 -z-0 rounded-full ${steps[idx + 1].active ? 'bg-emerald-600' : 'bg-slate-100'}`}></div>
          )}
        </div>
      ))}
    </div>
  );
};

// --- Navigation ---

const Navbar = () => {
  const { user, logout, toggleRole } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const { setSettingsOpen } = useContext(AccessibilityContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-3">
            <DKLogo />
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter text-slate-900 leading-none uppercase">Dawakhana</span>
              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Lucknow Health Node</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-10">
            <Link to="/" className={`text-sm font-bold transition-colors ${isActive('/') ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-600'}`}>Pharmacy</Link>
            <Link to="/about" className={`text-sm font-bold transition-colors ${isActive('/about') ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-600'}`}>About Us</Link>
            
            <div className="h-6 w-px bg-slate-200"></div>

            <div className="flex items-center gap-6">
              <button onClick={() => setSettingsOpen(true)} className="text-slate-500 hover:text-emerald-600 transition-colors" title="Accessibility"><Accessibility size={22} /></button>
              <Link to="/cart" className="relative text-slate-500 hover:text-emerald-600 transition-colors">
                <ShoppingBag size={22} />
                {cart.length > 0 && <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] w-4.5 h-4.5 flex items-center justify-center rounded-full font-black ring-2 ring-white">{cart.length}</span>}
              </Link>
            </div>

            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden group-hover:border-emerald-200 transition-colors">
                    <UserIcon size={20} />
                  </div>
                </button>
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-slate-50 z-[100]">
                  <div className="px-5 py-3 border-b border-slate-50 mb-2">
                    <p className="text-sm font-black text-slate-900">{user.name}</p>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{user.role}</p>
                  </div>
                  <button onClick={toggleRole} className="flex items-center gap-3 w-full px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-colors"><Settings size={16} /> Switch Role</button>
                  <Link to="/orders" className="flex items-center gap-3 w-full px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-colors"><Package size={16} /> My Orders</Link>
                  <hr className="my-2 border-slate-50" />
                  <button onClick={logout} className="flex items-center gap-3 w-full px-5 py-2.5 text-sm text-rose-600 hover:bg-rose-50 font-bold transition-colors"><LogOut size={16} /> Sign Out</button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link to="/login"><Button variant="ghost" size="sm" className="rounded-xl px-6">Login</Button></Link>
                <Link to="/register"><Button size="sm" className="rounded-xl px-6 shadow-md shadow-emerald-100">Register</Button></Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// --- Landing Hero ---
const LandingHero = () => (
  <section className="pt-40 pb-20 px-4 bg-gradient-to-b from-emerald-50/50 to-white overflow-hidden">
    <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
      <div className="inline-flex items-center gap-2 mb-8 px-5 py-2 bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200 shadow-sm animate-bounce">
        <Zap size={14} fill="currentColor" />
        <span className="text-xs font-black uppercase tracking-widest">35 Min Express Delivery in Alambagh, Lucknow</span>
      </div>
      <h1 className="text-6xl lg:text-8xl font-black text-slate-900 mb-8 leading-[1] tracking-tighter">Dawakhana: <span className="text-emerald-600">Health Express.</span></h1>
      <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mb-12 font-medium leading-relaxed">Uttar Pradesh's trusted partner for affordable healthcare. Verified Jan Aushadhi generics at your doorstep in under an hour.</p>
      <div className="flex flex-wrap gap-5 justify-center">
         <Link to="/pharmacy"><Button size="lg" className="h-16 px-12 text-lg font-black rounded-2xl shadow-2xl shadow-emerald-200">Shop Catalog</Button></Link>
         <Link to="/register"><Button variant="secondary" size="lg" className="h-16 px-12 text-lg font-black rounded-2xl">Create Profile</Button></Link>
      </div>
    </div>
  </section>
);

const PharmacyGrid = () => {
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
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
        <div>
          <Badge type="info" className="mb-4">Live Pharmacy</Badge>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Medical Catalog</h2>
          <p className="text-slate-500 font-medium max-w-lg mt-2">All items sourced from our Alambagh main branch sourcing node for 100% authenticity.</p>
        </div>
        <div className="w-full lg:w-[450px]">
          <Input 
            icon={Search} 
            placeholder="Search by drug name or brand..." 
            value={query} 
            onChange={e => setQuery(e.target.value)} 
            className="h-16 rounded-2xl text-lg pl-14 shadow-xl border-none ring-1 ring-slate-100" 
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-96 bg-slate-50 rounded-[2.5rem] animate-pulse"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {medicines.map(med => (
            <Card key={med.id} className="group flex flex-col h-full bg-white border-none ring-1 ring-slate-100 shadow-sm hover:shadow-2xl hover:ring-emerald-100 transition-all duration-500 rounded-[2.5rem]">
              <div className="aspect-square bg-slate-50 p-8 flex items-center justify-center relative cursor-pointer overflow-hidden rounded-t-[2.5rem]" onClick={() => setSelectedMed(med)}>
                <img src={med.imageUrl} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" alt={med.name} />
                <div className="absolute top-5 right-5 flex flex-col gap-2 items-end">
                   {med.isGeneric ? <Badge type="govt">Generic</Badge> : <Badge type="info">Premium</Badge>}
                   {med.requiresPrescription && <span className="bg-slate-900/10 text-slate-700 text-[10px] font-black px-3 py-1.5 rounded-full uppercase flex items-center gap-1 backdrop-blur-md"><Stethoscope size={12} /> Rx Required</span>}
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-white/80 backdrop-blur-md px-2 py-1 rounded-lg border border-white/20">
                  <Zap size={10} className="text-emerald-600" fill="currentColor" />
                  <span className="text-[8px] font-black uppercase text-slate-900 tracking-wider">Lucknow Express</span>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <span className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mb-2">{med.category}</span>
                <h3 className="text-lg font-black text-slate-900 mb-1 leading-tight group-hover:text-emerald-600 transition-colors line-clamp-1">{med.name}</h3>
                <p className="text-xs text-slate-400 font-medium mb-6">By {med.manufacturer}</p>
                <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center">
                   <div className="flex flex-col">
                     <span className="text-2xl font-black text-slate-900">₹{med.price}</span>
                     <span className="text-[10px] text-slate-400 font-bold line-through">MRP ₹{med.mrp}</span>
                   </div>
                   <Button size="sm" className="h-12 w-12 rounded-2xl shadow-lg shadow-emerald-100" onClick={() => addToCart(med)}><ShoppingCart size={22} /></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={!!selectedMed} onClose={() => setSelectedMed(null)} title={selectedMed?.name}>
        {selectedMed && (
          <div className="space-y-8">
             <div className="aspect-video bg-slate-50 rounded-[2rem] flex items-center justify-center p-12 border border-slate-100 relative">
               <img src={selectedMed.imageUrl} className="h-full object-contain mix-blend-multiply" alt={selectedMed.name} />
               <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-lg">
                 <Zap size={16} fill="currentColor" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Express: 35 Mins</span>
               </div>
             </div>
             <div>
                <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">{selectedMed.description}</p>
                <div className="grid grid-cols-2 gap-4 mb-10">
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Manufacturer</span>
                    <span className="font-bold text-slate-900 truncate block">{selectedMed.manufacturer}</span>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Expiry Date</span>
                    <span className="font-bold text-slate-900">{selectedMed.expiryDate}</span>
                   </div>
                </div>
                <Button className="w-full h-16 text-lg font-black rounded-2xl shadow-xl shadow-emerald-100" onClick={() => { addToCart(selectedMed); setSelectedMed(null); }}>Add to Shopping Cart</Button>
             </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await login(email, pass);
    if (ok) navigate(from, { replace: true });
    setLoading(false);
  };

  return (
    <div className="pt-32 pb-24 px-4 min-h-screen flex items-center justify-center bg-slate-50">
      <Card className="w-full max-w-md p-12 shadow-2xl rounded-[3rem] border-none animate-in fade-in slide-in-from-bottom-6">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm"><Lock size={32} /></div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Dawakhana Login</h1>
          <p className="text-slate-500 font-medium mt-2">Access your secure health profile</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <Input icon={Mail} label="Email Address" type="email" placeholder="ayush@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
          <Input icon={Lock} label="Password" type="password" placeholder="••••••••" required value={pass} onChange={e => setPass(e.target.value)} />
          <Button type="submit" className="w-full h-14 rounded-2xl font-black text-lg" isLoading={loading}>Secure Access</Button>
        </form>
      </Card>
    </div>
  );
};

const RegisterPage = () => {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await register(name, email, pass, role);
    if (ok) navigate('/');
    setLoading(false);
  };

  return (
    <div className="pt-32 pb-24 px-4 min-h-screen flex items-center justify-center bg-slate-50">
      <Card className="w-full max-w-md p-12 shadow-2xl rounded-[3rem] border-none animate-in fade-in slide-in-from-bottom-6">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm"><UserPlus size={32} /></div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Join Dawakhana</h1>
          <p className="text-slate-500 font-medium mt-2">Lucknow's digital healthcare revolution</p>
        </div>
        <form onSubmit={handleRegister} className="space-y-6">
          <Input icon={UserIcon} label="Full Name" placeholder="Ayush Sharma" required value={name} onChange={setName as any} />
          <Input icon={Mail} label="Email Address" type="email" placeholder="ayush@example.com" required value={email} onChange={setEmail as any} />
          <Input icon={Lock} label="Password" type="password" placeholder="••••••••" required value={pass} onChange={setPass as any} />
          <Button type="submit" className="w-full h-14 rounded-2xl font-black text-lg" isLoading={loading}>Create Profile</Button>
        </form>
      </Card>
    </div>
  );
};

const CartPage = () => {
  const { cart, removeFromCart, total } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleCheckoutNavigation = () => {
    const hasPrescription = cart.some(item => item.requiresPrescription);
    if (hasPrescription && !user) {
      addToast("A prescription medicine is in your cart. Please log in to continue.", "warning");
      navigate('/login', { state: { from: location, message: "Login is required for prescription orders." } });
    } else {
      navigate('/checkout');
    }
  };

  if (cart.length === 0) return (
    <div className="pt-48 pb-24 text-center min-h-screen">
      <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-300"><DKLogo /></div>
      <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Health bag is empty</h2>
      <Link to="/pharmacy"><Button size="lg" className="rounded-2xl px-12 h-16 font-black text-lg">Browse Pharmacy</Button></Link>
    </div>
  );

  return (
    <div className="pt-40 pb-24 px-4 max-w-6xl mx-auto min-h-screen">
      <h1 className="text-5xl font-black text-slate-900 mb-12 tracking-tighter flex items-center gap-4">
        Shopping Bag <Badge type="info" className="h-8 flex items-center px-4 rounded-full uppercase">{cart.length} Items</Badge>
      </h1>
      <div className="flex flex-col lg:flex-row gap-16">
        <div className="flex-1 space-y-8">
          {cart.map(item => (
            <div key={item.id} className="flex gap-8 items-center pb-10 border-b border-slate-50 group">
               <div className="w-32 h-32 bg-slate-50 rounded-[2rem] p-4 flex-shrink-0 border border-slate-50">
                  <img src={item.imageUrl} className="w-full h-full object-contain mix-blend-multiply" alt={item.name} />
               </div>
               <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">{item.name}</h4>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{item.manufacturer} • {item.dosageForm}</p>
                    </div>
                    <p className="text-2xl font-black text-slate-900">₹{item.price * item.quantity}</p>
                  </div>
                  <div className="flex justify-between items-center mt-8">
                    <div className="flex items-center gap-4">
                      <span className="px-5 py-2 bg-slate-100 rounded-full text-[11px] font-black uppercase tracking-widest text-slate-600">Qty: {item.quantity}</span>
                      {item.requiresPrescription && <Badge type="warning" className="rounded-full px-3 py-1">Rx Required</Badge>}
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-sm text-rose-500 font-black uppercase tracking-widest hover:text-rose-600 transition-colors">Remove</button>
                  </div>
               </div>
            </div>
          ))}
        </div>
        <div className="w-full lg:w-[380px]">
          <Card className="p-10 shadow-2xl rounded-[3rem] border-none ring-1 ring-slate-100 sticky top-32">
            <h3 className="text-2xl font-black mb-8 tracking-tighter">Order Summary</h3>
            <div className="space-y-4 mb-10">
              <div className="flex justify-between font-medium text-slate-500 text-sm"><span>Subtotal</span><span>₹{total}</span></div>
              <div className="flex justify-between font-medium text-slate-500 text-sm"><span>Express Delivery</span><span className="text-emerald-600 font-black">FREE</span></div>
              <div className="h-px bg-slate-50 my-6"></div>
              <div className="flex justify-between items-baseline font-black">
                <span className="text-xl tracking-tight uppercase">Payable</span>
                <span className="text-4xl">₹{total}</span>
              </div>
            </div>
            <Button className="w-full h-16 text-lg font-black rounded-2xl shadow-xl shadow-emerald-100 uppercase" onClick={handleCheckoutNavigation}>Checkout <ChevronRight size={20} className="ml-1" /></Button>
            <div className="mt-8 flex items-center gap-4 bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
               <Zap size={24} className="text-emerald-600 shrink-0" fill="currentColor" />
               <p className="text-[10px] font-bold text-emerald-800 leading-snug">Local Lucknow Address? Order now for 35-60 minute express delivery from our Alambagh main hub!</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const CheckoutPage = () => {
  const { cart, total, clearCart } = useContext(CartContext);
  const { addToast } = useContext(ToastContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleFinalOrder = async () => {
    setLoading(true);
    await createOrder({ items: cart, total, date: new Date().toLocaleDateString(), status: 'processing' });
    addToast("Order Placed! Dispatching from our Alambagh, Lucknow main branch.", "success");
    clearCart();
    setLoading(false);
    navigate('/orders');
  };

  if (cart.length === 0) return <Navigate to="/pharmacy" />;

  return (
    <div className="pt-40 pb-24 px-4 max-w-5xl mx-auto min-h-screen">
      <div className="flex items-center justify-between mb-16">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">Dawakhana Checkout</h1>
          <p className="text-slate-500 font-medium mt-2">Activating express local delivery node...</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all ${step >= 1 ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-400'}`}>1</div>
          <div className={`h-1 w-8 rounded-full ${step >= 2 ? 'bg-emerald-600' : 'bg-slate-100'}`}></div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all ${step >= 2 ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-400'}`}>2</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-10">
          {step === 1 && (
            <Card className="p-10 shadow-2xl rounded-[3rem] border-none ring-1 ring-slate-100 animate-in fade-in slide-in-from-right-8">
              <h3 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-4 uppercase"><MapPin className="text-emerald-600" /> Lucknow Address</h3>
              <div className="space-y-6">
                <Input label="Pin Code" placeholder="226005" required />
                <Input label="House No / Street / Landmark" placeholder="Azad Nagar, Alambagh..." required />
                <div className="pt-4">
                  <Button className="w-full h-16 rounded-2xl font-black text-lg uppercase" onClick={() => setStep(2)}>Next <ChevronRight size={20} className="ml-1" /></Button>
                </div>
                <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex gap-4">
                  <Truck className="text-blue-600 shrink-0" size={24} />
                  <p className="text-xs font-bold text-blue-800 uppercase">Express Zone: Alambagh/Lucknow active. Sourcing from Azad Nagar Main Hub.</p>
                </div>
              </div>
            </Card>
          )}

          {step === 2 && (
            <Card className="p-10 shadow-2xl rounded-[3rem] border-none ring-1 ring-slate-100 animate-in fade-in slide-in-from-right-8">
              <h3 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-4 uppercase"><CardIcon className="text-emerald-600" /> Secure Payment</h3>
              <div className="space-y-6">
                <Input icon={CardIcon} label="Patient Name" placeholder={user?.name || "Guest"} required />
                <div className="grid grid-cols-2 gap-6">
                  <Input label="Expiry" placeholder="MM/YY" required />
                  <Input label="CVV" placeholder="***" type="password" required />
                </div>
                <div className="flex gap-4">
                  <Button variant="ghost" className="h-16 rounded-2xl font-black text-lg flex-1" onClick={() => setStep(1)}>Back</Button>
                  <Button className="h-16 rounded-2xl font-black text-lg flex-[2] shadow-xl shadow-emerald-200 uppercase" isLoading={loading} onClick={handleFinalOrder}>Confirm Order ₹{total}</Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-8">
          <Card className="p-8 shadow-xl rounded-[3rem] border-none bg-slate-900 text-white relative overflow-hidden">
            <h4 className="text-xl font-black mb-8 relative z-10 uppercase tracking-tighter">Total Billing</h4>
            <div className="space-y-5 relative z-10">
              <div className="flex justify-between text-sm text-slate-400 font-bold uppercase tracking-widest"><span>Cart Value</span><span>₹{total}</span></div>
              <div className="flex justify-between text-sm text-emerald-400 font-black uppercase tracking-widest"><span>Express Fee</span><span>FREE</span></div>
              <div className="h-px bg-white/10 my-6"></div>
              <div className="flex justify-between items-baseline">
                <span className="font-black text-2xl tracking-tighter uppercase">Total</span>
                <span className="text-4xl font-black text-emerald-400">₹{total}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const OrderHistoryPage = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingId, setTrackingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = await fetchOrders();
      setOrders(data);
      setLoading(false);
    };
    load();
  }, []);

  if (!user) return <Navigate to="/login" state={{ message: "Please log in to view your orders." }} />;

  return (
    <div className="pt-40 pb-24 px-4 max-w-4xl mx-auto min-h-screen">
      <h1 className="text-5xl font-black text-slate-900 mb-12 tracking-tighter uppercase">Medical History</h1>
      {loading ? (
        <div className="space-y-6 animate-pulse">
           {[1,2].map(i => <div key={i} className="h-48 bg-slate-100 rounded-[2.5rem]"></div>)}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-24 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
           <DKLogo />
           <p className="text-slate-400 font-black uppercase tracking-widest text-sm mt-4">No order history recorded</p>
           <Link to="/pharmacy"><Button className="mt-8 rounded-xl px-10 uppercase">Order Now</Button></Link>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map(order => (
            <Card key={order.id} className="p-10 shadow-lg border-none ring-1 ring-slate-100 rounded-[3rem]">
              <div className="flex flex-col md:flex-row justify-between mb-8 pb-6 border-b border-slate-50">
                <div className="flex gap-10">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">DK ID</p>
                    <p className="text-sm font-black text-slate-900">#{order.id}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                    <div className="flex items-center gap-2">
                       {order.isLocal && <Zap size={12} fill="currentColor" className="text-emerald-600" />}
                       <p className={`text-sm font-black ${order.isLocal ? 'text-emerald-600' : 'text-slate-900'}`}>{order.status.toUpperCase()}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 md:mt-0 flex items-center gap-3">
                  <Button variant="secondary" size="sm" className="rounded-xl h-10 px-6 font-black uppercase" onClick={() => setTrackingId(trackingId === order.id ? null : order.id)}>
                    <MapIcon size={16} className="mr-2" /> {trackingId === order.id ? 'Hide' : 'Track'}
                  </Button>
                </div>
              </div>

              {trackingId === order.id && (
                <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="mb-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Live Tracker (Lucknow)</h3>
                        <p className="text-xs text-slate-500 font-medium">Sourced from Alambagh Hub</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">ETA</p>
                        <p className="text-lg font-black text-emerald-600">{order.estimatedArrival}</p>
                      </div>
                    </div>
                    
                    {order.isLocal && order.deliveryCoords && (
                      <div className="mb-8">
                        <LiveMap orderId={order.id} coords={order.deliveryCoords} />
                      </div>
                    )}

                    <TrackingStepper status={order.status} isLocal={order.isLocal} />
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {order.items.map((item, idx) => (
                   <div key={idx} className="flex gap-4 items-center">
                     <div className="w-12 h-12 bg-slate-50 rounded-xl p-2 border border-slate-50 flex-shrink-0">
                        <img src={item.imageUrl} className="w-full h-full object-contain mix-blend-multiply" alt={item.name} />
                     </div>
                     <div className="flex-1">
                        <h4 className="text-sm font-black text-slate-900 tracking-tight">{item.name} x {item.quantity}</h4>
                     </div>
                     <div className="text-sm font-black text-slate-900">₹{item.price * item.quantity}</div>
                   </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-baseline">
                <span className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Billing</span>
                <span className="text-2xl font-black text-slate-900 tracking-tighter">₹{order.total}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Main App Content ---
const AppContent = () => {
  const { addToast } = useContext(ToastContext);
  const { user } = useContext(AuthContext);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    if (!user) {
      const t1 = window.setTimeout(() => {
        addToast("Need medicine in Lucknow? Register for 35-minute express delivery from our Alambagh main hub!", "info");
      }, 360000); 

      const t2 = window.setTimeout(() => {
        addToast("Get up to 90% off on verified Jan Aushadhi generics at Dawakhana.", "success");
      }, 600000); 

      timersRef.current = [t1, t2];
    } else {
      timersRef.current.forEach(t => clearTimeout(t));
    }
    return () => timersRef.current.forEach(t => clearTimeout(t));
  }, [user, addToast]);

  return (
    <div className="min-h-screen flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />
      <AccessibilityModal />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<><LandingHero /><PharmacyGrid /></>} />
          <Route path="/pharmacy" element={<PharmacyGrid />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/about" element={
            <div className="pt-48 pb-24 px-4 text-center min-h-screen">
              <h2 className="text-5xl font-black mb-8 tracking-tighter uppercase">Our Lucknow Mission</h2>
              <p className="max-w-xl mx-auto text-slate-500 font-medium leading-relaxed text-lg">
                Dawakhana is Uttar Pradesh's premier digital hub for verified healthcare. 
                Based in Alambagh, we operate with a hyper-local sourcing model to ensure every citizen gets 
                the right medicine at the right price within minutes.
              </p>
              <div className="mt-16 p-10 bg-white rounded-[3rem] shadow-2xl border border-slate-50 inline-block text-left max-w-lg">
                <div className="flex items-center gap-4 mb-8">
                  <DKLogo />
                  <h4 className="font-black text-slate-900 uppercase tracking-widest text-lg">Main Branch Office</h4>
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Sourcing Node Address</p>
                    <p className="text-slate-800 font-bold text-base leading-relaxed">{OFFICIAL_ADDRESS}</p>
                    <p className="text-emerald-600 font-black text-sm mt-1 uppercase">Lucknow, UP 226005</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Direct Contact Hub</p>
                    <a href={`tel:${OFFICIAL_PHONE}`} className="text-2xl font-black text-slate-900 flex items-center gap-2 hover:text-emerald-600 transition-colors">
                      <Phone size={20} className="text-emerald-600" /> {OFFICIAL_PHONE}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          } />
        </Routes>
      </main>
      <footer className="bg-slate-900 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
           <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20 border-b border-white/5 pb-20">
             <div>
               <div className="flex items-center gap-3 mb-8">
                  <DKLogo />
                  <span className="text-3xl font-black tracking-tighter uppercase">Dawakhana</span>
                </div>
                <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs">
                  Uttar Pradesh's authorized digital health node. Headquarters: Alambagh, Lucknow.
                </p>
             </div>
             <div className="md:text-right space-y-8">
                <div>
                  <h4 className="font-black text-slate-400 mb-4 uppercase tracking-[0.3em] text-[10px]">Alambagh Hub Address</h4>
                  <p className="text-slate-300 font-medium text-sm max-w-xs leading-relaxed md:ml-auto">
                    {OFFICIAL_ADDRESS}
                  </p>
                </div>
                <div>
                  <h4 className="font-black text-slate-400 mb-4 uppercase tracking-[0.3em] text-[10px]">Contact Pharmacy Hub</h4>
                  <a href={`tel:${OFFICIAL_PHONE}`} className="text-3xl font-black text-emerald-400 hover:text-emerald-300 transition-colors block leading-none">
                    {OFFICIAL_PHONE}
                  </a>
                </div>
             </div>
           </div>
           
           <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]">© 2024 Dawakhana Lucknow Node. Hyper-local express active.</p>
              <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-600">
                <a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a>
                <a href="#" className="hover:text-emerald-400 transition-colors">Terms</a>
                <a href="#" className="hover:text-emerald-400 transition-colors">Compliance</a>
              </div>
           </div>
        </div>
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
