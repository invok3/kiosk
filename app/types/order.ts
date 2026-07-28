import { CartProduct } from "./product";

export type OrderType = "pickup" | "delivery";

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerNotes: string;
  type: OrderType;
  items: CartProduct[];
  total: number;
  date: string;
}
