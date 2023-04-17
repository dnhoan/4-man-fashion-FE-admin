import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { catchError, finalize, map, Observable, of } from 'rxjs';
import { Product, ProductDTO } from 'src/app/model/product.model';
import { environment } from 'src/environments/environment';
import { RequestService } from '../../common-services/request.service';
import { SearchOption } from '../../model/search-option.model';
import { CommonConstants } from 'src/app/constants/common-constants';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  apiProduct = `${environment.baseUrl}/api/admin`;
  downloadURL!: Observable<string>;
  constructor(
    private httpClient: HttpClient,
    private message: NzMessageService,
    private requestService: RequestService
  ) {}

  getAllProduct(search: SearchOption) {
    return this.requestService
      .get(
        `${this.apiProduct}/product/getAll?offset=${search.offset}&limit=${search.limit}&status=${search.status}&search=${search.searchTerm}`,
        'lấy danh sách sản phẩm'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return res.data;
          } else {
            this.message.error('Lỗi lấy danh sách sản phẩm');
            return false;
          }
        })
      );
  }

  getListproduct(): Observable<any> {
    return this.httpClient.get<any>(this.apiProduct + '/product/getList');
  }

  createProduct(product: ProductDTO) {
    return this.requestService
      .post(`${this.apiProduct}/product/create`, product, 'tạo sản phẩm')
      .pipe(
        map((res) => {
          if (res.code == '000') {
            this.message.success('Tạo sản phẩm thành công');
            return res.data;
          } else if (res.code == '409')
            this.message.error('Trùng tên sản phẩm');
          else this.message.error('Lỗi tạo sản phẩm');
          return false;
        })
      );
  }
  updateProduct(product: ProductDTO) {
    return this.requestService
      .put(`${this.apiProduct}/product/update`, product, 'cập nhật sản phẩm')
      .pipe(
        map((res) => {
          if (res.code == '000') {
            this.message.success('Cập nhật sản phẩm thành công');
            return res.data;
          } else if (res.code == '409')
            this.message.error('Tên sản phẩm đã tồn tại');
          else this.message.error('Lỗi cập nhật sản phẩm');
          return false;
        })
      );
  }
  updateStatus(id: number, status: number) {
    let action =
      status == CommonConstants.STATUS.INACTIVE ? 'Xóa' : 'Khôi phục';
    return this.requestService
      .put(
        `${this.apiProduct}/product/updateStatus`,
        { id, status },
        action + ' sản phẩm'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            this.message.success(action + ' sản phẩm thành công');
            return res.data;
          } else if (res.code == '002') {
            this.message.error('Lỗi ' + action + ' sản phẩm');
            return false;
          } else {
            this.message.error('Lỗi ' + action + ' sản phẩm');
            return false;
          }
        })
      );
  }
  public deleteProduct(id: any): Observable<any> {
    return this.httpClient.delete<any>(
      `${this.apiProduct}` + '/product/updateStatus/' + id
    );
  }
}
