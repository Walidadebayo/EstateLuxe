export interface PropertyType {
  id: string;
  name: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  type: string;
  status: "For Sale" | "For Rent";
  description: string;
  image?: string;
  features: string[];
  latitude: number;
  longitude: number;
}

export interface TenantType {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId: string;
  leaseStart: Date;
  leaseEnd: Date;
  rentAmount: number;
  paymentStatus: "Paid" | "Pending" | "Overdue";
}

export interface PaymentType {
  id: string;
  tenantId: string;
  amount: number;
  date: Date;
  status: "Paid" | "Pending" | "Overdue";
  method: "Cash" | "Credit Card" | "Bank Transfer";
}
