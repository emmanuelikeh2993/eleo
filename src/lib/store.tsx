'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Product,
  UserProfile,
  Order,
  OrderItem,
  AppSettings,
  OrderStatus,
  PaymentStatus,
  FulfillmentMethod,
  GoalType,
  AuthUser,
} from '@/types';
import { supabase } from '@/lib/supabase';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-crate-30-std',
    name: 'Standard Crate of 30 Fresh Eggs',
    description: 'Farm-collected daily from free-range layer pens. Firm whites and deep golden yolks.',
    pack_size: 30,
    price: 4200,
    available: true,
    category: 'standard',
  },
  {
    id: 'prod-crate-15-std',
    name: 'Half Crate (15 Eggs Carton)',
    description: 'Secure carton partition for safe hostel storage. Perfect for weekly breakfast meal prep.',
    pack_size: 15,
    price: 2200,
    available: true,
    category: 'standard',
  },
  {
    id: 'prod-crate-30-jumbo',
    name: 'Jumbo Crate of 30 Large Eggs',
    description: 'Selected extra-large grade eggs. High protein density for athletes and fitness enthusiasts.',
    pack_size: 30,
    price: 4800,
    available: true,
    category: 'jumbo',
  },
  {
    id: 'prod-crate-60-athlete',
    name: 'Double Crate (60 Eggs Athlete Bundle)',
    description: 'Two crates bundled together. Economical bulk supply for serious hostel cooks & lifters.',
    pack_size: 60,
    price: 8200,
    available: true,
    category: 'bundle',
  },
  {
    id: 'prod-pack-6-mini',
    name: 'Hostel 6-Pack Quick Carton',
    description: 'Pocket-sized quick carton. Fits directly inside small hostel mini-fridges.',
    pack_size: 6,
    price: 950,
    available: false,
    category: 'mini',
  },
];

export const INITIAL_SETTINGS: AppSettings = {
  bank_details: {
    bank_name: 'Access Bank',
    account_name: 'Olowo Olamide Emmanuel',
    account_number: '1431041473',
    instructions: 'Include your Order Number in your transfer narration for instant verification.',
  },
  delivery_fee: 300,
  campus_name: 'Main Campus Delivery Hub',
  support_whatsapp: '2348123456789',
};

interface CartItem {
  product: Product;
  quantity: number;
}

