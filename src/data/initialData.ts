import { Product, Order, PortfolioItem } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // Housing Filter Cartridges
  {
    id: 'prod-01',
    name: '10-Inch PP Sediment Filter Cartridge (5 Micron)',
    category: 'housing_cartridge',
    budgetTier: 'Budget',
    price: 180,
    stock: 120,
    minStockAlert: 20,
    description: 'High density polypropylene melt-blown cartridge removes mud, rust, silt, and sand particles. Essential 1st stage pre-filter for all home purifiers.',
    specifications: {
      stages: '1st Stage Pre-filter',
      capacity: 'Up to 3,000 Liters',
      replacementSchedule: '2 - 3 Months',
      waterSource: 'WASA / Tube well',
      dimensions: '10" x 2.5"'
    },
    imageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    setupFee: 100
  },
  {
    id: 'prod-02',
    name: 'CTO Coconut Shell Activated Carbon Block Filter (10 Inch)',
    category: 'housing_cartridge',
    budgetTier: 'Budget',
    price: 350,
    stock: 85,
    minStockAlert: 15,
    description: 'Absorbs chlorine, foul taste, odor, pesticides and organic chemicals. Ensures crystal clear water taste.',
    specifications: {
      stages: '2nd/3rd Stage Carbon Block',
      capacity: 'Up to 5,000 Liters',
      replacementSchedule: '4 - 6 Months',
      waterSource: 'All municipal & ground water',
      dimensions: '10" x 2.5"'
    },
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80',
    isFeatured: false,
    setupFee: 100
  },
  {
    id: 'prod-03',
    name: '75 GPD Vontron RO Membrane Cartridge',
    category: 'housing_cartridge',
    budgetTier: 'Standard',
    price: 1850,
    stock: 12, // low stock alert demo!
    minStockAlert: 15,
    description: '0.0001 Micron ultra-fine Reverse Osmosis membrane. Removes 99% dissolved solids (TDS), arsenic, heavy metals, bacteria and viruses.',
    specifications: {
      stages: 'RO Core Stage',
      capacity: '75 Gallons Per Day (283 LPD)',
      replacementSchedule: '18 - 24 Months',
      warranty: '6 Months Performance Guarantee',
      dimensions: 'Standard 1812 RO Housing'
    },
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    setupFee: 300
  },
  {
    id: 'prod-04',
    name: 'Heavy Duty 20-Inch Jumbo Blue Filter Housing with Bracket',
    category: 'housing_cartridge',
    budgetTier: 'Standard',
    price: 3200,
    stock: 24,
    minStockAlert: 5,
    description: 'Whole-house pre-filtration housing for main line connection. Protects entire home plumbing, water heaters and taps from iron silt.',
    specifications: {
      stages: 'Main Line Whole House Pre-Filter',
      capacity: 'High Flow Rate 15-20 GPM',
      replacementSchedule: 'Housing permanent, Cartridge 3-6 mos',
      dimensions: '20" Jumbo Big Blue (4.5" diameter)'
    },
    imageUrl: 'https://images.unsplash.com/photo-1527239441953-1afd06437d0c?auto=format&fit=crop&w=600&q=80',
    isFeatured: false,
    setupFee: 500
  },

  // RO Machines
  {
    id: 'prod-05',
    name: '5-Stage Mineral RO Water Purifier (Under Sink / Wall Mount)',
    category: 'ro_machine',
    budgetTier: 'Standard',
    price: 12500,
    stock: 18,
    minStockAlert: 5,
    description: 'Complete Reverse Osmosis system with mineral cartridge. Ideal for homes with TDS up to 1500 PPM. Includes 3.2G steel storage tank and luxury faucet.',
    specifications: {
      stages: '5 Stages (PP + GAC + CTO + 75GPD RO + Mineral)',
      capacity: '75 Gallons Per Day (11.8 Liters/Hour)',
      replacementSchedule: 'Cartridges 3-12 months',
      warranty: '1 Year Full Electrical Warranty',
      waterSource: 'TDS up to 1500 PPM, Ground/WASA'
    },
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    setupFee: 800
  },
  {
    id: 'prod-06',
    name: 'Smart Touch Hot/Cold Cabinet RO Water Machine (Desktop / Office)',
    category: 'ro_machine',
    budgetTier: 'Premium',
    price: 28500,
    stock: 8,
    minStockAlert: 3,
    description: 'Premium Cabinet RO Purifier with instant Hot, Cold, and Normal water dispensing. Digital TDS display, child safety lock, and UV sterilizer.',
    specifications: {
      stages: '6 Stages RO + UV + Post Alkaline',
      capacity: '100 GPD (15.5 L/Hour) + 8L Tank',
      replacementSchedule: 'Automated filter indicator on display',
      warranty: '1 Year Warranty + 2 Free Servicings',
      dimensions: '310 x 380 x 520 mm'
    },
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    setupFee: 1000
  },
  {
    id: 'prod-07',
    name: 'Compact Economy 6-Stage RO Purifier with Pressure Gauge',
    category: 'ro_machine',
    budgetTier: 'Budget',
    price: 9800,
    stock: 22,
    minStockAlert: 5,
    description: 'Affordable 6-stage RO system for middle-income households. Includes pressure gauge to monitor filter clogging and automatic shut-off valve.',
    specifications: {
      stages: '6 Stages (PP + GAC + CTO + RO + Taste & Odor + Bio Ceramic)',
      capacity: '50 Gallons Per Day',
      replacementSchedule: '3-6 months',
      warranty: '1 Year Motor & Adapter Warranty'
    },
    imageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80',
    isFeatured: false,
    setupFee: 600
  },

  // Electric Purifiers
  {
    id: 'prod-08',
    name: 'UV + UF Electric Water Purifier with Stainless Steel Storage',
    category: 'electric_purifier',
    budgetTier: 'Standard',
    price: 8200,
    stock: 14,
    minStockAlert: 4,
    description: 'For low TDS WASA supply water. High intensity UV Chamber kills 99.9% virus and bacteria while preserving essential natural minerals.',
    specifications: {
      stages: '4 Stages (Sediment + Activated Carbon + UV Chamber + UF Membrane)',
      capacity: '2 Liters per Minute real-time flow',
      replacementSchedule: 'UV Lamp: 8000 hours, Cartridges: 6 months',
      warranty: '1 Year Electrical Warranty'
    },
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80',
    isFeatured: false,
    setupFee: 500
  },

  // Non-Electric Purifiers
  {
    id: 'prod-09',
    name: '24-Liter Gravity Ceramic & Mineral Non-Electric Water Filter',
    category: 'non_electric',
    budgetTier: 'Budget',
    price: 3200,
    stock: 30,
    minStockAlert: 8,
    description: 'Zero electricity required. Korean ceramic dome (0.2 micron) removes cholera, typhoid, algae and rust. Mineral stone disk adds essential trace minerals.',
    specifications: {
      stages: '5-Layer Filter Cartridge + Dome + Mineral Disk',
      capacity: '24 Liters Tank Storage',
      replacementSchedule: 'Ceramic Dome 1 Year, Filter Cartridge 6 months',
      waterSource: 'Boiled or WASA municipal water'
    },
    imageUrl: 'https://images.unsplash.com/photo-1527239441953-1afd06437d0c?auto=format&fit=crop&w=600&q=80',
    isFeatured: false,
    setupFee: 200
  },

  // IRP Plant (Iron Removal Plants)
  {
    id: 'prod-10',
    name: 'Automatic FRP Tank Iron Removal Plant (IRP) for Home / Building',
    category: 'irp_plant',
    budgetTier: 'Standard',
    price: 24500,
    stock: 6,
    minStockAlert: 2,
    description: '1054 FRP Vessel loaded with Manganese Greensand, Birm, and Activated Carbon. Solves severe iron (Lal pani) and bad smell for whole home water tank.',
    specifications: {
      stages: 'Manganese Greensand + Carbon + Fine Quartz Sand + Multi-port Valve',
      capacity: '1,000 - 1,500 Liters Per Hour',
      replacementSchedule: 'Media backwash every week, Media replacement 3-4 years',
      warranty: '2 Years Vessel & Valve Warranty',
      waterSource: 'Deep Tube well with high iron up to 10 PPM'
    },
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    setupFee: 3000
  },
  {
    id: 'prod-11',
    name: 'Industrial / Commercial Dual Vessel IRP & Softener Plant (5000 LPH)',
    category: 'irp_plant',
    budgetTier: 'Premium',
    price: 85000,
    stock: 3,
    minStockAlert: 1,
    description: 'Heavy duty iron & hardness removal plant for apartment buildings, factories, offices, and garment units. Automatic backwash control valve included.',
    specifications: {
      stages: 'Dual 1465 FRP Vessels + Aeration Tank + Cation Resin Softener',
      capacity: '5,000 Liters Per Hour',
      replacementSchedule: 'Backwash automatic digital valve, resin regeneration',
      warranty: '3 Years Warranty on System & Piping'
    },
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    setupFee: 10000
  },
  {
    id: 'prod-12',
    name: 'Manganese Greensand Plus Media (25 KG Bag)',
    category: 'spare_parts',
    budgetTier: 'Standard',
    price: 3800,
    stock: 40,
    minStockAlert: 10,
    description: 'Premium catalytic filter media for iron, manganese, and hydrogen sulfide removal in IRP plants.',
    specifications: {
      capacity: '25 KG Bag',
      replacementSchedule: '3-4 Years lifecyle in IRP'
    },
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    isFeatured: false,
    setupFee: 300
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'AP-2026-001',
    customerName: 'Sabbir Rahman',
    customerPhone: '01711223344',
    customerEmail: 'sabbir@example.com',
    address: 'House 42, Road 11, Sector 4, Uttara',
    cityZone: 'Dhaka',
    items: [
      {
        productId: 'prod-05',
        productName: '5-Stage Mineral RO Water Purifier (Under Sink / Wall Mount)',
        quantity: 1,
        unitPrice: 12500,
        setupIncluded: true
      },
      {
        productId: 'prod-01',
        productName: '10-Inch PP Sediment Filter Cartridge (5 Micron)',
        quantity: 2,
        unitPrice: 180,
        setupIncluded: false
      }
    ],
    subtotal: 12860,
    setupTotal: 800,
    totalAmount: 13660,
    paymentMethod: 'bKash / Nagad',
    status: 'Completed',
    notes: 'Installed smoothly on 2nd floor kitchen. TDS dropped from 480 to 28 PPM.',
    createdAt: '2026-07-02T10:30:00Z'
  },
  {
    id: 'ord-102',
    orderNumber: 'AP-2026-002',
    customerName: 'Nusrat Jahan',
    customerPhone: '01822334455',
    customerEmail: 'nusrat@office.bd',
    address: 'Level 6, City Center, Motijheel C/A',
    cityZone: 'Dhaka',
    items: [
      {
        productId: 'prod-06',
        productName: 'Smart Touch Hot/Cold Cabinet RO Water Machine',
        quantity: 1,
        unitPrice: 28500,
        setupIncluded: true
      }
    ],
    subtotal: 28500,
    setupTotal: 1000,
    totalAmount: 29500,
    paymentMethod: 'Bank Transfer',
    status: 'Completed',
    notes: 'Corporate office setup. Faucet connection completed.',
    createdAt: '2026-07-10T14:15:00Z'
  },
  {
    id: 'ord-103',
    orderNumber: 'AP-2026-003',
    customerName: 'Engr. Tanvir Ahmed',
    customerPhone: '01933445566',
    address: 'Villa 14, Jalalabad Housing, Panchlaish',
    cityZone: 'Chittagong',
    items: [
      {
        productId: 'prod-10',
        productName: 'Automatic FRP Tank Iron Removal Plant (IRP)',
        quantity: 1,
        unitPrice: 24500,
        setupIncluded: true
      }
    ],
    subtotal: 24500,
    setupTotal: 3000,
    totalAmount: 27500,
    paymentMethod: 'Cash on Delivery',
    status: 'Installation Scheduled',
    notes: 'Very high red iron water reported. Technician armed with aeration setup.',
    createdAt: '2026-07-22T09:00:00Z'
  },
  {
    id: 'ord-104',
    orderNumber: 'AP-2026-004',
    customerName: 'Dr. Mahmudul Hasan',
    customerPhone: '01644556677',
    address: 'Flat 4B, Green Villa, Dhanmondi 27',
    cityZone: 'Dhaka',
    items: [
      {
        productId: 'prod-01',
        productName: '10-Inch PP Sediment Filter Cartridge (5 Micron)',
        quantity: 3,
        unitPrice: 180,
        setupIncluded: false
      },
      {
        productId: 'prod-02',
        productName: 'CTO Coconut Shell Activated Carbon Block Filter',
        quantity: 1,
        unitPrice: 350,
        setupIncluded: false
      },
      {
        productId: 'prod-03',
        productName: '75 GPD Vontron RO Membrane Cartridge',
        quantity: 1,
        unitPrice: 1850,
        setupIncluded: true
      }
    ],
    subtotal: 2740,
    setupTotal: 300,
    totalAmount: 3040,
    paymentMethod: 'bKash / Nagad',
    status: 'Pending',
    notes: 'Routine cartridge replacement request.',
    createdAt: '2026-07-27T16:45:00Z'
  }
];

