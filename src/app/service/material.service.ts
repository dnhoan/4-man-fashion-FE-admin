import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, of } from 'rxjs';
import { Material, MaterialDTO } from '../model/material.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RequestService } from '../common-services/request.service';
import { SearchOption } from '../model/search-option.model';

@Injectable({
  providedIn: 'root',
})
export class MaterialService {
  public apiMaterial = `${environment.baseUrl}/api/admin`;
  constructor(
    private httpClient: HttpClient,
    private message: NzMessageService,
    private readonly requestService: RequestService
  ) {}

  getAllMaterial(search: SearchOption) {
    return this.requestService
      .get(
        `${this.apiMaterial}/material/getAll?offset=${search.offset}&limit=${search.limit}&status=${search.status}&search=${search.searchTerm}`,
        'lấy danh sách chất liệu'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return res.data;
          } else {
            this.message.error('Lỗi lấy danh sách chất liệu');
            return false;
          }
        })
      );
  }

  getListMaterial(): Observable<any> {
    return this.httpClient.get<any>(this.apiMaterial + '/material/getList');
  }

  createMaterial(material: MaterialDTO) {
    return this.requestService
      .post(
        `${this.apiMaterial}/material/create`,
        material,
        'tạo mới chất liệu'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            this.message.success('Tạo chất liệu thành công');
            return res.data;
          } else if (res.code == '409') {
            this.message.error('Tên chất liệu đã tồn tại');
            return false;
          } else {
            this.message.error('Lỗi tạo chất liệu');
            return false;
          }
        })
      );
  }
  updateMaterial(material: Material) {
    return this.requestService
      .put(
        `${this.apiMaterial}/material/update`,
        material,
        'cập nhật chất liệu'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            this.message.success('Cập nhật chất liệu thành công');
            return res.data;
          } else if (res.code == '409') {
            this.message.error('Tên chất liệu đã tồn tại');
            return false;
          } else {
            this.message.error('Lỗi cập nhật chất liệu');
            return false;
          }
        })
      );
  }

  updateStatus(material: Material) {
    let action = material.status == 0 ? 'Xóa' : 'Khôi phục';
    return this.requestService
      .put(
        `${this.apiMaterial}/material/update`,
        material,
        action + ' chất liệu'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            this.message.success(action + ' chất liệu thành công');
            return res.data;
          } else {
            this.message.error('Lỗi ' + action + ' chất liệu');
            return false;
          }
        })
      );
  }
}
