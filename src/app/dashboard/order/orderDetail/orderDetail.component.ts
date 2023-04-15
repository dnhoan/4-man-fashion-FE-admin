import { Component, Input, OnInit } from '@angular/core';
import { Order, OrderDTO } from '../order.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CommonService } from 'src/app/common-services/common.service';
import { LogOrderStatus } from 'src/app/model/logOrderStatus.model';
import { LogOrderStatusService } from 'src/app/service/logOrderStatus.service';
import { OrdersService } from 'src/app/dashboard/order/order.service';
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
  currentIndex!: number;
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
    this.currentIndex = this.orderStatuses.findIndex(
      (s) => s.status == this.currentOrder.orderStatus
    );
  }

  onIndexChange(event: any) {
    let newStatus = this.orderStatuses[event].status!;
    let currentStatus = this.currentOrder.orderStatus;
    if (
      this.orderService.checkUpdateOrderStatus(
        currentStatus,
        newStatus,
        this.currentOrder.delivery
      )
    ) {
      this.updateStatus(this.currentOrder.id, newStatus);
    }
  }
  updateStatus(orderId: number, newStatus: number, note?: string) {
    this.modal.confirm({
      nzTitle: '<i>Xác nhận cập nhật trạng thái đơn hàng</i>',
      nzContent: '<b>Bạn có muốn cập nhật trạng thái đơn hàng này không?</b>',
      nzOkText: 'Ok',
      nzCancelText: 'Hủy',
      nzOnOk: () => {
        if (newStatus == ORDER_STATUS.CANCEL_ORDER) {
          this.isShowConfirmCancelOrder = true;
        } else
          this.orderService
            .updateOrderStatus(orderId, newStatus, note)
            .subscribe((res) => {
              if (res) {
                this.currentOrder.orderStatus = newStatus;
                this.currentIndex = this.orderStatuses.findIndex(
                  (s) => s.status == this.currentOrder.orderStatus
                );
                this.currentOrder.logsOrderStatus?.unshift(res);
              }
            });
      },
    });
  }
  handleOk() {
    this.updateStatus(this.currentOrder.id, -1, this.cancelNote);
    this.isShowConfirmCancelOrder = false;
  }
  handleCancel() {
    this.isShowConfirmCancelOrder = false;
  }
}
