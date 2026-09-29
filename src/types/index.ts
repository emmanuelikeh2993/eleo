export type GoalType = 'muscle' | 'gain' | 'lose' | 'maintain' | 'healthier';

export type PaymentStatus = 'unpaid' | 'pending_confirmation' | 'confirmed';

export type OrderStatus =
  | 'received'
  | 'payment_confirmed'
  | 'preparing'
  | 'ready'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export type FulfillmentMethod = 'pickup' | 'delivery';

export type UserRole = 'student' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  hostel?: string;
  room?: string;
  role: UserRole;
  goal?: GoalType;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  pack_size: number;
  price: number;
  available: boolean;
  category?: string;
  created_at?: string;
}

export interface UserProfile {
  id?: string;
  name: string;
  phone: string;
  hostel: string;
  room: string;
  goal?: GoalType;
}

export interface OrderItem {
  id?: string;
  product_id: string;
  product_name: string;
  pack_size: number;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Order {
  id: string;
  order_number: string;
  user: UserProfile;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  fulfillment_method: FulfillmentMethod;
  delivery_location: string;
  customer_note?: string;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  created_at: string;
  updated_at?: string;
}

export interface BankDetails {
  bank_name: string;
  account_name: string;
  account_number: string;
  instructions: string;
}

export interface AppSettings {
  bank_details: BankDetails;
  delivery_fee: number;
  campus_name: string;
  support_whatsapp: string;
}
