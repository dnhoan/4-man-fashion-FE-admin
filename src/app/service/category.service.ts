import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, of } from 'rxjs';
import { Category, CategoryDTO } from '../model/category.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RequestService } from '../common-services/request.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  public apiCategory = `${environment.baseUrl}/api/admin`;
  constructor(
    private httpClient: HttpClient,
    private message: NzMessageService,
    private readonly requestService: RequestService
  ) {}

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
    return this.httpClient.get<any>(this.apiCategory + '/category/getList');
  }
  createCategory(category: CategoryDTO) {
    return this.requestService
      .post(`${this.apiCategory}/category/create`, category, 'tạo mới danh mục')
      .pipe(
        map((res) => {
          if (res.code == '000') {
            this.message.success('Tạo danh mục thành công');
            return res.data;
          } else if (res.code == '409') {
            this.message.error('Tên danh mục đã tồn tại');
            return false;
          } else {
            this.message.error('Lỗi tạo danh mục');
            return false;
          }
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
