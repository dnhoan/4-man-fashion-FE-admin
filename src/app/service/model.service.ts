import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, of } from 'rxjs';
import { ModelsDTO } from '../model/model.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RequestService } from '../common-services/request.service';

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

  getAllModel(offset: any, limit: any, status: number): Observable<any> {
    return this.httpClient.get<any>(
      this.apiModel +
        '/model/getAll?offset=' +
        offset +
        '&limit=' +
        limit +
        '&status=' +
        1
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

  public updateModel(model: ModelsDTO): Observable<any> {
    return this.httpClient.put<any>(this.apiModel + '/model/update', model);
  }

  public deleteModel(id: any): Observable<any> {
    return this.httpClient.delete<any>(
      `${this.apiModel}` + '/model/delete/' + id
    );
  }
}
