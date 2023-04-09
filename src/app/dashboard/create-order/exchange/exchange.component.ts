import { Component, Input, OnInit } from '@angular/core';
import { OrderDetailDTO } from '../../order/orderDetails.model';
import { ExchangeService } from './exchange.service';
import { CommonConstants } from 'src/app/constants/common-constants';
import { ORDER_DETAIL_STATUS } from 'src/app/constants/constant.constant';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss'],
})
export class ExchangeComponent implements OnInit {
  @Input() orderDetail!: OrderDetailDTO;
  ORDER_DETAIL_STATUS = ORDER_DETAIL_STATUS;
  constructor(
    private exchangeService: ExchangeService,
    private modalRef: NzModalRef
  ) {}

  ngOnInit(): void {}
  reject(isExchange: boolean) {
    if (isExchange) {
      this.exchangeService
        .rejectExchangeOrderDetail(this.orderDetail)
        .subscribe((res) => {
          if (res) {
            this.orderDetail.statusOrderDetail =
              ORDER_DETAIL_STATUS.REJECT_EXCHANGE;
          }
        });
    } else
      this.exchangeService
        .rejectReturnOrderDetail(this.orderDetail)
        .subscribe((res) => {
          if (res) {
            this.orderDetail.statusOrderDetail =
              ORDER_DETAIL_STATUS.REJECT_RETURN;
          }
        });
  }
  confirm(isExchange: boolean) {
    if (isExchange)
      this.exchangeService
        .confirmExchangeOrderDetail(this.orderDetail)
        .subscribe((res) => {
          if (res) {
            this.orderDetail.statusOrderDetail = ORDER_DETAIL_STATUS.EXCHANGE;
          }
        });
    else
      this.exchangeService
        .confirmReturnOrderDetail(this.orderDetail)
        .subscribe((res) => {
          if (res) {
            this.orderDetail.statusOrderDetail = ORDER_DETAIL_STATUS.RETURN;
          }
        });
  }
}
