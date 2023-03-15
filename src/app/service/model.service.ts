import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, of } from 'rxjs';
import { Models, ModelsDTO } from '../model/model.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RequestService } from '../common-services/request.service';
import { SearchOption } from '../model/search-option.model';

@Injectable({
  providedIn: 'root',
})
export class ModelService {
  public apiModel = `${environment.baseUrl}/api/admin`;
  constructor(
    private httpClient: HttpClient,
    private message: NzMessageService,
    private readonly requestService: RequestService
  ) {}

  getAllModel(search: SearchOption) {
    return this.requestService
      .get(
        `${this.apiModel}/model/getAll?offset=${search.offset}&limit=${search.limit}&status=${search.status}&search=${search.searchTerm}`,
        'lấy danh sách kiểu dáng'
      )
      .pipe(
        map((res) => {
          if ((res.code = '000')) {
            return res.data;
          } else {
            this.message.error('Lỗi lấy danh sách kiểu dáng');
            return false;
          }
        })
      );
  }

  getListModel(): Observable<any> {
    return this.httpClient.get<any>(this.apiModel + '/model/getList');
  }

  createModel(models: ModelsDTO) {
    return this.requestService
      .post(`${this.apiModel}/model/create`, models, 'tạo mới kiểu dáng')
      .pipe(
        map((res) => {
          if (res.code == '000') {
            this.message.success('Tạo kiểu dáng thành công');
            return res.data;
          } else if (res.code == '409') {
            this.message.error('Tên kiểu dáng đã tồn tại');
            return false;
          } else {
            this.message.error('Lỗi tạo kiểu dáng');
            return false;
          }
        })
      );
  }

  updateModel(model: Models) {
    return this.requestService
      .put(`${this.apiModel}/model/update`, model, 'cập nhật kiểu dáng')
      .pipe(
        map((res) => {
          if ((res.code = '000')) {
            this.message.success('Cập nhật kiểu dáng thành công');
            return res.data;
          } else if (res.code == '409') {
            this.message.error('Tên kiểu dáng đã tồn tại');
            return false;
          } else {
            this.message.error('Lỗi cập nhật kiểu dáng');
            return false;
          }
        })
      );
  }

  updateStatus(model: Models) {
    let action = model.status == 0 ? 'Xóa' : 'Khôi phục';
    return this.requestService
      .put(`${this.apiModel}/model/update`, model, action + ' kiểu dáng')
      .pipe(
        map((res) => {
          if ((res.code = '000')) {
            this.message.success(action + ' kiểu dáng thành công');
            return res.data;
          } else {
            this.message.error('Lỗi ' + action + ' kiểu dáng');
            return false;
          }
        })
      );
  }
}
