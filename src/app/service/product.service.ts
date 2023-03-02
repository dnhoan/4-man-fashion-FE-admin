import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { catchError, finalize, map, Observable, of } from 'rxjs';
import { Product, ProductDTO } from 'src/app/model/product.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  apiProduct = `${environment.baseUrl}/api/admin`;
  downloadURL!: Observable<string>;
  constructor(
    private httpClient: HttpClient,
    private message: NzMessageService
  ) {}

  getAllProduct(
    offset: any,
    limit: any,
    status: number,
  ): Observable<any> {
    return this.httpClient.get<any>(
      this.apiProduct +
        '/product/getAll?offset=' +
        offset +
        '&limit=' +
        limit +
        '&status=' +
        1
    );
  }


  getListproduct(): Observable<any> {
    return this.httpClient.get<any>(
      this.apiProduct +
        '/product/getList'
    );
  }


  createProduct(product: ProductDTO) {
    return this.httpClient.post(`${this.apiProduct}/product`, product).pipe(
      map((res: any) => {
        if (res.statusCode === 201) {
          return res.data.product;
        }
        return [];
      }),
    );
  }


  public updateProduct(product: Product): Observable<any> {
    return this.httpClient.put<any>(
      this.apiProduct + '/product/update',
      product
    );
  }

  public deleteProduct(id: any): Observable<any> {
    return this.httpClient.delete<any>(
      `${this.apiProduct}` + '/product/updateStatus/' + id
    );
  }
}
