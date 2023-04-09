import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { map } from 'rxjs';
import { RequestService } from 'src/app/common-services/request.service';
import { environment } from 'src/environments/environment';
import { OrderDetailDTO } from '../../order/orderDetails.model';

@Injectable({
  providedIn: 'root',
})
export class ExchangeService {
  public apiAdmin = `${environment.baseUrl}/api/admin`;

  constructor(
    private message: NzMessageService,
    private readonly requestService: RequestService
  ) {}
  rejectReturnOrderDetail(orderDetails: OrderDetailDTO) {
    return this.requestService
      .put(
        `${this.apiAdmin}/orderExchange/rejectReturn`,
        orderDetails,
        'cập nhật đơn hàng'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            this.message.success('Cập nhật đơn hàng thành công');
            return res.data;
          } else {
            this.message.error('Lỗi cập nhật đơn hàng');
            return false;
          }
        })
      );
  }
  confirmReturnOrderDetail(orderDetails: OrderDetailDTO) {
    return this.requestService
      .put(
        `${this.apiAdmin}/orderExchange/confirmReturn`,
        orderDetails,
        'cập nhật đơn hàng'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            this.message.success('Cập nhật đơn hàng thành công');
            return res.data;
          } else {
            return false;
          }
        })
      );
  }
  rejectExchangeOrderDetail(orderDetails: OrderDetailDTO) {
    return this.requestService
      .put(
        `${this.apiAdmin}/orderExchange/rejectExchange`,
        orderDetails,
        'cập nhật đơn hàng'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            this.message.success('Cập nhật đơn hàng thành công');
            return res.data;
          } else {
            this.message.error('Lỗi cập nhật đơn hàng');
            return false;
          }
        })
      );
  }
  confirmExchangeOrderDetail(orderDetails: OrderDetailDTO) {
    return this.requestService
      .put(
        `${this.apiAdmin}/orderExchange/confirmExchange`,
        orderDetails,
        'cập nhật đơn hàng'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            this.message.success('Cập nhật đơn hàng thành công');
            return res.data;
          } else {
            return false;
          }
        })
      );
  }
}
