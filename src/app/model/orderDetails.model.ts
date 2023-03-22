export interface OrderDetail {
  id?: number;
  orderId?: string;
  price?: number;
  quantity?: number;
  productDetailId?: string;
  exchangeId?: string;
  statusExchange?: string;
  statusOrderDetail?: string;
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
}
