export type ProductCategory = 
  | 'housing_cartridge' 
  | 'ro_machine' 
  | 'electric_purifier' 
  | 'non_electric' 
  | 'irp_plant' 
  | 'spare_parts';

export type BudgetTier = 'Budget' | 'Standard' | 'Premium';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  budgetTier: BudgetTier;
  price: number;
  stock: number;
  minStockAlert: number;
  description: string;
  specifications: {
    stages?: string;
    capacity?: string;
    replacementSchedule?: string;
    warranty?: string;
    waterSource?: string;
    dimensions?: string;
  };
  imageUrl: string;
  isFeatured?: boolean;
  setupFee: number;
}

export type OrderStatus = 
  | 'Pending' 
  | 'Confirmed' 
  | 'Installation Scheduled' 
  | 'Completed' 
  | 'Cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  setupIncluded: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  cityZone: string;
  items: OrderItem[];
  subtotal: number;
  setupTotal: number;
  totalAmount: number;
  paymentMethod: 'Cash on Delivery' | 'bKash / Nagad' | 'Bank Transfer';
  status: OrderStatus;
  notes?: string;
  createdAt: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'RO Setup' | 'IRP Plant' | 'Home Solution' | 'Commercial / Office';
  description: string;
  beforeTds?: number;
  afterTds?: number;
  ironBeforePpm?: number;
  ironAfterPpm?: number;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  galleryImages?: string[];
  location: string;
  completedDate: string;
  clientType: 'Home' | 'Office' | 'Factory' | 'School/Institution';
}

export interface MonthlySalesReport {
  month: string; // e.g. "2026-07"
  monthName: string; // e.g. "July 2026"
  totalOrders: number;
  totalRevenue: number;
  totalSetupFees: number;
  topSellingProduct: string;
  categoryBreakdown: Record<ProductCategory, number>;
}

export interface WaterProblemInput {
  waterSource: 'Tap / WASA' | 'Deep Tube Well' | 'Pond / Surface Water' | 'Submersible Pump';
  visibleIssue: 'High Iron (Red/Rusty Water)' | 'High TDS / Salty Water' | 'Bad Odor / Chlorine' | 'Muddy / Turbid Water' | 'Hard Water Scale';
  tdsPpm?: number;
  familyMembers: number;
  budgetPreference: 'Economy' | 'Moderate' | 'High Performance';
  installationType: 'Home (Kitchen / Bathroom)' | 'Whole House / Building' | 'Office / Commercial Facility';
}

export interface AIRecommendationResult {
  recommendedSystem: string;
  systemCategory: ProductCategory;
  estimatedPrice: number;
  estimatedSetup: number;
  whyThisChoice: string;
  expectedTdsReduction: string;
  recommendedProducts: Product[];
}
