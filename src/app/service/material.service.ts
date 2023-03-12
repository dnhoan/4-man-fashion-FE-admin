import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, of } from 'rxjs';
import { MaterialDTO } from '../model/material.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RequestService } from '../common-services/request.service';

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

  getAllMaterial(offset: any, limit: any, status: number): Observable<any> {
    return this.httpClient.get<any>(
      this.apiMaterial +
        '/material/getAll?offset=' +
        offset +
        '&limit=' +
        limit +
        '&status=' +
        1
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
  public updateMaterial(material: MaterialDTO): Observable<any> {
    return this.httpClient.put<any>(
      this.apiMaterial + '/material/update',
      material
    );
  }

  public deleteMaterial(id: any): Observable<any> {
    return this.httpClient.delete<any>(
      `${this.apiMaterial}` + '/material/delete/' + id
    );
  }
}
