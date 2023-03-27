import { createStore, withProps } from '@ngneat/elf';
import { Injectable } from '@angular/core';
import { OrderDTO } from 'src/app/dashboard/order/order.model';

interface OrderProps {
  orderDto: OrderDTO;
}
export const orderInit = {
  id: 2,
  customerId: null,
  orderId: '1679582927047',
  orderStatus: 1,
  recipientName: '',
  recipientPhone: '',
  recipientEmail: '',
  address: '',
  shipFee: 0,
  goodsValue: 0,
  checkout: 0,
  sale: 0,
  totalMoney: 0,
  delivery: 0,
  purchaseType: 0,
  note: '',
  cancelNote: '',
  orderDetails: [],
};
export const orderStore = createStore(
  { name: 'order' },
  withProps<OrderProps>({
    orderDto: orderInit,
  })
);

@Injectable({ providedIn: 'root' })
export class OrderRepository {}
