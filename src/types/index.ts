// src/types/index.ts

export interface Product {
  id: string; // Unique identifier for the product (e.g., UUID from backend)
  name: string;
  category: string; // Could be 'string' for category name or an object { id: string; name: string; }
  price: number;
  stock: number;
  status: 'In Stock' | 'Out of Stock' | 'Low Stock'; // Specific statuses
  image?: string; // URL to product image (optional)
  description?: string;
  rating?: number; // Example: 0-5 star rating
  // Add any other relevant product fields as needed
}

// You can add other interfaces here as well, e.g., for Category, Order, etc.
export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

// New type for the gallery images fetched from your API
export interface CategoryGalleryImage {
  id: string; // A unique ID for the image (optional, but good practice)
  name: string; // The name of the image (e.g., "Food Icon", "Electronics Icon")
  url: string;  // The actual URL to the image file
}



// Add other interfaces for Order, Shipment, Payment as you expand
export interface Order {
  id: string;
  customerName: string;
  orderDate: string; // e.g., "YYYY-MM-DD"
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  // Add other fields like items, shipping address, etc.
}

export interface Shipment {
  id: string;
  orderId: string;
  trackingNumber: string;
  carrier: string;
  status: 'Pending' | 'In Transit' | 'Delivered' | 'Failed';
  // Add other fields
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: string; // e.g., "Credit Card", "PayPal"
  status: 'Completed' | 'Pending' | 'Failed' | 'Refunded';
  transactionDate: string;
  // Add other fields
}