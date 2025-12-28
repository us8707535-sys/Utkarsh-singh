
import React, { useState, useEffect, useContext, createContext, useRef } from 'react';
import { 
  ShoppingBag, Search, User as UserIcon, Plus, Menu, X, 
  TrendingUp, Package, ShieldCheck, AlertCircle, CreditCard, Stethoscope,
  CheckCircle2, ShoppingCart, Phone, Heart, Award, Shield, Factory, BarChart3,
  Globe, Briefcase, FileCheck, Info, MessageSquare, Accessibility, Settings,
  Type, Eye, LayoutDashboard, Truck, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin,
  UserPlus, HelpCircle, Lock, ChevronRight, CreditCard as CardIcon, LogOut, ArrowRight, Map as MapIcon, Zap,
  ArrowLeft, Building2, Map as MapUi, PhoneCall, Users, Star, Activity, ShieldAlert, ZapOff, CalendarDays
} from 'lucide-react';
import { HashRouter, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';

import { User, Medicine, CartItem, Order, Supplier, SourcingStats, AccessibilitySettings } from './types';
import { 
  fetchMedicines, OFFICIAL_PHONE, SECONDARY_PHONE, OFFICIAL_ADDRESS,
  fetchSuppliers, fetchSourcingStats, createOrder, fetchPendingApprovals, approveMedicine, submitMedicineForSupply, fetchOrders 
} from './services/api';
import { Button, Input, Card, Badge, Modal } from './components/Components';

// --- Global Leaflet type helper ---
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

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}
const SearchContext = createContext<SearchContextType>({} as SearchContextType);

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

