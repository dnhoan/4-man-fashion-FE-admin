import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { SizeDTO } from '../model/size.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RequestService } from '../common-services/request.service';
import { SearchOption } from '../model/search-option.model';

@Injectable({
  providedIn: 'root',
})
export class SizeService {
  public apiSize = `${environment.baseUrl}/api/admin`;
  constructor(
    private httpClient: HttpClient,
    private message: NzMessageService,
    private readonly requestService: RequestService
  ) {}

  getAllSize(search: SearchOption) {
    return this.requestService
      .get(
        `${this.apiSize}/size/getAll?offset=${search.offset}&limit=${search.limit}&status=${search.status}&search=${search.searchTerm}`,
        'lấy danh sách kích thước'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return res.data;
          } else {
            this.message.error('Lỗi lấy danh sách kích thước');
            return false;
          }
        })
      );
  }

  getListSize(): Observable<any> {
    return this.httpClient.get<any>(this.apiSize + '/size/getList');
  }

  createSize(size: SizeDTO) {
    return this.requestService
      .post(`${this.apiSize}/size/create`, size, 'tạo mới size')
      .pipe(
        map((res) => {
          if (res.code == '000') {
            this.message.success('Tạo size thành công');
            return res.data;
          } else if (res.code == '409') {
            this.message.error('Tên size đã tồn tại');
            return false;
          } else {
            this.message.error('Lỗi tạo size');
            return false;
          }
        })
      );
  }

  updateSize(size: SizeDTO) {
    return this.requestService
      .put(`${this.apiSize}/size/update`, size, 'cập nhật size')
      .pipe(
        map((res) => {
          if (res.code == '000') {
            this.message.success('Cập nhật size thành công');
            return res.data;
          } else if (res.code == '409') {
            this.message.error('Tên size đã tồn tại');
            return false;
          } else {
            this.message.error('Lỗi cập nhật size');
            return false;
          }
        })
      );
  }

  updateStatus(size: SizeDTO) {
    let action = size.status == 0 ? 'Xóa' : 'Khôi phục';
    return this.requestService
      .put(`${this.apiSize}/size/update`, size, action + ' size')
      .pipe(
        map((res) => {
          if (res.code == '000') {
            this.message.success(action + ' size thành công');
            return res.data;
          } else {
            this.message.error('Lỗi ' + action + ' size');
            return false;
          }
        })
      );
  }
}
