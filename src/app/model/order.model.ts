import { OrderDetailDTO } from './orderDetails.model';
import { ProductImagesDTO } from './productImages.model';

export interface Order {
  id: number;
  orderId: string;
  customerId: number;
  orderStatus: number;
  recipientName: string;
  recipientPhone: string;
  recipientEmail: string;
  address: string;
  shipFee?: number;
  goodsValue: number;
  checkout: number;
  sale: number;
  totalMoney: number;
  delivery?: number;
  purchaseType: number;
  note: string;
  cancelNot: string;
  ctime: Date;
  mtime: Date;
  orderDetails?: OrderDetailDTO[];
}

export interface OrderDTO {
  id: number;
  orderId: string;
  customerId?: number | null;
  orderStatus: number;
  recipientName: string;
  recipientPhone: string;
  recipientEmail: string;
  address: string;
  shipFee?: number;
  goodsValue: number;
  checkout?: number;
  sale: number;
  totalMoney?: number;
  delivery?: number;
  purchaseType: number;
  note: string;
  cancelNote?: string;
  ctime?: string;
  mtime?: string;
  orderDetails?: OrderDetailDTO[];
}
