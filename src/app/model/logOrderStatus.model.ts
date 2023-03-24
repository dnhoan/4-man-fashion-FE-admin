import { Order } from './order.model';
import { ProductDetail } from './productDetail.model';

export interface LogOrderStatus {
  id: number;
  order: Order;
  times: Date;
  user_change: string;
  note: string;
  currentStatus: number;
  newStatus: number;
  //  accounts:;
  productDetails: ProductDetail[];
}
