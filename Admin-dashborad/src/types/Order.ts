import { Games } from "./Game";

export interface GameItem {
  game: Games;
  quantity: number;
  isRental: boolean;
  rentalDuration?: number;
  priceAtPurchase: number;
}

export interface OrderUser {
  _id: string;
  name: string;
  email: string;
}

export interface Order {
  _id: string;
  user: OrderUser;
  name: string;
  email: string;
  telefon: string;
  address: string;
  items: GameItem[];
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
  isDelivered: boolean;
  isPaid: boolean;
  paymentMethod: string;
  rentalReturnDate?: string;
}



