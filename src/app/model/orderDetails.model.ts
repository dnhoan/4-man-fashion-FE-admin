import { Product } from "./product.model";
import { ProductDetail, ProductDetailDTO } from "./productDetail.model";

export interface OrderDetail {
  id?: number;
  orderId?: string;
  price?: number;
  quantity?: number;
  productDetailId?: string;
  exchangeId?: string;
  statusExchange?: string;
  statusOrderDetail?: string;
  productDetail: ProductDetailDTO;
}

export interface OrderDetailDTO {
  id?: number;
  orderId?: string;
  price?: number;
  quantity?: number;
  productDetailId?: string;
  exchangeId?: string;
  statusExchange?: string;
  statusOrderDetail?: string;
  productDetail: ProductDetailDTO;
}
