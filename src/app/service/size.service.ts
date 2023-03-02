import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { SizeDTO } from '../model/size.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class SizeService {
  public apiSize = `${environment.baseUrl}/api/admin`;
  constructor(private httpClient: HttpClient, private toastr: ToastrService) {}

  getAllSize(offset: any, limit: any, status: number): Observable<any> {
    return this.httpClient.get<any>(
      this.apiSize +
        '/size/getAll?offset=' +
        offset +
        '&limit=' +
        limit +
        '&status=' +
        1
    );
  }

  getListSize(): Observable<any> {
    return this.httpClient.get<any>(
      this.apiSize +
        '/size/getList'
    );
  }


  createSize(size: SizeDTO) {
    return this.httpClient.post(`${this.apiSize}/size/create`, size).pipe(
      map((res: any) => {
        if (res.code === 200) {
          this.toastr.success('Thêm dữ liệu thành công');
          return res.data.items;
        }
        return [];
      })
    );
  }

  public updateSize(size: SizeDTO): Observable<any> {
    return this.httpClient.put<any>(
      this.apiSize + '/size/update',
      size
    );
  }

  public deleteSize(id: any): Observable<any> {
    return this.httpClient.delete<any>(
      `${this.apiSize}` + '/size/delete/' + id
    );
  }
}
