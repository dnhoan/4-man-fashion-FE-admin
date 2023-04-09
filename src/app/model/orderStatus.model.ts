export interface OrderStatus {
  status?: number;
  statusName?: string;
  color?: string;
  icon?: string;
  orderId?: number;
  newStatus?: number;
  code?: string;
  note?: string;
}

export interface OrderDetailStatus {
  status: number;
  title: string;
  color: string;
}
