import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, of } from 'rxjs';
import { Category, CategoryDTO } from '../model/category.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  public apiCategory = `${environment.baseUrl}/api/admin`;
  constructor(private httpClient: HttpClient, private toastr: ToastrService) {}

  getAllCategory(offset: any, limit: any, status: number): Observable<any> {
    return this.httpClient.get<any>(
      this.apiCategory +
        '/category/getAll?offset=' +
        offset +
        '&limit=' +
        limit +
        '&status=' +
        1
    );
  }

  getListCategory(): Observable<any> {
    return this.httpClient.get<any>(
      this.apiCategory +
        '/category/getList'
    );
  }

  createCategory(category: CategoryDTO) {
    return this.httpClient
      .post(`${this.apiCategory}/category/create`, category)
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

  public updateCategory(category: Category): Observable<any> {
    return this.httpClient.put<any>(
      this.apiCategory + '/category/update',
      category
    );
  }


  public deleteCategory(id: any): Observable<any> {
    return this.httpClient.delete<any>(
      `${this.apiCategory}` + '/category/delete/' + id
    );
  }
}
