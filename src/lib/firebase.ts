import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_PORTFOLIO } from '../data/initialData';
import { Product, Order, PortfolioItem, OrderStatus } from '../types';

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

export interface ContactMessage {
  id?: string;
  name: string;
  phone: string;
  setupType: string;
  message: string;
  status?: 'unread' | 'read' | 'resolved';
  createdAt: string;
}

// Collections references
const productsCol = collection(db, 'products');
const ordersCol = collection(db, 'orders');
const messagesCol = collection(db, 'messages');
const portfolioCol = collection(db, 'portfolio');

/**
 * Automatically seeds initial products, orders, and portfolio items into Firestore if empty
 */
export const seedInitialDataIfEmpty = async () => {
  try {
    // 1. Seed Products
    const prodSnap = await getDocs(productsCol);
    if (prodSnap.empty) {
      console.log('Seeding initial products to Firestore...');
      for (const prod of INITIAL_PRODUCTS) {
        await setDoc(doc(productsCol, prod.id), prod);
      }
    }

    // 2. Seed Orders
    const orderSnap = await getDocs(ordersCol);
    if (orderSnap.empty) {
      console.log('Seeding initial orders to Firestore...');
      for (const ord of INITIAL_ORDERS) {
        await setDoc(doc(ordersCol, ord.id), ord);
      }
    }

    // 3. Seed Portfolio
    const portSnap = await getDocs(portfolioCol);
    if (portSnap.empty) {
      console.log('Seeding initial portfolio items to Firestore...');
      for (const port of INITIAL_PORTFOLIO) {
        await setDoc(doc(portfolioCol, port.id), port);
      }
    }
  } catch (error) {
    console.error('Error seeding initial Firestore data:', error);
  }
};

/**
 * Real-time listener for Products
 */
export const subscribeProducts = (onUpdate: (products: Product[]) => void) => {
  return onSnapshot(productsCol, (snapshot) => {
    const prods: Product[] = [];
    snapshot.forEach((doc) => {
      prods.push({ id: doc.id, ...doc.data() } as Product);
    });
    onUpdate(prods);
  }, (error) => {
    console.error('Firestore products snapshot error:', error);
  });
};

/**
 * Real-time listener for Orders
 */
export const subscribeOrders = (onUpdate: (orders: Order[]) => void) => {
  const q = query(ordersCol, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const ordersList: Order[] = [];
    snapshot.forEach((doc) => {
      ordersList.push({ id: doc.id, ...doc.data() } as Order);
    });
    onUpdate(ordersList);
  }, (error) => {
    console.error('Firestore orders snapshot error:', error);
  });
};

/**
 * Real-time listener for Customer Messages
 */
export const subscribeMessages = (onUpdate: (messages: ContactMessage[]) => void) => {
  const q = query(messagesCol, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const msgs: ContactMessage[] = [];
    snapshot.forEach((doc) => {
      msgs.push({ id: doc.id, ...doc.data() } as ContactMessage);
    });
    onUpdate(msgs);
  }, (error) => {
    console.error('Firestore messages snapshot error:', error);
  });
};

/**
 * Real-time listener for Portfolio
 */
export const subscribePortfolio = (onUpdate: (items: PortfolioItem[]) => void) => {
  return onSnapshot(portfolioCol, (snapshot) => {
    const items: PortfolioItem[] = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as PortfolioItem);
    });
    onUpdate(items);
  }, (error) => {
    console.error('Firestore portfolio snapshot error:', error);
  });
};

/**
 * Save new order to Firestore
 */
export const saveOrderToFirebase = async (orderData: Omit<Order, 'id'>) => {
  const newOrderRef = doc(ordersCol);
  const newOrder: Order = {
    ...orderData,
    id: newOrderRef.id
  };
  await setDoc(newOrderRef, newOrder);
  return newOrder;
};

/**
 * Update order status in Firestore
 */
export const updateOrderStatusInFirebase = async (orderId: string, status: OrderStatus) => {
  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, { status });
};

/**
 * Save contact message/inquiry to Firestore
 */
export const saveContactMessageToFirebase = async (data: Omit<ContactMessage, 'id' | 'createdAt'>) => {
  const msgRef = doc(messagesCol);
  const newMsg: ContactMessage = {
    ...data,
    id: msgRef.id,
    status: 'unread',
    createdAt: new Date().toISOString()
  };
  await setDoc(msgRef, newMsg);
  return newMsg;
};

/**
 * Update contact message status
 */
export const updateMessageStatusInFirebase = async (msgId: string, status: 'unread' | 'read' | 'resolved') => {
  const msgRef = doc(db, 'messages', msgId);
  await updateDoc(msgRef, { status });
};

/**
 * Save product to Firestore
 */
export const saveProductToFirebase = async (product: Omit<Product, 'id'>) => {
  const prodRef = doc(productsCol);
  const newProduct: Product = {
    ...product,
    id: prodRef.id
  };
  await setDoc(prodRef, newProduct);
  return newProduct;
};

/**
 * Update product in Firestore
 */
export const updateProductInFirebase = async (productId: string, productData: Partial<Product>) => {
  const prodRef = doc(db, 'products', productId);
  await updateDoc(prodRef, productData);
};

/**
 * Delete product from Firestore
 */
export const deleteProductFromFirebase = async (productId: string) => {
  const prodRef = doc(db, 'products', productId);
  await deleteDoc(prodRef);
};

/**
 * Update product stock in Firestore
 */
export const updateStockInFirebase = async (productId: string, newStock: number) => {
  const prodRef = doc(db, 'products', productId);
  await updateDoc(prodRef, { stock: Math.max(0, newStock) });
};

/**
 * Save portfolio item
 */
export const savePortfolioToFirebase = async (item: Omit<PortfolioItem, 'id'>) => {
  const itemRef = doc(portfolioCol);
  const newItem: PortfolioItem = {
    ...item,
    id: itemRef.id
  };
  await setDoc(itemRef, newItem);
  return newItem;
};

/**
 * Delete portfolio item
 */
export const deletePortfolioFromFirebase = async (itemId: string) => {
  const itemRef = doc(db, 'portfolio', itemId);
  await deleteDoc(itemRef);
};
