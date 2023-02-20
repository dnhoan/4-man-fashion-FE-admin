import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, of } from 'rxjs';
import { MaterialDTO } from '../model/material.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class MaterialService {
  public apiMaterial = `${environment.baseUrl}/api/admin`;
  constructor(private httpClient: HttpClient, private toastr: ToastrService) {}

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

  createMaterial(material: MaterialDTO) {
    return this.httpClient
      .post(`${this.apiMaterial}/material/create`, material)
      .pipe(
        map((res: any) => {
          if (res.code === 200) {
            this.toastr.success('Thêm dữ liệu thành công');
            return res.data.items;
          }
          return [];
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
