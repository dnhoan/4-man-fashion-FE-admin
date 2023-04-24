import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { map } from 'rxjs';
import { RequestService } from 'src/app/common-services/request.service';
import { environment } from 'src/environments/environment';
import { Customer } from './customerDto.model';
import { SearchOption } from 'src/app/model/search-option.model';

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

  getAllCustomer(search: SearchOption) {
    return this.requestService
      .get(
        `${this.apiAdmin}/customer/getAll?offset=${search.offset}&limit=${search.limit}&status=${search.status}&search=${search.searchTerm}`,
        'lấy danh sách khách hàng'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return res.data;
          } else {
            this.message.error('Lỗi lấy danh sách khách hàng');
            return false;
          }
        })
      );
  }

  createCustomer(customer: Customer) {
    return this.requestService
      .post(`${this.apiAdmin}/customer/create`, customer, 'tạo mới khách hàng')
      .pipe(
        map((res) => {
          if ((res.code === '000')) {
            return res;
          } else {
            return res;
          }
        })
      );
  }

  updateCustomer(customer: Customer) {
    return this.requestService
      .put(`${this.apiAdmin}/customer/update`, customer, 'cập nhật khách hàng')
      .pipe(
        map((res) => {
          if ((res.code === '000')) {
            return res;
          } else {
            return res;
          }
        })
      );
  }

  updateStatus(customer: Customer) {
    let action = customer.status == 0 ? 'Xóa' : 'Khôi phục';
    return this.requestService
      .put(
        `${this.apiAdmin}/customer/update`,
        customer,
        action + ' khách hàng'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            this.message.success(action + ' khách hàng thành công');
            return res.data;
          } else {
            this.message.error('Lỗi ' + action + ' khách hàng');
            return false;
          }
        })
      );
  }
}
