import { Exchange } from 'src/app/model/exchange.model';
import { ProductDetail } from 'src/app/model/productDetail.model';

export interface OrderDetail {
  id?: number;
  orderId?: number;
  price?: number;
  quantity?: number;
  quantityOrigin: number;
  productDetailId?: string;
  exchangeId?: string;
  statusExchange?: string;
  statusOrderDetail?: string;
  productDetail?: ProductDetail;
  exchange?: Exchange;
}

export interface OrderDetailDTO {
  id?: number;
  orderId?: number;
  price?: number;
  quantity?: number;
  quantityOrigin?: number;
  productDetailId?: string;
  exchangeId?: string;
  statusExchange?: string;
  statusOrderDetail?: number;
  productDetail?: ProductDetail;
  exchange?: Exchange;
}
