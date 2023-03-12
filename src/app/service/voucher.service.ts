import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { SizeDTO } from '../model/size.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RequestService } from '../common-services/request.service';
import { SearchOption } from '../model/search-option.model';
import { VoucherDTO } from '../model/voucher.model';

@Injectable({
  providedIn: 'root',
})
export class VoucherService {
  public apiVoucher = `${environment.baseUrl}/api/admin`;
  constructor(
    private httpClient: HttpClient,
    private message: NzMessageService,
    private readonly requestService: RequestService
  ) {}

  getAllVoucher(search: SearchOption) {
    return this.requestService
      .get(
        `${this.apiVoucher}/voucher/getAll?offset=${search.offset}&limit=${search.limit}&status=${search.status}&search=${search.searchTerm}`,
        'lấy danh sách kích thước'
      )
      .pipe(
        map((res) => {
          if ((res.code = '000')) {
            return res.data;
          } else {
            this.message.error('Lỗi lấy danh sách voucher');
            return false;
          }
        })
      );
  }

  getLisVoucher(): Observable<any> {
    return this.httpClient.get<any>(this.apiVoucher + '/voucher/getList');
  }

  createVoucher(voucher: VoucherDTO) {
    return this.requestService
      .post(`${this.apiVoucher}/voucher/create`, voucher, 'tạo mới voucher')
      .pipe(
        map((res) => {
          if ((res.code = '000')) {
            this.message.success('Tạo voucher thành công');
            return res.data;
          } else if (res.code == '409') {
            this.message.error('Tên voucher đã tồn tại');
            return false;
          } else {
            this.message.error('Lỗi tạo voucher');
            return false;
          }
        })
      );
  }

  updateVoucher(voucher: VoucherDTO) {
    return this.requestService
      .put(`${this.apiVoucher}/voucher/update`, voucher, 'cập nhật voucher')
      .pipe(
        map((res) => {
          if ((res.code == '000')) {
            this.message.success('Cập nhật voucher thành công');
            return res.data;
          } else if (res.code == '409') {
            this.message.error('Tên voucher đã tồn tại');
            return false;
          } else {
            this.message.error('Lỗi cập nhật voucher');
            return false;
          }
        })
      );
  }

  updateStatus(voucher: VoucherDTO) {
    let action = voucher.status == 0 ? 'Xóa' : 'Khôi phục';
    return this.requestService
      .put(`${this.apiVoucher}/voucher/update`, voucher, action + ' voucher')
      .pipe(
        map((res) => {
          if ((res.code = '000')) {
            this.message.success(action + ' voucher thành công');
            return res.data;
          } else {
            this.message.error('Lỗi ' + action + ' voucher');
            return false;
          }
        })
      );
  }
}
