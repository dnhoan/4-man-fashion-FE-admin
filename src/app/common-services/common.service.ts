import { Injectable } from '@angular/core';
import { OrderStatus } from '../model/orderStatus.model';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor() {}
  pageSizeOptions = [10, 20, 30, 50, 100];
  statuses = [
    { value: 1, label: 'Hoạt động' },
    { value: 0, label: 'Đã xóa' },
    { value: -1, label: 'Tất cả' },
  ];

  orderStatuses: OrderStatus[] = [
    {
      status: 0,
      statusName: 'Đang chờ',
      color: '#9898a0',
      icon: 'loading',
    },
    {
      status: 1,
      statusName: 'Xác nhận',
      color: '#0099ff',
      icon: 'check',
    },

    {
      status: 2,
      statusName: 'Đã đóng gói',
      color: '#cccc00',
      icon: 'dropbox',
    },
    {
      status: 3,
      statusName: 'Đang vận chuyển',
      color: '#9966ff ',
      icon: 'car',
    },
    {
      status: 4,
      statusName: 'Hoàn thành',
      color: '#009933',
      icon: 'check-circle',
    },
    {
      status: -2,
      statusName: 'Đổi trả',
      color: '#003366',
      icon: 'sync',
    },
    {
      status: -1,
      statusName: 'Hủy',
      color: '#ff3300',
      icon: 'stop',
    },
  ];

}
