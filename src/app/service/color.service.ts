import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { ColorDTO } from '../model/color.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ColorService {
  public apiColor = `${environment.baseUrl}/api/admin`;
  constructor(private httpClient: HttpClient, private toastr: ToastrService) {}

  getAllColor(
    offset: any,
    limit: any,
    status: number,
  ): Observable<any> {
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
    return this.httpClient.get<any>(
      this.apiColor +
        '/color/getList'
    );
  }

  createColor(color: ColorDTO) {
    return this.httpClient.post(`${this.apiColor}/color/create`, color).pipe(
      map((res: any) => {
        if (res.code === 200) {
          this.toastr.success('Thêm dữ liệu thành công');
          return res.data.items;
        }
        return [];
      })
    );
  }

  public updateColor(color: ColorDTO): Observable<any> {
    return this.httpClient.put<any>(
      this.apiColor + '/color/update',
      color
    );
  }

  public deleteColor(id: any): Observable<any> {
    return this.httpClient.delete<any>(
      `${this.apiColor}` + '/color/delete/' + id
    );
  }
}