export const INITIAL_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'port-01',
    title: '1000 GPD Commercial RO & IRP Plant Installation at Mirpur Textile',
    category: 'Commercial / Office',
    description: 'Designed and commissioned a dual-stage water treatment plant. Raw water had 8.5 PPM iron and 650 PPM TDS. Post treatment yields pure drinking water for 300+ staff.',
    beforeTds: 650,
    afterTds: 18,
    ironBeforePpm: 8.5,
    ironAfterPpm: 0.05,
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80'
    ],
    location: 'Mirpur-11, Dhaka',
    completedDate: 'June 2026',
    clientType: 'Factory'
  },
  {
    id: 'port-02',
    title: 'Whole House FRP IRP Plant Setup for 6-Story Building',
    category: 'IRP Plant',
    description: 'Installed 1252 automatic FRP Iron Removal Plant on the rooftop reservoir line. Solved severe yellow staining on bathroom tiles and clothes.',
    beforeTds: 420,
    afterTds: 380,
    ironBeforePpm: 6.2,
    ironAfterPpm: 0.1,
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527239441953-1afd06437d0c?auto=format&fit=crop&w=800&q=80'
    ],
    location: 'Bashundhara R/A, Dhaka',
    completedDate: 'May 2026',
    clientType: 'Home'
  },
  {
    id: 'port-03',
    title: 'Custom Under-Sink Mineral RO System Setup video & Demo',
    category: 'RO Setup',
    description: 'Sleek under-sink 6-stage RO machine installation with dedicated chrome gooseneck faucet and automatic leak sensor.',
    beforeTds: 520,
    afterTds: 22,
    ironBeforePpm: 1.8,
    ironAfterPpm: 0.0,
    mediaType: 'video',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-clear-water-pouring-from-a-tap-42880-large.mp4',
    galleryImages: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'
    ],
    location: 'Dhanmondi, Dhaka',
    completedDate: 'July 2026',
    clientType: 'Home'
  },
  {
    id: 'port-04',
    title: 'Hot/Cold Smart Cabinet RO Machine Installation at Tech IT Park',
    category: 'Commercial / Office',
    description: 'Set up dual smart water dispenser units connected to central WASA line with inline pre-carbon pre-treatment.',
    beforeTds: 310,
    afterTds: 15,
    ironBeforePpm: 0.8,
    ironAfterPpm: 0.0,
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [],
    location: 'Gulshan-2, Dhaka',
    completedDate: 'April 2026',
    clientType: 'Office'
  }
];
