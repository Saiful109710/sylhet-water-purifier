import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_PORTFOLIO } from './src/data/initialData.js';
import { Product, Order, PortfolioItem, WaterProblemInput } from './src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory persistent state (seeded from initialData)
let products: Product[] = [...INITIAL_PRODUCTS];
let orders: Order[] = [...INITIAL_ORDERS];
let portfolio: PortfolioItem[] = [...INITIAL_PORTFOLIO];
let newsletterSubscribers: string[] = ['customer1@example.com', 'buyer@dhaka.bd'];
let contactInquiries: any[] = [];

// API ROUTES

// 1. Products API
app.get('/api/products', (req, res) => {
  const { category, budget, search } = req.query;
  let filtered = [...products];

  if (category && category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }
  if (budget && budget !== 'all') {
    filtered = filtered.filter(p => p.budgetTier === budget);
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  res.json({ products: filtered });
});

app.post('/api/products', (req, res) => {
  const newProduct: Product = {
    ...req.body,
    id: `prod-${Date.now()}`
  };
  products.unshift(newProduct);
  res.status(201).json({ product: newProduct });
});

app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  products[idx] = { ...products[idx], ...req.body };
  res.json({ product: products[idx] });
});

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  products = products.filter(p => p.id !== id);
  res.json({ success: true });
});

// Quick Stock Adjustment API
app.patch('/api/products/:id/stock', (req, res) => {
  const { id } = req.params;
  const { stockDelta, exactStock } = req.body;
  const product = products.find(p => p.id === id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  if (typeof exactStock === 'number') {
    product.stock = exactStock;
  } else if (typeof stockDelta === 'number') {
    product.stock = Math.max(0, product.stock + stockDelta);
  }
  res.json({ product });
});

// 2. Orders API
app.get('/api/orders', (req, res) => {
  res.json({ orders });
});

app.get('/api/orders/track', (req, res) => {
  const { query } = req.query; // order number or phone
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Order number or phone number required' });
  }
  const q = query.trim().toLowerCase();
  const found = orders.filter(
    o => o.orderNumber.toLowerCase() === q || o.customerPhone.includes(q)
  );
  res.json({ orders: found });
});

app.post('/api/orders', (req, res) => {
  const { customerName, customerPhone, customerEmail, address, cityZone, items, paymentMethod, notes } = req.body;

  if (!customerName || !customerPhone || !address || !items || !items.length) {
    return res.status(400).json({ error: 'Missing required customer order fields' });
  }

  let subtotal = 0;
  let setupTotal = 0;

  const orderItems = items.map((item: any) => {
    const prod = products.find(p => p.id === item.productId);
    const unitPrice = prod ? prod.price : item.unitPrice || 0;
    const qty = item.quantity || 1;
    const setupIncluded = !!item.setupIncluded;
    
    subtotal += unitPrice * qty;
    if (setupIncluded && prod) {
      setupTotal += prod.setupFee * qty;
    }

    // Deduct stock if available
    if (prod) {
      prod.stock = Math.max(0, prod.stock - qty);
    }

    return {
      productId: item.productId,
      productName: prod ? prod.name : item.productName || 'Water Filter Item',
      quantity: qty,
      unitPrice,
      setupIncluded
    };
  });

  const orderCount = orders.length + 101;
  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    orderNumber: `SWP-2026-${String(orderCount).padStart(3, '0')}`,
    customerName,
    customerPhone,
    customerEmail,
    address,
    cityZone: cityZone || 'Sylhet',
    items: orderItems,
    subtotal,
    setupTotal,
    totalAmount: subtotal + setupTotal,
    paymentMethod: paymentMethod || 'Cash on Delivery',
    status: 'Pending',
    notes: notes || '',
    createdAt: new Date().toISOString()
  };

  orders.unshift(newOrder);
  res.status(201).json({ order: newOrder });
});

app.put('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = orders.find(o => o.id === id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  order.status = status;
  res.json({ order });
});

// 3. Sales Analytics & Monthly Reports API
app.get('/api/analytics/monthly-report', (req, res) => {
  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const completedOrders = orders.filter(o => o.status === 'Completed').length;

  const lowStockCount = products.filter(p => p.stock <= p.minStockAlert).length;

  // Category breakdown
  const categorySales: Record<string, { count: number; revenue: number }> = {};
  orders.forEach(ord => {
    if (ord.status === 'Cancelled') return;
    ord.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      const cat = prod ? prod.category : 'other';
      if (!categorySales[cat]) {
        categorySales[cat] = { count: 0, revenue: 0 };
      }
      categorySales[cat].count += item.quantity;
      categorySales[cat].revenue += item.unitPrice * item.quantity;
    });
  });

  // Monthly summary
  const monthlyData: Record<string, { month: string; orders: number; revenue: number }> = {};
  orders.forEach(ord => {
    if (ord.status === 'Cancelled') return;
    const date = new Date(ord.createdAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthLabel = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { month: monthLabel, orders: 0, revenue: 0 };
    }
    monthlyData[monthKey].orders += 1;
    monthlyData[monthKey].revenue += ord.totalAmount;
  });

  res.json({
    summary: {
      totalRevenue,
      totalOrders,
      pendingOrders,
      completedOrders,
      lowStockCount
    },
    categorySales,
    monthlyData: Object.values(monthlyData)
  });
});

