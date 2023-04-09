import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { map } from 'rxjs';
import { RequestService } from 'src/app/common-services/request.service';
import { ExchangeShopRequestBody } from 'src/app/model/exchangeShopRequestBody.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExchangeStoreService {
  public apiAdmin = `${environment.baseUrl}/api/admin`;

  constructor(
    private message: NzMessageService,
    private readonly requestService: RequestService
  ) {}

  exchangeOrderDetail(data: ExchangeShopRequestBody) {
    return this.requestService
      .post(`${this.apiAdmin}/order/exchange`, data, 'đổi trả đơn hàng')
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
