import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { map } from 'rxjs';
import { RequestService } from 'src/app/common-services/request.service';
import { environment } from 'src/environments/environment';
import { OrderDetailDTO } from '../orderDetails.model';

@Injectable({
  providedIn: 'root',
})
export class OrderDetailService {
  public apiAdmin = `${environment.baseUrl}/api/admin`;
  constructor(
    private message: NzMessageService,
    private readonly requestService: RequestService
  ) {}
  updateOrderDetail(order_id: string, orderDetailDto: OrderDetailDTO) {
    return this.requestService
      .put(
        `${this.apiAdmin}/orderDetail/${order_id}`,
        orderDetailDto,
        'cập nhật sản phẩm'
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
}