export type AppTab = 'landing' | 'store' | 'track' | 'history' | 'nutrition' | 'admin';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  userProfile: UserProfile;
  currentUser: AuthUser | null;
  orders: Order[];
  activeOrderId: string | null;
  settings: AppSettings;
  isAdmin: boolean;
  activeTab: AppTab;
  isAuthModalOpen: boolean;
  authIntent: 'order' | 'orders' | 'profile' | 'admin' | null;

  // Actions
  setActiveTab: (tab: AppTab) => void;
  openAuthModal: (intent?: 'order' | 'orders' | 'profile' | 'admin') => void;
  closeAuthModal: () => void;
  loginStudent: (phone: string, pin: string) => Promise<{ success: boolean; error?: string }>;
  registerStudent: (data: {
    name: string;
    phone: string;
    hostel: string;
    room: string;
    pin: string;
    goal?: GoalType;
  }) => Promise<{ success: boolean; error?: string }>;
  loginAdmin: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;

  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  createOrder: (params: {
    fulfillment_method: FulfillmentMethod;
    customer_note?: string;
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  updatePaymentStatus: (orderId: string, status: PaymentStatus) => Promise<void>;
  markPaymentSubmitted: (orderId: string) => Promise<void>;
  updateProduct: (updated: Product) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>;
  setActiveOrderId: (id: string | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  reorder: (order: Order) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    phone: '',
    hostel: '',
    room: '',
    goal: 'muscle',
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<AppTab>('landing');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authIntent, setAuthIntent] = useState<'order' | 'orders' | 'profile' | 'admin' | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // 1. Initial Load & Hydration
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('eleo_current_user');
      if (savedUser) {
        const parsedUser: AuthUser = JSON.parse(savedUser);
        setCurrentUser(parsedUser);
        if (parsedUser.role === 'admin') setIsAdmin(true);
        setUserProfile({
          name: parsedUser.name,
          phone: parsedUser.phone,
          hostel: parsedUser.hostel || '',
          room: parsedUser.room || '',
          goal: parsedUser.goal || 'muscle',
        });
      }

      const savedCart = localStorage.getItem('eleo_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedOrders = localStorage.getItem('eleo_orders');
      if (savedOrders) {
        const parsedOrders: Order[] = JSON.parse(savedOrders);
        setOrders(parsedOrders);
        if (parsedOrders.length > 0) {
          const lastPending = parsedOrders.find((o) => o.order_status !== 'completed' && o.order_status !== 'cancelled');
          if (lastPending) setActiveOrderId(lastPending.id);
        }
      }

      const savedActiveOrderId = localStorage.getItem('eleo_active_order_id');
      if (savedActiveOrderId) setActiveOrderId(savedActiveOrderId);
    } catch {
      // Storage unavailable
    } finally {
      setIsHydrated(true);
    }

    // 2. Fetch live data from Supabase
    async function fetchFromSupabase() {
      try {
        // Products
        const { data: dbProducts } = await supabase
          .from('products')
          .select('*')
          .order('price', { ascending: true });
        if (dbProducts && dbProducts.length > 0) {
          setProducts(dbProducts);
        }

        // Settings
        const { data: dbSettings } = await supabase.from('app_settings').select('*');
        if (dbSettings && dbSettings.length > 0) {
          const bankRow = dbSettings.find((s) => s.key === 'bank_details');
          const feeRow = dbSettings.find((s) => s.key === 'delivery_fee');
          setSettings((prev) => ({
            ...prev,
            bank_details: bankRow?.value || prev.bank_details,
            delivery_fee: feeRow?.value?.campus_flat_rate ?? prev.delivery_fee,
          }));
        }

        // Live Orders from Supabase
        const { data: dbOrders } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (*)
          `)
          .order('created_at', { ascending: false });

        if (dbOrders && dbOrders.length > 0) {
          const formattedOrders: Order[] = dbOrders.map((row: any) => ({
            id: row.id,
            order_number: row.order_number,
            user: {
              name: row.customer_name,
              phone: row.customer_phone,
              hostel: row.delivery_location.split(',')[0]?.trim() || '',
              room: row.delivery_location.split('Room')[1]?.trim() || '',
            },
            items: (row.order_items || []).map((item: any) => ({
              id: item.id,
              product_id: item.product_id,
              product_name: item.product_name,
              pack_size: item.pack_size || 30,
              quantity: item.quantity,
              unit_price: Number(item.unit_price),
              total_price: Number(item.total_price),
            })),
            subtotal: Number(row.subtotal),
            delivery_fee: Number(row.delivery_fee),
            total: Number(row.total),
            fulfillment_method: row.fulfillment_method,
            delivery_location: row.delivery_location,
            customer_note: row.customer_note || undefined,
            payment_status: row.payment_status,
            order_status: row.order_status,
            created_at: row.created_at,
          }));
          setOrders(formattedOrders);
        }
      } catch (err) {
        console.error('Error fetching Supabase data:', err);
      }
    }

    fetchFromSupabase();

    // 3. Supabase Realtime Subscription for Live Updates
    const channel = supabase
      .channel('eleo-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            const updated = payload.new as any;
            setOrders((prev) =>
              prev.map((o) =>
                o.id === updated.id
                  ? {
                      ...o,
                      payment_status: updated.payment_status,
                      order_status: updated.order_status,
                      updated_at: updated.updated_at,
                    }
                  : o
              )
            );
          } else if (payload.eventType === 'INSERT') {
            const inserted = payload.new as any;
            setOrders((prev) => {
              if (prev.some((o) => o.id === inserted.id)) return prev;
              const newOrder: Order = {
                id: inserted.id,
                order_number: inserted.order_number,
                user: {
                  name: inserted.customer_name,
                  phone: inserted.customer_phone,
                  hostel: inserted.delivery_location.split(',')[0]?.trim() || '',
                  room: inserted.delivery_location.split('Room')[1]?.trim() || '',
                },
                items: [],
                subtotal: Number(inserted.subtotal),
                delivery_fee: Number(inserted.delivery_fee),
                total: Number(inserted.total),
                fulfillment_method: inserted.fulfillment_method,
                delivery_location: inserted.delivery_location,
                customer_note: inserted.customer_note || undefined,
                payment_status: inserted.payment_status,
                order_status: inserted.order_status,
                created_at: inserted.created_at,
              };
              return [newOrder, ...prev];
            });
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            const updated = payload.new as Product;
            setProducts((prev) =>
              prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
            );
          } else if (payload.eventType === 'INSERT') {
            const inserted = payload.new as Product;
            setProducts((prev) => [...prev, inserted]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      if (currentUser) {
        localStorage.setItem('eleo_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('eleo_current_user');
      }
      localStorage.setItem('eleo_cart', JSON.stringify(cart));
      localStorage.setItem('eleo_orders', JSON.stringify(orders));
      if (activeOrderId) {
        localStorage.setItem('eleo_active_order_id', activeOrderId);
      } else {
        localStorage.removeItem('eleo_active_order_id');
      }
    } catch {
      // Storage error
    }
  }, [cart, currentUser, orders, activeOrderId, isHydrated]);

  // Auth actions
  const openAuthModal = (intent: 'order' | 'orders' | 'profile' | 'admin' = 'order') => {
    setAuthIntent(intent);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthIntent(null);
  };

  const loginStudent = async (phone: string, pin: string) => {
    const cleanPhone = phone.trim().replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      return { success: false, error: 'Please enter a valid phone number.' };
    }
    if (!pin || pin.length < 4) {
      return { success: false, error: 'PIN must be at least 4 digits.' };
    }

    try {
      // Query Supabase users table
      const { data: userRow } = await supabase
        .from('users')
        .select('*')
        .eq('phone', cleanPhone)
        .single();

      if (userRow) {
        if (userRow.pin && userRow.pin !== pin) {
          return { success: false, error: 'Incorrect PIN. Please try again.' };
        }
        const user: AuthUser = {
          id: userRow.id,
          name: userRow.name,
          phone: userRow.phone,
          hostel: userRow.hostel,
          room: userRow.room,
          goal: userRow.goal,
          role: 'student',
        };
        setCurrentUser(user);
        setIsAdmin(false);
        setUserProfile({
          name: user.name,
          phone: user.phone,
          hostel: user.hostel || '',
          room: user.room || '',
          goal: user.goal || 'muscle',
        });
        closeAuthModal();
        return { success: true };
      }
    } catch {
      // Fall through to local fallback
    }

    // Fallback demo student
    const demoStudent: AuthUser = {
      id: `usr-${Date.now()}`,
      name: 'Campus Student',
      phone: cleanPhone,
      hostel: 'Hall 4',
      room: 'Room 102',
      role: 'student',
      goal: 'muscle',
    };
    setCurrentUser(demoStudent);
    setIsAdmin(false);
    setUserProfile({
      name: demoStudent.name,
      phone: demoStudent.phone,
      hostel: demoStudent.hostel || '',
      room: demoStudent.room || '',
      goal: demoStudent.goal || 'muscle',
    });
    closeAuthModal();
    return { success: true };
  };

  const registerStudent = async (data: {
    name: string;
    phone: string;
    hostel: string;
    room: string;
    pin: string;
    goal?: GoalType;
  }) => {
    const cleanPhone = data.phone.trim().replace(/\s+/g, '');
    if (!data.name.trim()) return { success: false, error: 'Name is required.' };
    if (!cleanPhone || cleanPhone.length < 8) return { success: false, error: 'Valid phone is required.' };
    if (!data.hostel.trim() || !data.room.trim()) return { success: false, error: 'Hostel and room are required.' };
    if (!data.pin || data.pin.length < 4) return { success: false, error: 'Create a 4-digit security PIN.' };

    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      name: data.name.trim(),
      phone: cleanPhone,
      hostel: data.hostel.trim(),
      room: data.room.trim(),
      role: 'student',
      goal: data.goal || 'muscle',
    };

    // Insert to Supabase users table
    try {
      const { data: insertedUser, error } = await supabase
        .from('users')
        .upsert(
          {
            phone: cleanPhone,
            name: data.name.trim(),
            hostel: data.hostel.trim(),
            room: data.room.trim(),
            pin: data.pin,
            goal: data.goal || 'muscle',
            role: 'student',
          },
          { onConflict: 'phone' }
        )
        .select()
        .single();

      if (!error && insertedUser) {
        newUser.id = insertedUser.id;
      }
    } catch {
      // Local fallback
    }

    setCurrentUser(newUser);
    setIsAdmin(false);
    setUserProfile({
      name: newUser.name,
      phone: newUser.phone,
      hostel: newUser.hostel || '',
      room: newUser.room || '',
      goal: newUser.goal || 'muscle',
    });
    closeAuthModal();
    return { success: true };
  };

  const loginAdmin = async (password: string) => {
    if (password === 'admin123' || password === 'eleo2026') {
      const adminUser: AuthUser = {
        id: 'admin-01',
        name: 'ELEO Farm Admin',
        phone: '08000000000',
        email: 'admin@eleo.farm',
        role: 'admin',
      };
      setCurrentUser(adminUser);
      setIsAdmin(true);
      setActiveTab('admin');
      closeAuthModal();
      return { success: true };
    }
    return { success: false, error: 'Invalid admin credentials.' };
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    setActiveTab('landing');
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    if (!product.available) return;
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...profile }));
    if (currentUser) {
      setCurrentUser((prev) => (prev ? { ...prev, ...profile } : null));
    }
  };

  // Create Order in Supabase and update state
  const createOrder = async ({
    fulfillment_method,
    customer_note,
  }: {
    fulfillment_method: FulfillmentMethod;
    customer_note?: string;
  }): Promise<Order> => {
    const nextSeq = 100 + orders.length + 1;
    let orderNumber = `EGG-${String(nextSeq).padStart(6, '0')}`;
    let orderId = `ord-${Date.now()}`;

    const items: OrderItem[] = cart.map((ci) => ({
      id: `item-${Date.now()}-${ci.product.id}`,
      product_id: ci.product.id,
      product_name: ci.product.name,
      pack_size: ci.product.pack_size,
      quantity: ci.quantity,
      unit_price: ci.product.price,
      total_price: ci.product.price * ci.quantity,
    }));

    const subtotal = items.reduce((acc, curr) => acc + curr.total_price, 0);
    const delivery_fee = fulfillment_method === 'delivery' ? settings.delivery_fee : 0;
    const total = subtotal + delivery_fee;

    const delivery_location =
      fulfillment_method === 'delivery'
        ? `${userProfile.hostel}, Room ${userProfile.room}`
        : 'ELEO Campus Depot Pickup Point';

    // Insert to Supabase Orders Table
    try {
      const { data: dbOrder, error: orderErr } = await supabase
        .from('orders')
        .insert([
          {
            customer_name: userProfile.name,
            customer_phone: userProfile.phone,
            subtotal,
            delivery_fee,
            total,
            payment_status: 'unpaid',
            order_status: 'received',
            fulfillment_method,
            delivery_location,
            customer_note: customer_note || null,
          },
        ])
        .select()
        .single();

      if (!orderErr && dbOrder) {
        orderId = dbOrder.id;
        orderNumber = dbOrder.order_number;

        // Insert Order Items to Supabase
        const orderItemsRows = items.map((i) => ({
          order_id: dbOrder.id,
          product_id: i.product_id.includes('prod-') ? null : i.product_id,
          product_name: i.product_name,
          pack_size: i.pack_size,
          quantity: i.quantity,
          unit_price: i.unit_price,
          total_price: i.total_price,
        }));

        await supabase.from('order_items').insert(orderItemsRows);
      }
    } catch (err) {
      console.error('Error inserting to Supabase:', err);
    }

    const newOrder: Order = {
      id: orderId,
      order_number: orderNumber,
      user: { ...userProfile },
      items,
      subtotal,
      delivery_fee,
      total,
      fulfillment_method,
      delivery_location,
      customer_note,
      payment_status: 'unpaid',
      order_status: 'received',
      created_at: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrderId(newOrder.id);
    clearCart();

    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, order_status: status, updated_at: new Date().toISOString() } : o))
    );
    try {
      await supabase
        .from('orders')
        .update({ order_status: status, updated_at: new Date().toISOString() })
        .eq('id', orderId);
    } catch {
      // Local state already updated
    }
  };

  const updatePaymentStatus = async (orderId: string, status: PaymentStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            payment_status: status,
            order_status: status === 'confirmed' ? 'payment_confirmed' : o.order_status,
            updated_at: new Date().toISOString(),
          };
        }
        return o;
      })
    );
    try {
      await supabase
        .from('orders')
        .update({
          payment_status: status,
          order_status: status === 'confirmed' ? 'payment_confirmed' : undefined,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);
    } catch {
      // Local state already updated
    }
  };

  const markPaymentSubmitted = async (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              payment_status: 'pending_confirmation',
              updated_at: new Date().toISOString(),
            }
          : o
      )
    );
    try {
      await supabase
        .from('orders')
        .update({
          payment_status: 'pending_confirmation',
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);
    } catch {
      // Local state already updated
    }
  };

  const updateProduct = async (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    try {
      await supabase
        .from('products')
        .update({
          name: updated.name,
          description: updated.description,
          price: updated.price,
          pack_size: updated.pack_size,
          available: updated.available,
          updated_at: new Date().toISOString(),
        })
        .eq('id', updated.id);
    } catch {
      // Local state already updated
    }
  };

  const addProduct = async (newProdData: Omit<Product, 'id'>) => {
    try {
      const { data: dbProd } = await supabase
        .from('products')
        .insert([
          {
            name: newProdData.name,
            description: newProdData.description,
            price: newProdData.price,
            pack_size: newProdData.pack_size,
            available: newProdData.available,
            category: newProdData.category || 'standard',
          },
        ])
        .select()
        .single();

      if (dbProd) {
        setProducts((prev) => [...prev, dbProd]);
        return;
      }
    } catch {
      // Fallback
    }

    const fallbackProd: Product = {
      ...newProdData,
      id: `prod-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setProducts((prev) => [...prev, fallbackProd]);
  };

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    try {
      if (newSettings.bank_details) {
        await supabase
          .from('app_settings')
          .update({ value: newSettings.bank_details, updated_at: new Date().toISOString() })
          .eq('key', 'bank_details');
      }
      if (newSettings.delivery_fee !== undefined) {
        await supabase
          .from('app_settings')
          .update({
            value: { campus_flat_rate: newSettings.delivery_fee, currency: 'NGN' },
            updated_at: new Date().toISOString(),
          })
          .eq('key', 'delivery_fee');
      }
    } catch {
      // Local state already updated
    }
  };

  const reorder = (prevOrder: Order) => {
    prevOrder.items.forEach((item) => {
      const match = products.find((p) => p.name === item.product_name || p.id === item.product_id);
      if (match && match.available) {
        addToCart(match, item.quantity);
      }
    });
    setActiveTab('store');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        userProfile,
        currentUser,
        orders,
        activeOrderId,
        settings,
        isAdmin,
        activeTab,
        isAuthModalOpen,
        authIntent,
        setActiveTab,
        openAuthModal,
        closeAuthModal,
        loginStudent,
        registerStudent,
        loginAdmin,
        logout,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        updateUserProfile,
        createOrder,
        updateOrderStatus,
        updatePaymentStatus,
        markPaymentSubmitted,
        updateProduct,
        addProduct,
        updateSettings,
        setActiveOrderId,
        setIsAdmin,
        reorder,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
}
