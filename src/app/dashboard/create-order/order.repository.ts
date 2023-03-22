import { createStore, withProps } from '@ngneat/elf';
import { Injectable } from '@angular/core';
import { OrderDTO } from 'src/app/model/order.model';

interface OrderProps {
  orderDto: OrderDTO;
}
export const orderInit = {
  id: 0,
  orderId: '',
  customerId: 0,
  orderStatus: 0,
  recipientName: '',
  recipientPhone: '',
  recipientEmail: '',
  address: '',
  shipFee: 0,
  goodsValue: 0,
  checkout: 0,
  sale: 0,
  delivery: 0,
  purchaseType: 0,
  note: '',
  cancelNot: '',
  ctime:'',
  mtime:'',
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
