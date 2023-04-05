import { OrderDetail } from '../dashboard/order/orderDetails.model';

export interface ExchangeShopRequestBody {
  orderDetails: OrderDetail;
  orderId: number;
  statusOrder: number;
}
