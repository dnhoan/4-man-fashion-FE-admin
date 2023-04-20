import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { Color, ColorDTO } from '../model/color.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RequestService } from '../common-services/request.service';
import { SearchOption } from '../model/search-option.model';

@Injectable({
  providedIn: 'root',
})
export class ColorService {
  public apiColor = `${environment.baseUrl}/api/admin`;
  constructor(
    private httpClient: HttpClient,
    private message: NzMessageService,
    private readonly requestService: RequestService
  ) {}

  getAllColor(search: SearchOption) {
    return this.requestService
      .get(
        `${this.apiColor}/color/getAll?offset=${search.offset}&limit=${search.limit}&status=${search.status}&search=${search.searchTerm}`,
        'lấy danh sách màu sắc'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return res.data;
          } else {
            this.message.error('Lỗi lấy danh sách màu sắc');
            return false;
          }
        })
      );
  }

  getListColor(): Observable<any> {
    return this.httpClient.get<any>(this.apiColor + '/color/getList');
  }

  createColor(color: ColorDTO) {
    return this.requestService
      .post(`${this.apiColor}/color/create`, color, 'tạo mới màu sắc')
      .pipe(
        map((res) => {
          if (res.code == '000') {
            this.message.success('Tạo màu sắc thành công');
            return res.data;
          } else if (res.code == '409') {
            this.message.error('Tên màu sắc đã tồn tại');
            return false;
          } else {
            this.message.error('Lỗi tạo màu sắc');
            return false;
          }
        })
      );
  }

  updateColor(color: Color) {
    return this.requestService
      .put(`${this.apiColor}/color/update`, color, 'cập nhật màu sắc')
      .pipe(
        map((res) => {
          if (res.code == '000') {
            this.message.success('Cập nhật màu sắc thành công');
            return res.data;
          } else if (res.code == '409') {
            this.message.error('Tên màu sắc đã tồn tại');
            return false;
          } else {
            this.message.error('Lỗi cập nhật màu sắc');
            return false;
          }
        })
      );
  }

  updateStatus(color: Color) {
    let action = color.status == 0 ? 'Xóa' : 'Khôi phục';
    return this.requestService
      .put(`${this.apiColor}/color/update`, color, action + ' màu sắc')
      .pipe(
        map((res) => {
          if (res.code == '000') {
            this.message.success(action + ' màu sắc thành công');
            return res.data;
          } else {
            this.message.error('Lỗi ' + action + ' màu sắc');
            return false;
          }
        })
      );
  }
}