// --- Logo Component: VH Merge ---
const VHLogo = () => (
  <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg transform hover:scale-105 transition-transform shrink-0">
    <div className="relative font-black text-3xl tracking-tighter flex items-center justify-center leading-none">
      <span className="translate-x-1.5">V</span>
      <span className="-translate-x-1 opacity-80">H</span>
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
  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
    addToast("Item removed from bag.", "info");
  };
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
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none w-full max-sm px-4">
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
      mapInstance.current = L.map(mapRef.current).setView(coords, 14);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance.current);

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

      L.marker(coords, { icon: userIcon }).addTo(mapInstance.current).bindPopup("Your Home").openPopup();
      const agentCoords: [number, number] = [coords[0] + 0.003, coords[1] + 0.003];
      L.marker(agentCoords, { icon: deliveryIcon }).addTo(mapInstance.current).bindPopup("Medicine In Transit");
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
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Express Delivery Node Active</span>
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
  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  const { setSettingsOpen } = useContext(AccessibilityContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showSearchModal, setShowSearchModal] = useState(false);

  const handleBack = () => {
    const specialPaths = ['/cart', '/orders', '/checkout', '/pharmacy', '/login', '/register', '/about'];
    if (specialPaths.includes(location.pathname)) {
      navigate('/');
    } else {
      navigate(-1);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 py-4 h-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          
          <div className="flex items-center justify-start w-1/4">
            {location.pathname !== '/' && (
              <button 
                onClick={handleBack}
                className="p-3 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all group"
                title="Go Back"
              >
                <ArrowLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-center w-1/2">
            <Link to="/" className="flex items-center gap-5 group shrink-0">
              <VHLogo />
              <div className="flex flex-col">
                <span className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 leading-none uppercase group-hover:text-emerald-600 transition-colors">VedaHealth</span>
                <span className="text-[13px] md:text-sm text-emerald-600 font-bold uppercase tracking-[0.3em] whitespace-nowrap mt-2">Ayurveda & Wellness Node</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center justify-end w-1/4 gap-2 sm:gap-6">
            <button 
              onClick={() => setShowSearchModal(true)}
              className="p-3 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all"
            >
              <Search size={28} />
            </button>

            <div className="relative group">
              {user ? (
                <div className="relative">
                  <button className="flex items-center p-3 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all">
                    <UserIcon size={28} />
                  </button>
                  <div className="absolute right-0 mt-4 w-64 bg-white rounded-3xl shadow-2xl py-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-slate-50 z-[100] scale-95 group-hover:scale-100">
                    <div className="px-6 pb-4 border-b border-slate-50 mb-4">
                      <p className="text-sm font-black text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">{user.role}</p>
                    </div>
                    <button onClick={toggleRole} className="flex items-center gap-4 w-full px-6 py-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors"><Settings size={18} /> Switch Role</button>
                    <Link to="/orders" className="flex items-center gap-4 w-full px-6 py-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors"><Package size={18} /> My Orders</Link>
                    <hr className="my-4 border-slate-50" />
                    <button onClick={logout} className="flex items-center gap-4 w-full px-6 py-3 text-sm text-rose-600 hover:bg-rose-50 font-bold transition-colors"><LogOut size={18} /> Sign Out</button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <button className="p-3 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all">
                    <UserIcon size={28} />
                  </button>
                  <div className="absolute right-0 mt-4 w-56 bg-white rounded-3xl shadow-2xl py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-slate-50 z-[100] scale-95 group-hover:scale-100">
                    <Link to="/login" className="flex items-center gap-4 w-full px-6 py-3 text-xs text-slate-600 hover:bg-slate-50 transition-colors font-black uppercase tracking-widest">Sign In</Link>
                    <Link to="/register" className="flex items-center gap-4 w-full px-6 py-3 text-xs text-emerald-600 hover:bg-emerald-50 transition-colors font-black uppercase tracking-widest">Sign Up</Link>
                  </div>
                </div>
              )}
            </div>

            <Link to="/cart" className="relative p-3 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all group">
              <ShoppingBag size={28} />
              {cart.length > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-rose-500 text-white text-[11px] w-5.5 h-5.5 flex items-center justify-center rounded-full font-black ring-2 ring-white animate-bounce">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      <Modal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} title="Search Catalog">
        <div className="space-y-6">
          <Input 
            autoFocus
            icon={Search} 
            placeholder="Search wellness products..." 
            value={searchQuery} 
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (window.location.hash !== '#/' && window.location.hash !== '#/pharmacy') {
                navigate('/pharmacy');
              }
            }}
            className="h-16 rounded-2xl text-xl"
          />
          <Button className="w-full h-14 rounded-2xl uppercase font-black tracking-widest" onClick={() => setShowSearchModal(false)}>Browse Store</Button>
        </div>
      </Modal>
    </nav>
  );
};

const FeaturedCategories = () => {
  const categories = [
    { name: 'Jan Aushadhi', icon: Award, color: 'bg-orange-100 text-orange-600', desc: 'Verified Govt Generics' },
    { name: 'Pain Relief', icon: ShieldAlert, color: 'bg-rose-100 text-rose-600', desc: 'Fast Acting Relief' },
    { name: 'Diabetic Care', icon: Activity, color: 'bg-blue-100 text-blue-600', desc: 'Blood Sugar Control' },
    { name: 'Baby Care', icon: Heart, color: 'bg-pink-100 text-pink-600', desc: 'Gentle & Pure' },
    { name: 'Immunity', icon: ShieldCheck, color: 'bg-emerald-100 text-emerald-600', desc: 'Strengthen Health' },
    { name: 'Skin Care', icon: UserIcon, color: 'bg-violet-100 text-violet-600', desc: 'Dermatologist Choice' },
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <Badge type="info" className="mb-4">Specialized Care</Badge>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">Health Categories</h2>
          </div>
          <p className="text-slate-400 font-bold max-w-sm uppercase tracking-widest text-xs leading-relaxed">Curated collections of the most effective and affordable medicines for you.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat, i) => (
            <div key={i} className="group cursor-pointer">
              <div className={`aspect-square ${cat.color} rounded-[2.5rem] flex flex-col items-center justify-center p-6 transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-2xl`}>
                <cat.icon size={40} className="mb-4 transition-transform group-hover:scale-125 duration-500" />
                <h4 className="font-black uppercase tracking-tight text-center leading-tight mb-2">{cat.name}</h4>
                <span className="text-[10px] font-black opacity-60 uppercase tracking-widest text-center">{cat.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TrustSection = () => (
  <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] -ml-48 -mb-48"></div>

    <div className="max-w-7xl mx-auto px-4 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div className="space-y-12">
          <Badge type="govt" className="bg-emerald-600/20 text-emerald-400 border border-emerald-600/30">Verified Healthcare</Badge>
          <h2 className="text-6xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">Why trust <br/><span className="text-emerald-500 underline decoration-white/20 underline-offset-8">VedaHealth?</span></h2>
          <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-lg">We bridge the gap between expensive brands and high-quality government generic medicines.</p>
          <div className="grid grid-cols-2 gap-10">
            <div>
              <p className="text-5xl font-black text-white mb-2">12k+</p>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Active Patients</p>
            </div>
            <div>
              <p className="text-5xl font-black text-white mb-2">Tomorrow</p>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Earliest Delivery</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white/5 border-white/10 p-10 rounded-[3rem] backdrop-blur-sm">
            <ShieldCheck size={32} className="text-emerald-500 mb-6" />
            <h4 className="text-xl font-black uppercase mb-4 tracking-tight">Govt Approved</h4>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">Direct sourcing from Jan Aushadhi hubs ensure 100% authenticity.</p>
          </Card>
          <Card className="bg-white/5 border-white/10 p-10 rounded-[3rem] backdrop-blur-sm">
            <CreditCard size={32} className="text-blue-500 mb-6" />
            <h4 className="text-xl font-black uppercase mb-4 tracking-tight">Fair Pricing</h4>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">Transparent costs with fixed delivery rates for every urgency level.</p>
          </Card>
          <Card className="bg-white/5 border-white/10 p-10 rounded-[3rem] backdrop-blur-sm">
            <Stethoscope size={32} className="text-rose-500 mb-6" />
            <h4 className="text-xl font-black uppercase mb-4 tracking-tight">Expert Support</h4>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">Consult with pharmacists for any generic substitution queries.</p>
          </Card>
          <Card className="bg-white/5 border-white/10 p-10 rounded-[3rem] backdrop-blur-sm">
            <Truck size={32} className="text-amber-500 mb-6" />
            <h4 className="text-xl font-black uppercase mb-4 tracking-tight">Urgent Node</h4>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">Next-day delivery available for critical medical needs.</p>
          </Card>
        </div>
      </div>
    </div>
  </section>
);

const LandingHero = () => (
  <section className="pt-80 pb-24 px-4 bg-gradient-to-br from-emerald-50 via-white to-blue-50 relative overflow-hidden">
    <div className="absolute top-1/4 left-10 w-24 h-24 bg-emerald-200/40 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-blue-200/40 rounded-full blur-3xl animate-pulse delay-700"></div>
    
    <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
      <div className="inline-flex items-center gap-3 mb-12 px-8 py-3 bg-emerald-100/80 backdrop-blur-md text-emerald-700 rounded-full border border-emerald-200/50 shadow-sm animate-bounce">
        <Zap size={18} fill="currentColor" />
        <span className="text-sm font-black uppercase tracking-widest">Next-Day Health Delivery Node Active</span>
      </div>
      <h1 className="text-7xl lg:text-[11rem] font-black text-slate-900 mb-10 leading-[0.85] tracking-tighter">
        Veda<br/><span className="text-emerald-600">Health.</span>
      </h1>
      <p className="text-2xl md:text-3xl text-slate-500 max-w-4xl mb-16 font-medium leading-relaxed text-balance">
        Your premier digital hub for affordable, verified wellness. 
        <span className="text-slate-900 font-bold px-2 underline decoration-emerald-200 decoration-4">Urgent medications delivered on your terms.</span>
      </p>
      <div className="flex flex-col sm:flex-row gap-8 justify-center">
         <Link to="/pharmacy"><Button size="lg" className="h-20 px-16 text-xl font-black rounded-[2.5rem] shadow-2xl shadow-emerald-200/50 uppercase tracking-tight group overflow-hidden relative">
            <span className="relative z-10 flex items-center gap-4">Shop Now <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" /></span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
         </Button></Link>
         <Link to="/about"><Button variant="secondary" size="lg" className="h-20 px-16 text-xl font-black rounded-[2.5rem] uppercase tracking-tight hover:bg-white hover:shadow-xl transition-all">Our Mission</Button></Link>
      </div>

      <div className="mt-32 w-full grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 border-t border-slate-100 pt-16">
        {[
          { label: 'Licensed Node', val: 'Verified VH Hub', icon: ShieldCheck },
          { label: 'Jan Aushadhi', val: 'Direct Stock', icon: Factory },
          { label: 'Express Option', val: 'Next Day', icon: Zap },
          { label: 'Standard Option', val: '3-4 Days', icon: CalendarDays }
        ].map((stat, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-50 flex items-center justify-center mb-4 text-emerald-600">
              <stat.icon size={20} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-sm font-bold text-slate-900 uppercase">{stat.val}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const PharmacyGrid = () => {
  const { searchQuery } = useContext(SearchContext);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const [selectedMed, setSelectedMed] = useState<Medicine | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchMedicines(searchQuery);
      setMedicines(data);
      setLoading(false);
    };
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <section className="py-32 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="mb-24 flex flex-col md:flex-row justify-between items-end gap-10">
        <div className="max-w-2xl">
          <Badge type="info" className="mb-6 px-4 py-1.5 rounded-full">Live Catalog</Badge>
          <h2 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase leading-none">Pharma Store</h2>
          <p className="mt-8 text-slate-500 text-xl font-medium leading-relaxed">Verified medicines sourced through the VedaHealth network.</p>
        </div>
        {searchQuery && (
          <div className="bg-emerald-50 px-8 py-4 rounded-[2rem] border border-emerald-100 flex items-center gap-4">
            <Search size={20} className="text-emerald-600" />
            <span className="text-emerald-900 font-black uppercase tracking-widest text-sm">Results for: "{searchQuery}"</span>
            <button onClick={() => window.location.hash = '#/'} className="text-emerald-400 hover:text-emerald-600 ml-4"><X size={20}/></button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-[32rem] bg-slate-50 rounded-[4rem] animate-pulse"></div>)}
        </div>
      ) : medicines.length === 0 ? (
        <div className="text-center py-56 bg-slate-50 rounded-[5rem] border-2 border-dashed border-slate-200 max-w-4xl mx-auto">
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-xl">
             <Search size={50} className="text-slate-300" />
          </div>
          <h3 className="text-4xl font-black text-slate-900 mb-6 uppercase tracking-tighter">Item not in node</h3>
          <p className="text-slate-400 font-medium text-xl max-w-sm mx-auto mb-16 uppercase tracking-widest"> We are constantly expanding our sourcing nodes.</p>
          <Button variant="secondary" onClick={() => window.location.hash = '#/'} className="px-12 h-16 rounded-[2rem] font-black uppercase">Clear Filters</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {medicines.map(med => (
            <Card key={med.id} className="group flex flex-col h-full bg-white border-none ring-1 ring-slate-100 shadow-xl hover:shadow-[0_32px_64px_-16px_rgba(16,185,129,0.15)] hover:ring-emerald-100 transition-all duration-700 rounded-[3.5rem] overflow-visible">
              <div className="aspect-[4/5] bg-slate-50 p-10 flex items-center justify-center relative cursor-pointer overflow-hidden rounded-[3.5rem] ring-1 ring-slate-100 group-hover:ring-transparent transition-all" onClick={() => setSelectedMed(med)}>
                <img src={med.imageUrl} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out" alt={med.name} />
                <div className="absolute top-6 right-6 flex flex-col gap-3 items-end">
                   {med.isGeneric ? (
                     <Badge type="govt" className="px-5 py-2 text-xs rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-200">Govt Generic</Badge>
                   ) : (
                     <Badge type="info" className="px-5 py-2 text-xs rounded-2xl bg-white/90 backdrop-blur-md text-blue-600 shadow-xl">Premium</Badge>
                   )}
                   {med.requiresPrescription && (
                     <span className="bg-rose-500 text-white text-[10px] font-black px-4 py-2 rounded-2xl uppercase flex items-center gap-2 shadow-lg shadow-rose-200">
                       <Stethoscope size={14} /> Rx Required
                     </span>
                   )}
                </div>
              </div>

              <div className="p-10 flex flex-col flex-1 relative z-10">
                <span className="text-[11px] text-emerald-600 font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> {med.category}
                </span>
                <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight group-hover:text-emerald-600 transition-colors line-clamp-2 min-h-[4rem]">{med.name}</h3>
                <p className="text-base text-slate-400 font-bold uppercase tracking-widest mt-2">By {med.manufacturer}</p>
                <div className="mt-auto pt-8 border-t border-slate-50 flex justify-between items-center">
                   <div className="flex flex-col">
                     <span className="text-3xl font-black text-slate-900 tracking-tighter">₹{med.price}</span>
                     <span className="text-xs text-slate-300 font-black line-through uppercase tracking-widest">MRP ₹{med.mrp}</span>
                   </div>
                   <Button size="sm" className="h-16 w-16 rounded-3xl shadow-2xl shadow-emerald-200" onClick={() => addToCart(med)}><ShoppingCart size={28} /></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
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
      addToast("Prescription medicine detected. Please log in to safely checkout.", "warning");
      navigate('/login', { state: { from: location } });
    } else {
      navigate('/checkout');
    }
  };

  if (cart.length === 0) return (
    <div className="pt-80 pb-32 text-center min-h-screen">
      <div className="w-48 h-48 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-16 text-slate-200"><ShoppingBag size={80} /></div>
      <h2 className="text-6xl font-black text-slate-900 mb-10 tracking-tighter uppercase">Your health bag is empty</h2>
      <p className="text-slate-500 mb-20 font-medium text-2xl max-w-3xl mx-auto leading-relaxed">Add essential medicines to start your express delivery.</p>
      <Link to="/pharmacy"><Button size="lg" className="rounded-[2.5rem] px-24 h-24 font-black text-2xl uppercase shadow-2xl">Explore Pharmacy</Button></Link>
    </div>
  );

  return (
    <div className="pt-72 pb-32 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="mb-24 flex items-end justify-between">
        <h1 className="text-7xl font-black text-slate-900 tracking-tighter uppercase">Health Bag</h1>
        <Badge type="info" className="h-14 flex items-center px-10 rounded-full uppercase text-lg font-black">{cart.length} Items</Badge>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-24">
        <div className="flex-1 space-y-16">
          {cart.map(item => (
            <div key={item.id} className="flex flex-col sm:flex-row gap-16 items-center pb-16 border-b border-slate-100 group animate-in slide-in-from-left-4 duration-500">
               <div className="w-56 h-56 bg-slate-50 rounded-[4rem] p-12 flex-shrink-0 border border-slate-100">
                  <img src={item.imageUrl} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform" alt={item.name} />
               </div>
               <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-6">
                    <div>
                      <h4 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">{item.name}</h4>
                      <p className="text-base text-slate-400 font-bold uppercase tracking-[0.2em] mt-3">{item.manufacturer} • {item.dosageForm}</p>
                    </div>
                    <p className="text-5xl font-black text-slate-900 tracking-tighter">₹{item.price * item.quantity}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-center mt-12 gap-8">
                    <button onClick={() => removeFromCart(item.id)} className="text-xs text-rose-500 font-black uppercase tracking-[0.4em] hover:text-rose-600 transition-colors flex items-center gap-3"><X size={16} /> Remove Med</button>
                  </div>
               </div>
            </div>
          ))}
        </div>
        
        <div className="w-full lg:w-[500px]">
          <Card className="p-16 shadow-[0_48px_80px_-24px_rgba(0,0,0,0.1)] rounded-[5rem] border-none ring-1 ring-slate-100 sticky top-48">
            <h3 className="text-4xl font-black mb-16 tracking-tighter uppercase">Bill Summary</h3>
            <div className="space-y-8 mb-20">
              <div className="flex justify-between font-bold text-slate-400 text-lg uppercase tracking-widest"><span>Medications</span><span>₹{total}</span></div>
              <div className="flex justify-between font-bold text-slate-400 text-lg uppercase tracking-widest"><span>Logistics</span><span className="text-emerald-600 font-black">Calculated next</span></div>
              <div className="h-px bg-slate-100 my-12"></div>
            </div>
            <Button className="w-full h-24 text-3xl font-black rounded-[3rem] shadow-2xl shadow-emerald-200 uppercase tracking-tight group" onClick={handleCheckoutNavigation}>
              Checkout <ChevronRight size={40} className="ml-4" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

const CheckoutPage = () => {
  const { cart, total, clearCart } = useContext(CartContext);
  const { addToast } = useContext(ToastContext);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deliveryUrgency, setDeliveryUrgency] = useState<'standard' | 'express'>('express');

  // Address fields
  const [recipientName, setRecipientName] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('Lucknow');
  const [primaryContact, setPrimaryContact] = useState('');

  // Requirement: Standard (3-4 days) = ₹40, Express (Tomorrow) = ₹50
  const deliveryFee = deliveryUrgency === 'standard' ? 40 : 50; 
  const finalTotal = total + deliveryFee;

  // Derive distance for logic: Within 40km same day, otherwise next day/3-day max. Long distance 4-5 days.
  const distance = city.toLowerCase() === 'lucknow' ? 10 : city.toLowerCase() === 'delhi' ? 500 : 80;

  const getDisplayETA = () => {
    const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;
    
    // Delivery Logic:
    // If distance <= 40km: Same-day delivery.
    // Else: next-day or 3 days max.
    // If "Long distance" (mocking > 150km): 4-5 days.
    // No delivery on weekends.

    const calculateDate = (days: number) => {
      let date = new Date();
      let count = 0;
      while(count < days) {
        date.setDate(date.getDate() + 1);
        if (!isWeekend(date)) count++;
      }
      // Final day must also not be a weekend
      while(isWeekend(date)) {
        date.setDate(date.getDate() + 1);
      }
      return date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
    };

    if (distance <= 40) {
      const today = new Date();
      if (isWeekend(today)) return `Monday, ${calculateDate(0)}`; // Shift same-day to Monday
      return "Same Day (Today)";
    } else if (distance > 40 && distance <= 150) {
      return deliveryUrgency === 'express' ? `Express: ${calculateDate(1)}` : `Standard: ${calculateDate(3)}`;
    } else {
      return `Long Distance: ${calculateDate(5)}`;
    }
  };

  const handleFinalOrder = async () => {
    if (!recipientName || !houseNo || !pincode || !primaryContact) {
      addToast("Please provide all delivery details.", "warning");
      return;
    }

    setLoading(true);
    await createOrder({ 
      items: cart, 
      total: finalTotal,
      deliveryFee,
      date: new Date().toLocaleDateString(), 
      status: 'processing',
      isLocal: distance <= 40,
      address: {
        recipientName, houseNo, landmark, pincode, city,
        primaryContact, secondaryContact: ''
      }
    });
    addToast("VedaHealth Order Placed!", "success");
    clearCart();
    setLoading(false);
    navigate('/orders');
  };

  return (
    <div className="pt-72 pb-32 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="mb-24 flex items-center gap-12">
        <h1 className="text-7xl font-black text-slate-900 tracking-tighter uppercase leading-none">Checkout</h1>
        <div className="flex-1 h-px bg-slate-100"></div>
        <div className="flex gap-4">
          <div className={`w-4 h-4 rounded-full ${step >= 1 ? 'bg-emerald-600 shadow-lg' : 'bg-slate-200'}`}></div>
          <div className={`w-4 h-4 rounded-full ${step >= 2 ? 'bg-emerald-600 shadow-lg' : 'bg-slate-200'}`}></div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
        <div className="lg:col-span-2 space-y-20">
          {step === 1 ? (
            <div className="space-y-20">
              <Card className="p-16 shadow-2xl rounded-[5rem] border-none ring-1 ring-slate-100">
                 <h3 className="text-4xl font-black text-slate-900 flex items-center gap-6 uppercase tracking-tighter mb-12"><MapPin className="text-emerald-600" size={40} /> Shipping Node</h3>
                 <div className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       <Input label="Recipient Name" placeholder="Patient Name" required value={recipientName} onChange={e => setRecipientName(e.target.value)} className="h-18 rounded-3xl" />
                       <Input label="Phone Number" placeholder="Contact Node" required value={primaryContact} onChange={e => setPrimaryContact(e.target.value)} className="h-18 rounded-3xl" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       <Input label="City" value={city} onChange={e => setCity(e.target.value)} className="h-18 rounded-3xl" />
                       <Input label="Pincode" placeholder="Area code" value={pincode} onChange={e => setPincode(e.target.value)} className="h-18 rounded-3xl" />
                    </div>
                    <div className="bg-slate-50 p-6 rounded-2xl flex items-center gap-4">
                      <Truck className="text-slate-400" />
                      <div>
                        <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Calculated Distance</p>
                        <p className="font-bold text-slate-900">{distance} Kilometers from Alambagh Hub</p>
                      </div>
                    </div>
                 </div>
              </Card>

              <Card className="p-16 shadow-2xl rounded-[5rem] border-none ring-1 ring-slate-100">
                <h3 className="text-4xl font-black text-slate-900 flex items-center gap-6 uppercase tracking-tighter mb-12"><Zap className="text-emerald-600" size={40} /> Logistics Hub</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <button 
                    onClick={() => setDeliveryUrgency('express')}
                    className={`p-10 rounded-[3.5rem] text-left transition-all border-4 ${deliveryUrgency === 'express' ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xl shadow-emerald-200' : 'bg-slate-50 border-transparent text-slate-900 hover:bg-emerald-50'}`}
                   >
                     <div className="flex justify-between items-start mb-6">
                        <Zap size={40} fill={deliveryUrgency === 'express' ? 'currentColor' : 'none'} />
                        <span className="text-4xl font-black tracking-tighter">₹50</span>
                     </div>
                     <p className="text-2xl font-black uppercase tracking-tight mb-2">Priority Node</p>
                     <p className={`font-bold uppercase tracking-widest text-xs ${deliveryUrgency === 'express' ? 'text-white/70' : 'text-slate-400'}`}>Earliest Available Speed</p>
                   </button>

                   <button 
                    onClick={() => setDeliveryUrgency('standard')}
                    className={`p-10 rounded-[3.5rem] text-left transition-all border-4 ${deliveryUrgency === 'standard' ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xl shadow-emerald-200' : 'bg-slate-50 border-transparent text-slate-900 hover:bg-emerald-50'}`}
                   >
                     <div className="flex justify-between items-start mb-6">
                        <CalendarDays size={40} />
                        <span className="text-4xl font-black tracking-tighter">₹40</span>
                     </div>
                     <p className="text-2xl font-black uppercase tracking-tight mb-2">Economy Node</p>
                     <p className={`font-bold uppercase tracking-widest text-xs ${deliveryUrgency === 'standard' ? 'text-white/70' : 'text-slate-400'}`}>Balanced Sourcing Speed</p>
                   </button>
                </div>
                <Button className="w-full h-24 rounded-[3rem] font-black text-3xl uppercase shadow-2xl mt-12 group" onClick={() => setStep(2)}>
                  Secure Payment <ChevronRight size={40} className="ml-4" />
                </Button>
              </Card>
            </div>
          ) : (
            <Card className="p-16 shadow-2xl rounded-[5rem] border-none ring-1 ring-slate-100">
              <h3 className="text-4xl font-black text-slate-900 mb-16 flex items-center gap-6 uppercase tracking-tighter"><CreditCard className="text-emerald-600" size={40} /> Secure Node Pay</h3>
              <div className="space-y-12">
                <Input label="Card Holder" placeholder="Legal Name" className="h-18 rounded-3xl" />
                <Input label="Identity Number" placeholder="XXXX-XXXX-XXXX-XXXX" className="h-18 rounded-3xl" />
                <div className="flex flex-col sm:flex-row gap-8 pt-12">
                  <Button variant="ghost" className="h-24 rounded-[3rem] font-black text-2xl flex-1 uppercase" onClick={() => setStep(1)}>Go Back</Button>
                  <Button className="h-24 rounded-[3rem] font-black text-3xl flex-[2] shadow-2xl shadow-emerald-200 uppercase tracking-tight" isLoading={loading} onClick={handleFinalOrder}>Complete Payment ₹{finalTotal}</Button>
                </div>
              </div>
            </Card>
          )}
        </div>
        
        <div>
           <Card className="p-16 shadow-[0_48px_100px_-20px_rgba(15,23,42,0.3)] rounded-[5rem] border-none bg-slate-900 text-white sticky top-48">
              <h4 className="text-3xl font-black mb-16 uppercase tracking-tighter text-slate-400">Hub Summary</h4>
              <div className="space-y-10 mb-20">
                <div className="flex justify-between text-slate-400 font-black uppercase tracking-[0.2em] text-sm">
                  <span>Medicine Value</span>
                  <span>₹{total}</span>
                </div>
                <div className="flex justify-between text-slate-400 font-black uppercase tracking-[0.2em] text-sm">
                  <span>Logistics Node</span>
                  <span className="text-emerald-400 font-black">₹{deliveryFee}</span>
                </div>
                <div className="h-px bg-white/10 my-12"></div>
                <div className="flex justify-between items-baseline">
                  <span className="font-black text-[7rem] text-emerald-400 tracking-tighter leading-none">₹{finalTotal}</span>
                </div>
              </div>
              <div className="bg-white/5 p-12 rounded-[3.5rem] border border-white/5 space-y-4">
                 <p className="text-2xl font-black uppercase tracking-tighter text-white mb-2">{getDisplayETA()}</p>
                 <div className="h-px bg-white/10"></div>
                 <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-widest">
                   No delivery on Sat/Sun. Sourced from Alambagh Hub Node.
                 </p>
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

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="pt-72 pb-32 px-4 max-w-6xl mx-auto min-h-screen">
      <div className="mb-24">
        <Badge type="info" className="mb-6 px-4 py-2 rounded-full">Secure Hub Records</Badge>
        <h1 className="text-7xl font-black text-slate-900 tracking-tighter uppercase leading-none">Health History</h1>
      </div>

      {loading ? (
        <div className="space-y-16 animate-pulse">
           {[1,2].map(i => <div key={i} className="h-96 bg-slate-50 rounded-[5rem]"></div>)}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-64 bg-slate-50 rounded-[5rem] border-2 border-dashed border-slate-200">
           <div className="w-48 h-48 bg-white rounded-full shadow-2xl flex items-center justify-center mx-auto mb-16 transform scale-125"><VHLogo /></div>
           <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-2xl mt-8">No health records found</p>
           <Link to="/pharmacy"><Button className="mt-16 rounded-[2.5rem] px-24 h-24 uppercase font-black text-2xl shadow-2xl">Refill Hub Bag</Button></Link>
        </div>
      ) : (
        <div className="space-y-16">
          {orders.map(order => (
            <Card key={order.id} className="p-16 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.05)] border-none ring-1 ring-slate-100 rounded-[5rem]">
              <div className="flex flex-col xl:flex-row justify-between mb-16 pb-12 border-b border-slate-50 gap-12 items-start xl:items-center">
                <div className="flex flex-wrap gap-16">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.6em] mb-4">Record ID</p>
                    <p className="text-2xl font-black text-slate-900">#{order.id}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.6em] mb-4">Logistic Status</p>
                    <div className="flex items-center gap-4">
                       <Zap size={24} fill="currentColor" className="text-emerald-600" />
                       <p className={`text-2xl font-black uppercase text-emerald-600`}>{order.status}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.6em] mb-4">Hub Arrival</p>
                    <p className="text-2xl font-black text-slate-900 uppercase">{order.estimatedArrival}</p>
                  </div>
                </div>
                <Button 
                  variant="secondary" 
                  className="rounded-3xl h-18 px-12 font-black uppercase tracking-tight text-lg" 
                  onClick={() => setTrackingId(trackingId === order.id ? null : order.id)}
                >
                  {trackingId === order.id ? 'Collapse' : 'Track Hub'}
                </Button>
              </div>

              <div className="space-y-10">
                {order.items.map((item, idx) => (
                   <div key={idx} className="flex gap-10 items-center">
                     <div className="w-24 h-24 bg-slate-50 rounded-3xl p-6 border border-slate-100 flex-shrink-0">
                        <img src={item.imageUrl} className="w-full h-full object-contain mix-blend-multiply" alt={item.name} />
                     </div>
                     <div className="flex-1">
                        <h4 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-3">{item.name}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Qty: {item.quantity}</p>
                     </div>
                     <div className="text-3xl font-black text-slate-900 tracking-tighter">₹{item.price * item.quantity}</div>
                   </div>
                ))}
              </div>
              
              <div className="mt-16 pt-12 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-baseline gap-6">
                <span className="text-sm font-black text-slate-400 uppercase tracking-[0.5em]">Total Billed Node Value (Incl. ₹{order.deliveryFee} fee)</span>
                <span className="text-6xl font-black text-slate-900 tracking-tighter leading-none">₹{order.total}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const AboutPage = () => (
  <div className="pt-80 pb-32 px-4 text-center min-h-screen">
    <div className="max-w-7xl mx-auto px-4">
      <Badge type="govt" className="mb-8 px-6 py-2 rounded-full text-base">Authorized Hub</Badge>
      <h2 className="text-7xl md:text-9xl font-black mb-12 tracking-tighter uppercase leading-none">VedaHealth <br/>Mission Node.</h2>
      
      <div className="max-w-5xl mx-auto mb-32 space-y-12">
        <p className="text-slate-500 font-medium leading-relaxed text-3xl text-slate-400">
          Uttar Pradesh State Digital Wellness Hub, dedicated to medicine accessibility with our central node in <span className="text-slate-900 font-black">Alambagh, Lucknow.</span>
        </p>
        
        <div className="text-left border-l-[12px] border-emerald-600 pl-16 py-8 max-w-3xl mx-auto bg-white rounded-[3rem] shadow-xl shadow-emerald-50 mt-20">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em] mb-10">Mission Founders</p>
          <div className="space-y-8">
             <p className="text-5xl font-black text-slate-900 tracking-tighter">Utkarsh Singh</p>
             <p className="text-5xl font-black text-slate-900 tracking-tighter">Vicky Nishad</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// --- LoginPage Component ---
const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, pass);
    if (success) navigate(from, { replace: true });
    setLoading(false);
  };

  return (
    <div className="pt-80 pb-32 px-4 flex justify-center items-center min-h-screen bg-slate-50">
      <Card className="w-full max-w-2xl p-16 shadow-2xl rounded-[5rem] border-none ring-1 ring-slate-100 bg-white">
        <div className="text-center mb-16">
          <div className="inline-flex mb-8"><VHLogo /></div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Login Node</h2>
          <p className="mt-6 text-slate-400 font-bold uppercase tracking-widest text-xs">Access your healthcare dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-10">
          <Input icon={Mail} label="Email Access ID" type="email" required value={email} onChange={e => setEmail(e.target.value)} className="h-18 rounded-3xl" />
          <Input icon={Lock} label="Security Key" type="password" required value={pass} onChange={e => setPass(e.target.value)} className="h-18 rounded-3xl" />
          <Button type="submit" className="w-full h-24 rounded-[3rem] font-black text-3xl uppercase shadow-2xl group" isLoading={loading}>
            Authenticate <ArrowRight size={32} className="ml-4 group-hover:translate-x-2 transition-transform" />
          </Button>
        </form>
        <p className="mt-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
          New to the node? <Link to="/register" className="text-emerald-600 hover:underline">Register Hub</Link>
        </p>
      </Card>
    </div>
  );
};

// --- RegisterPage Component ---
const RegisterPage = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await register(name, email, pass, role);
    if (success) navigate("/");
    setLoading(false);
  };

  return (
    <div className="pt-80 pb-32 px-4 flex justify-center items-center min-h-screen bg-slate-50">
      <Card className="w-full max-w-2xl p-16 shadow-2xl rounded-[5rem] border-none ring-1 ring-slate-100 bg-white">
        <div className="text-center mb-16">
          <div className="inline-flex mb-8"><VHLogo /></div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Register Node</h2>
          <p className="mt-6 text-slate-400 font-bold uppercase tracking-widest text-xs">Join the digital health network</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-10">
          <Input icon={UserIcon} label="Full Identity Name" required value={name} onChange={e => setName(e.target.value)} className="h-18 rounded-3xl" />
          <Input icon={Mail} label="Email Access ID" type="email" required value={email} onChange={e => setEmail(e.target.value)} className="h-18 rounded-3xl" />
          <Input icon={Lock} label="Security Key" type="password" required value={pass} onChange={e => setPass(e.target.value)} className="h-18 rounded-3xl" />
          
          <div className="grid grid-cols-2 gap-6 pt-4">
            <button 
              type="button"
              onClick={() => setRole('buyer')}
              className={`py-6 rounded-3xl font-black uppercase tracking-widest text-xs border-4 transition-all ${role === 'buyer' ? 'bg-emerald-600 border-emerald-600 text-white shadow-xl' : 'bg-slate-50 border-transparent text-slate-400'}`}
            >
              Patient Node
            </button>
            <button 
              type="button"
              onClick={() => setRole('seller')}
              className={`py-6 rounded-3xl font-black uppercase tracking-widest text-xs border-4 transition-all ${role === 'seller' ? 'bg-emerald-600 border-emerald-600 text-white shadow-xl' : 'bg-slate-50 border-transparent text-slate-400'}`}
            >
              Supplier Node
            </button>
          </div>

          <Button type="submit" className="w-full h-24 rounded-[3rem] font-black text-3xl uppercase shadow-2xl group" isLoading={loading}>
            Create Profile <ArrowRight size={32} className="ml-4 group-hover:translate-x-2 transition-transform" />
          </Button>
        </form>
        <p className="mt-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
          Already registered? <Link to="/login" className="text-emerald-600 hover:underline">Login Node</Link>
        </p>
      </Card>
    </div>
  );
};

// --- Main App Wrap ---

const AppContent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { addToast } = useContext(ToastContext);
  const { user } = useContext(AuthContext);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    if (!user) {
      const t1 = window.setTimeout(() => {
        addToast("Premium health express delivery starting from ₹40 at VedaHealth!", "info");
      }, 360000); 
      timersRef.current = [t1];
    }
    return () => timersRef.current.forEach(t => clearTimeout(t));
  }, [user, addToast]);

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      <div className="min-h-screen flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
        <Navbar />
        <AccessibilityModal />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<><LandingHero /><FeaturedCategories /><TrustSection /><PharmacyGrid /></>} />
            <Route path="/pharmacy" element={<PharmacyGrid />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        
        <footer className="bg-slate-900 text-white py-32 px-4 mt-auto relative overflow-hidden">
          <div className="max-w-7xl mx-auto text-center md:text-left">
             <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-24 mb-32 border-b border-white/5 pb-32">
               <div className="max-w-md">
                 <div className="flex items-center gap-8 mb-12 justify-center md:justify-start">
                    <VHLogo />
                    <span className="text-6xl font-black tracking-tighter uppercase leading-none">VedaHealth</span>
                  </div>
                  <p className="text-slate-400 text-xl font-medium leading-relaxed mb-12">
                    Uttar Pradesh's premier digital health hub. Medicine accessibility via urgency nodes.
                  </p>
               </div>
               
               <div className="flex flex-col md:items-end gap-12">
                  <div className="flex flex-col md:items-end">
                    <h4 className="font-black text-slate-500 mb-6 uppercase tracking-[0.5em] text-xs">Hub Contacts</h4>
                    <div className="space-y-4 flex flex-col items-center md:items-end">
                      <a href={`tel:${OFFICIAL_PHONE}`} className="text-3xl sm:text-4xl font-black text-emerald-400 hover:text-white transition-all tracking-tighter flex items-center gap-4">
                        <PhoneCall size={28} /> {OFFICIAL_PHONE}
                      </a>
                      <a href={`tel:${SECONDARY_PHONE}`} className="text-3xl sm:text-4xl font-black text-blue-400 hover:text-white transition-all tracking-tighter flex items-center gap-4">
                        <PhoneCall size={28} /> {SECONDARY_PHONE}
                      </a>
                    </div>
                  </div>
               </div>
             </div>
             
             <div className="flex flex-col xl:flex-row justify-between items-center gap-12">
                <p className="text-slate-500 text-sm font-black uppercase tracking-[0.5em]">© 2024 VedaHealth Express. Sourced by Utkarsh Singh & Vicky Nishad.</p>
                <div className="flex flex-wrap justify-center gap-12 text-xs font-black uppercase tracking-[0.3em] text-slate-500">
                  <a href="#" className="hover:text-emerald-400 transition-colors">Hub Compliance</a>
                  <a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a>
                </div>
             </div>
          </div>
        </footer>
      </div>
    </SearchContext.Provider>
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
