import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, of } from 'rxjs';
import { Category, CategoryDTO } from '../model/category.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RequestService } from '../common-services/request.service';
import { SearchOption } from '../model/search-option.model';

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

  getAllCategory(search: SearchOption) {
    return this.requestService
      .get(
        `${this.apiCategory}/category/getAll?offset=${search.offset}&limit=${search.limit}&status=${search.status}&search=${search.searchTerm}`,
        'lấy danh sách loại sản phẩm'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return res.data;
          } else {
            this.message.error('Lỗi lấy danh sách loại sản phẩm');
            return false;
          }
        })
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

  updateCategory(category: Category) {
    return this.requestService
      .put(
        `${this.apiCategory}/category/update`,
        category,
        'cập nhật loại sản phẩm'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            this.message.success('Cập nhật loại sản phẩm thành công');
            return res.data;
          } else if (res.code == '409') {
            this.message.error('Tên loại sản phẩm đã tồn tại');
            return false;
          } else {
            this.message.error('Lỗi cập nhật loại sản phẩm');
            return false;
          }
        })
      );
  }

  updateStatus(category: Category) {
    let action = category.status == 0 ? 'Xóa' : 'Khôi phục';
    return this.requestService
      .put(
        `${this.apiCategory}/category/update`,
        category,
        action + ' loại sản phẩm'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            this.message.success(action + ' loại sản phẩm thành công');
            return res.data;
          } else {
            this.message.error('Lỗi ' + action + ' loại sản phẩm');
            return false;
          }
        })
      );
  }
}
