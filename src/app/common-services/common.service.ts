import { Injectable } from '@angular/core';
import {
  ORDER_DETAIL_STATUS,
  ORDER_STATUS,
} from '../constants/constant.constant';
import { OrderDetailStatus, OrderStatus } from '../model/orderStatus.model';
import { NzModalService } from 'ng-zorro-antd/modal';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private modal: NzModalService) {}
  pageSizeOptions = [10, 20, 30, 50, 100];
  statuses = [
    { value: 1, label: 'Hoạt động' },
    { value: 0, label: 'Đã xóa' },
    { value: -1, label: 'Tất cả' },
  ];
  // conditionToNewStatus = {
  //   DRAFT: [
  //     ORDER_STATUS.DRAFT,
  //     ORDER_STATUS.PACKAGING,
  //     ORDER_STATUS.DELIVERING,
  //     ORDER_STATUS.COMPLETE,
  //     ORDER_STATUS.CANCEL_ORDER,
  //   ], // [đóng gói, vận chuyển, hoàn thành, hủy]
  //   PENDING: [
  //     ORDER_STATUS.CONFIRMED,
  //     ORDER_STATUS.PACKAGING,
  //     ORDER_STATUS.DELIVERING,
  //     ORDER_STATUS.COMPLETE,
  //     ORDER_STATUS.CANCEL_ORDER,
  //   ], // [Xác nhận, đóng gói, vận chuyển, hoàn thành, hủy]
  //   CONFIRMED: [
  //     ORDER_STATUS.PENDING,
  //     ORDER_STATUS.CONFIRMED,
  //     ORDER_STATUS.PACKAGING,
  //     ORDER_STATUS.DELIVERING,
  //     ORDER_STATUS.COMPLETE,
  //     ORDER_STATUS.CANCEL_ORDER,
  //   ], // [Đóng gói, vận chuyển, hoàn thành, hủy]
  //   PACKAGING: [
  //     ORDER_STATUS.PACKAGING,
  //     ORDER_STATUS.DELIVERING,
  //     ORDER_STATUS.COMPLETE,
  //     ORDER_STATUS.CANCEL_ORDER,
  //   ], // [Vận chuyển, hoàn thành, hủy]
  //   DELIVERING: [4, 6], // [Hoàn thành, Hủy]
  //   COMPLETE: [5, 6], // [Đổi trả]
  //   EXCHANGE: [],
  //   CANCEL_ORDER: [],
  // };
  orderStatuses: OrderStatus[] = [
    {
      status: ORDER_STATUS.DRAFT,
      code: 'DRAFT',
      statusName: 'Đơn nháp',
      color: '#ffe6cc',
      icon: 'plus-circle',
    },
    {
      status: ORDER_STATUS.PENDING,
      code: 'PENDING',
      statusName: 'Chưa xác nhận',
      color: '#9898a0',
      icon: 'loading',
    },
    {
      status: ORDER_STATUS.CONFIRMED,
      code: 'CONFIRMED',
      statusName: 'Xác nhận',
      color: '#0099ff',
      icon: 'check',
    },
    {
      status: ORDER_STATUS.PACKAGING,
      code: 'PACKAGING',
      statusName: 'Đóng gói',
      color: '#cccc00',
      icon: 'dropbox',
    },
    {
      status: ORDER_STATUS.DELIVERING,
      code: 'DELIVERING',
      statusName: 'Đang vận chuyển',
      color: '#9966ff ',
      icon: 'car',
    },
    {
      status: ORDER_STATUS.COMPLETE,
      code: 'COMPLETE',
      statusName: 'Hoàn thành',
      color: '#009933',
      icon: 'check-circle',
    },
    {
      status: ORDER_STATUS.EXCHANGE,
      code: 'EXCHANGE',
      statusName: 'Đổi trả',
      color: '#003366',
      icon: 'sync',
    },
    {
      status: ORDER_STATUS.CANCEL_ORDER,
      code: 'CANCEL_ORDER',
      statusName: 'Hủy',
      color: '#ff3300',
      icon: 'stop',
    },
  ];
  orderDetailStatuses: OrderDetailStatus[] = [
    {
      status: ORDER_DETAIL_STATUS.EXCHANGE,
      title: 'Đổi trả',
      color: '#003366',
    },
    {
      status: ORDER_DETAIL_STATUS.RETURN,
      title: 'Trả hàng hoàn tiền',
      color: '#9966ff',
    },
    {
      status: ORDER_DETAIL_STATUS.REJECT_RETURN,
      title: 'Hủy trả hàng hoàn tiền',
      color: '#ff3300',
    },
    {
      status: ORDER_DETAIL_STATUS.REJECT_EXCHANGE,
      title: 'Hủy đổi trả',
      color: '#ff3300',
    },
  ];

  confirm(title: string, content: string): boolean {
    let bool = false;
    this.modal.confirm({
      nzTitle: `<i>${title}</i>`,
      nzContent: `<b>${content}</b>`,
      nzOkText: 'Ok',
      nzCancelText: 'Hủy',
      nzOnOk: () => {
        bool = true;
        console.log(bool);
      },
    });
    console.log('end');

    return bool;
  }
}
