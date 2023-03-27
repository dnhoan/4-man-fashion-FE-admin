import { Component, Input, OnInit } from '@angular/core';
import { Order, OrderDTO } from '../order.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CommonService } from 'src/app/common-services/common.service';
import { LogOrderStatus } from 'src/app/model/logOrderStatus.model';
import { LogOrderStatusService } from 'src/app/service/logOrderStatus.service';
import { OrdersService } from 'src/app/service/order.service';

@Component({
  selector: 'app-orderDetail',
  templateUrl: './orderDetail.component.html',
  styleUrls: ['./orderDetail.component.scss'],
})
export class OrderDetailComponent implements OnInit {
  @Input('order') currentOrder!: Order;
  isShowConfirmCancelOrder = false;
  cancelNote: string = '';
  currentLog!: LogOrderStatus[];
  constructor(
    public commonService: CommonService,
    private orderService: OrdersService,
    private logOrderStatusService: LogOrderStatusService,
    private modal: NzModalService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {}

  onIndexChange(event: any) {
    let currentStatus = this.currentOrder.orderStatus;
    switch (true) {
      case event == -2 && currentStatus == 4:
        this.updateStatus(this.currentOrder.id, event);
        break;
      case event == -1:
        this.isShowConfirmCancelOrder = true;
        break;
      case event == 1 && currentStatus == 0:
        this.updateStatus(this.currentOrder.id, event);
        break;
      case event == 2 && currentStatus == 1:
        this.updateStatus(this.currentOrder.id, event);
        break;
      case event == 3 && currentStatus == 2:
        this.updateStatus(this.currentOrder.id, event);
        break;
      case event == 4 &&
        (currentStatus == 3 ||
          (currentStatus == 1 && this.currentOrder.delivery == 0)):
        this.updateStatus(this.currentOrder.id, event);
        break;
      default:
        this.message.error('Không thể chuyển trạng thái');
        break;
    }
  }
  updateStatus(orderId: number, newStatus: number, note?: string) {
    this.orderService
      .updateOrderStatus(orderId, newStatus, note)
      .subscribe((res) => {
        if (res) {
          this.currentOrder.orderStatus = newStatus;
          this.currentOrder.cancelNote = this.cancelNote;
        }
      });
    this.getListLogOrderStatus(this.currentOrder.id);
  }

  getListLogOrderStatus(id: number) {
    this.logOrderStatusService.getListLogOrder(id).subscribe((res) => {
      if (res) {
        this.currentLog = res;
      }
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
