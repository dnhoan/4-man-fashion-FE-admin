import { ProductDetail } from 'src/app/model/productDetail.model';

export interface OrderDetail {
  id?: number;
  orderId?: number;
  price?: number;
  quantity?: number;
  productDetailId?: string;
  exchangeId?: string;
  statusExchange?: string;
  statusOrderDetail?: string;
  productDetail?: ProductDetail;
}

export interface OrderDetailDTO {
  id?: number;
  orderId?: number;
  price?: number;
  quantity?: number;
  productDetailId?: string;
  exchangeId?: string;
  statusExchange?: string;
  statusOrderDetail?: string;
  productDetail?: ProductDetail;
}