// CSV Export for Monthly Sales
app.get('/api/analytics/export-csv', (req, res) => {
  let csv = 'Order Number,Customer Name,Phone,Address,Items,Total (BDT),Status,Created At\n';
  orders.forEach(o => {
    const itemList = o.items.map(i => `${i.productName} (x${i.quantity})`).join(' | ');
    const safeName = `"${o.customerName.replace(/"/g, '""')}"`;
    const safeAddr = `"${o.address.replace(/"/g, '""')}"`;
    const safeItems = `"${itemList.replace(/"/g, '""')}"`;
    csv += `${o.orderNumber},${safeName},${o.customerPhone},${safeAddr},${safeItems},${o.totalAmount},${o.status},${o.createdAt}\n`;
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="sylhet_water_purifier_monthly_sales_report.csv"');
  res.status(200).send(csv);
});

// 4. Portfolio API
app.get('/api/portfolio', (req, res) => {
  res.json({ portfolio });
});

app.post('/api/portfolio', (req, res) => {
  const newItem: PortfolioItem = {
    ...req.body,
    id: `port-${Date.now()}`
  };
  portfolio.unshift(newItem);
  res.status(201).json({ item: newItem });
});

app.delete('/api/portfolio/:id', (req, res) => {
  const { id } = req.params;
  portfolio = portfolio.filter(p => p.id !== id);
  res.json({ success: true });
});

// 5. Contact & Newsletter API
app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }
  if (!newsletterSubscribers.includes(email)) {
    newsletterSubscribers.push(email);
  }
  res.json({ success: true, message: 'Subscribed successfully! You will receive maintenance alerts and special offers.' });
});

app.post('/api/contact', (req, res) => {
  const { name, phone, message, setupType } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and Phone number are required' });
  }
  const inquiry = {
    id: `inq-${Date.now()}`,
    name,
    phone,
    setupType: setupType || 'General Inquiry',
    message: message || '',
    createdAt: new Date().toISOString()
  };
  contactInquiries.unshift(inquiry);
  res.json({ success: true, message: 'Thank you! Our water filter technician will contact you shortly.' });
});

// 6. Gemini AI Water Recommendation
app.post('/api/ai/water-recommendation', async (req, res) => {
  const input: WaterProblemInput = req.body;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are an expert water purification technician in Bangladesh for AquaPure Filter Shop.
Given the customer's water problem:
- Source: ${input.waterSource}
- Visible Issue: ${input.visibleIssue}
- TDS Level: ${input.tdsPpm || 'Not tested (estimated)'} PPM
- Family / User Size: ${input.familyMembers} persons
- Budget Preference: ${input.budgetPreference}
- Setup Type: ${input.installationType}

Recommend the exact solution from our product offerings:
1) RO Machine (Reverse Osmosis)
2) IRP Plant (Iron Removal Plant)
3) Housing Sediment & Carbon Cartridge Pre-Filter
4) Electric UV / Non-Electric Purifier

Format your response as valid JSON with:
{
  "recommendedSystem": "Title of system e.g., Automatic FRP Iron Removal Plant (IRP) + 6-Stage RO",
  "systemCategory": "irp_plant" | "ro_machine" | "electric_purifier" | "non_electric" | "housing_cartridge",
  "estimatedPrice": number in BDT,
  "estimatedSetup": number in BDT,
  "whyThisChoice": "2-3 clear concise bullet points explaining why this fits their specific TDS and Iron issue in Bangladesh.",
  "expectedTdsReduction": "e.g. Drops TDS from 600+ PPM to under 30 PPM, Iron reduced to 0.05 PPM",
  "recommendedProductIds": ["prod-05", "prod-10"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const responseText = response.text || '';
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const recProducts = products.filter(p =>
          parsed.recommendedProductIds?.includes(p.id) || p.category === parsed.systemCategory
        ).slice(0, 3);

        return res.json({
          ...parsed,
          recommendedProducts: recProducts
        });
      }
    }
  } catch (err) {
    console.error('Gemini AI Recommendation Error, fallback triggered:', err);
  }

  // Fallback Rule-based engine if Gemini key is absent or errors
  let recCategory: any = 'ro_machine';
  let title = '5-Stage Mineral RO Water Purifier + Pre-housing Filter';
  let estPrice = 12500;
  let estSetup = 800;
  let why = 'RO Reverse Osmosis membrane removes 99% dissolved solids, arsenic, and heavy metals. Includes 5-micron pre-filter to catch rust and mud.';
  let tdsReduction = 'Reduces TDS by 90-95% down to under 30 PPM safe drinking level.';

  if (input.visibleIssue.includes('Iron') || input.waterSource.includes('Tube Well')) {
    recCategory = 'irp_plant';
    title = 'Automatic FRP Iron Removal Plant (IRP) for Home / Building';
    estPrice = 24500;
    estSetup = 3000;
    why = 'High iron in deep tube well water requires Manganese Greensand & Birm media to precipitate and filter out reddish rust particles before reaching your taps or RO unit.';
    tdsReduction = 'Removes red iron stains completely and reduces turbidity to 0 NTU.';
  } else if (input.budgetPreference === 'Economy') {
    recCategory = 'non_electric';
    title = '24-Liter Gravity Ceramic & Mineral Non-Electric Water Filter';
    estPrice = 3200;
    estSetup = 200;
    why = 'Zero electricity bill. Korean ceramic dome removes cholera, bacteria, and rust while adding essential minerals.';
    tdsReduction = 'Clears bacteria, sediment, and bad smell from municipal supply water.';
  }

  const recProducts = products.filter(p => p.category === recCategory).slice(0, 3);

  res.json({
    recommendedSystem: title,
    systemCategory: recCategory,
    estimatedPrice: estPrice,
    estimatedSetup: estSetup,
    whyThisChoice: why,
    expectedTdsReduction: tdsReduction,
    recommendedProducts: recProducts
  });
});


// Start server with Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AquaPure Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
