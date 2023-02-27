import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, of } from 'rxjs';
import { ModelsDTO } from '../model/model.model';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root',
})
export class ModelService {
  public apiModel = `${environment.baseUrl}/api/admin`;
  constructor(
    private httpClient: HttpClient,
    private message: NzMessageService
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

  createModel(models: ModelsDTO) {
    return this.httpClient.post(`${this.apiModel}/model/create`, models).pipe(
      map((res: any) => {
        if (res.code === 200) {
          this.message.success('Thêm dữ liệu thành công');
          return res.data.items;
        }
        return [];
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
