import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { map } from 'rxjs';
import { RequestService } from 'src/app/common-services/request.service';
import { environment } from 'src/environments/environment';
import { ExchangeShopRequestBody } from 'src/app/model/exchangeShopRequestBody.model';

@Injectable({
  providedIn: 'root',
})
export class ReturnOrderService {
  public apiAdmin = `${environment.baseUrl}/api/admin`;

  constructor(
    private message: NzMessageService,
    private readonly requestService: RequestService
  ) {}

  returnOrderDetail(data: ExchangeShopRequestBody) {
    return this.requestService
      .post(`${this.apiAdmin}/order/return`, data, 'hoàn trả đơn hàng')
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return true;
          }
          this.message.error('Lỗi hoàn trả đơn hàng');
          return false;
        })
      );
  }
}
