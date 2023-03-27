import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { map } from 'rxjs';
import { RequestService } from 'src/app/common-services/request.service';
import { environment } from 'src/environments/environment';
import { OrderDetailDTO } from '../order/orderDetails.model';

@Injectable({
  providedIn: 'root',
})
export class CreateOrderService {
  public apiAdmin = `${environment.baseUrl}/api/admin`;
  constructor(
    private httpClient: HttpClient,
    private message: NzMessageService,
    private readonly requestService: RequestService
  ) {}
  createOrderDetailToOrder(order_id: string, orderDetailDto: OrderDetailDTO) {
    return this.requestService
      .post(
        `${this.apiAdmin}/orderDetail/${order_id}`,
        orderDetailDto,
        'thêm sản phẩm đơn hàng'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            this.message.success('Thêm sản phẩm đơn hàng thành công');
            return res.data;
          } else {
            this.message.error('Lỗi thêm sản phẩm đơn hàng');
            return false;
          }
        })
      );
  }
  updateQuantityToOrder(orderDetailDto: OrderDetailDTO) {
    return this.requestService
      .put(
        `${this.apiAdmin}/orderDetail`,
        orderDetailDto,
        'thêm sản phẩm đơn hàng'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            this.message.success('Thêm sản phẩm đơn hàng thành công');
            return res.data;
          } else {
            this.message.error('Lỗi thêm sản phẩm đơn hàng');
            return false;
          }
        })
      );
  }
}
