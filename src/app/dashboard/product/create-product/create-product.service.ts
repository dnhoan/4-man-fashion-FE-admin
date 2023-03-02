import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { switchMap } from 'rxjs';
import { RequestService } from 'src/app/common-services/request.service';
import { ProductDTO } from 'src/app/model/product.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CreateProductService {
  baseUrl = environment.baseUrl;

  constructor(
    private readonly requestService: RequestService,
    private message: NzMessageService
  ) {}

  createProduct(product: ProductDTO) {
    return this.requestService
      .post(`${this.baseUrl}/api/admin/product/create`, product, 'tạo sản phẩm')
      .pipe(
        switchMap((res) => {
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
}
