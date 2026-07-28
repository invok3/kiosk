import { collection, addDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { Order } from "@/app/types/order";

export async function placeOrder(order: Omit<Order, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "orders"), order);
  return docRef.id;
}
