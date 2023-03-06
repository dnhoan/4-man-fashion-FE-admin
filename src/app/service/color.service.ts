import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { ColorDTO } from '../model/color.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RequestService } from '../common-services/request.service';

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

  getAllColor(offset: any, limit: any, status: number): Observable<any> {
    return this.httpClient.get<any>(
      this.apiColor +
        '/color/getAll?offset=' +
        offset +
        '&limit=' +
        limit +
        '&status=' +
        1
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

  public updateColor(color: ColorDTO): Observable<any> {
    return this.httpClient.put<any>(this.apiColor + '/color/update', color);
  }

  public deleteColor(id: any): Observable<any> {
    return this.httpClient.delete<any>(
      `${this.apiColor}` + '/color/delete/' + id
    );
  }
}
