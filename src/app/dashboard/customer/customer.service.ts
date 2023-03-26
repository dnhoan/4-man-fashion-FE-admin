import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { map } from 'rxjs';
import { RequestService } from 'src/app/common-services/request.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  public apiAdmin = `${environment.baseUrl}/api/admin`;
  constructor(
    private message: NzMessageService,
    private readonly requestService: RequestService
  ) {}
  getPageCustomer(valueSearch: string) {
    return this.requestService
      .get(
        `${this.apiAdmin}/customer/getAll?search=${valueSearch}`,
        'tìm kiếm khách hàng'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return res.data.items;
          } else {
            this.message.error('Lỗi tìm kiếm khách hàng');
            return false;
          }
        })
      );
  }
  getCustomerById(id: string) {
    return this.requestService
      .get(`${this.apiAdmin}/customer/${id}`, 'thông tin khách hàng')
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return res.data.items;
          } else {
            this.message.error('Lỗi thông tin khách hàng');
            return false;
          }
        })
      );
  }
}
