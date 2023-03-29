import { Component, Input, OnInit } from '@angular/core';
import { Order, OrderDTO } from '../order.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CommonService } from 'src/app/common-services/common.service';
import { LogOrderStatus } from 'src/app/model/logOrderStatus.model';
import { LogOrderStatusService } from 'src/app/service/logOrderStatus.service';
import { OrdersService } from 'src/app/service/order.service';
import {
  ORDER_STATUS,
  PURCHASE_TYPE,
} from 'src/app/constants/constant.constant';
import { OrderStatus } from 'src/app/model/orderStatus.model';

@Component({
  selector: 'app-orderDetail',
  templateUrl: './orderDetail.component.html',
  styleUrls: ['./orderDetail.component.scss'],
})
export class OrderDetailComponent implements OnInit {
  @Input('order') currentOrder!: Order;
  isShowConfirmCancelOrder = false;
  cancelNote: string = '';
  currentLog: LogOrderStatus[] = [];
  orderStatuses: OrderStatus[] = [];
  isShowStatusHistory = false;
  constructor(
    public commonService: CommonService,
    private orderService: OrdersService,
    private logOrderStatusService: LogOrderStatusService,
    private modal: NzModalService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.currentLog = this.currentOrder.logsOrderStatus!;
    this.orderStatuses = this.commonService.orderStatuses.filter((s) => {
      if (this.currentOrder.purchaseType == PURCHASE_TYPE.ONLINE) {
        return s.status != ORDER_STATUS.DRAFT;
      } else {
        return (
          s.status != ORDER_STATUS.PENDING && s.status != ORDER_STATUS.CONFIRMED
        );
      }
    });
  }

  onIndexChange(event: any) {
    let currentStatus = this.currentOrder.orderStatus;
    switch (currentStatus) {
      case ORDER_STATUS.DRAFT &&
        [
          ORDER_STATUS.PACKAGING,
          ORDER_STATUS.DELIVERING,
          ORDER_STATUS.COMPLETE,
          ORDER_STATUS.CANCEL_ORDER,
        ].includes(event):
        this.updateStatus(this.currentOrder.id, event);
        break;
      case ORDER_STATUS.PENDING:
        this.updateStatus(this.currentOrder.id, event);
        break;
      case ORDER_STATUS.PACKAGING &&
        [
          ORDER_STATUS.DRAFT,
          ORDER_STATUS.DELIVERING,
          ORDER_STATUS.COMPLETE,
          ORDER_STATUS.CANCEL_ORDER,
        ].includes(event):
        this.updateStatus(this.currentOrder.id, event);
        break;
      case ORDER_STATUS.DELIVERING &&
        [ORDER_STATUS.COMPLETE, ORDER_STATUS.CANCEL_ORDER].includes(event):
        this.updateStatus(this.currentOrder.id, event);
        break;
      case ORDER_STATUS.COMPLETE &&
        [ORDER_STATUS.EXCHANGE, ORDER_STATUS.CANCEL_ORDER].includes(event):
        this.updateStatus(this.currentOrder.id, event);
        break;
      case ORDER_STATUS.EXCHANGE &&
        [ORDER_STATUS.COMPLETE, ORDER_STATUS.CANCEL_ORDER].includes(event):
        this.updateStatus(this.currentOrder.id, event);
        break;
      default:
        this.message.error('Không thể chuyển trạng thái đơn hàng');
        break;
    }
  }
  updateStatus(orderId: number, newStatus: number, note?: string) {
    this.orderService
      .updateOrderStatus(orderId, newStatus, note)
      .subscribe((res) => {
        if (res) {
          // this.currentOrder.orderStatus = newStatus;
          // this.currentOrder.cancelNote = this.cancelNote;
          this.currentOrder.logsOrderStatus?.unshift(res);
        }
      });
    // this.getListLogOrderStatus(this.currentOrder.id);
  }

  // getListLogOrderStatus(id: number) {
  //   this.logOrderStatusService.getListLogOrder(id).subscribe((res) => {
  //     if (res) {
  //       this.currentLog = res;
  //     }
  //   });
  // }
  handleOk() {
    this.updateStatus(this.currentOrder.id, -1, this.cancelNote);
    this.isShowConfirmCancelOrder = false;
  }
  handleCancel() {
    this.isShowConfirmCancelOrder = false;
  }
}
