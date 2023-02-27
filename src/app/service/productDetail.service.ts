import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root',
})
export class ProductDetailService {
  public apiProductDetail = `${environment.baseUrl}/api/admin`;
  constructor(
    private httpClient: HttpClient,
    private message: NzMessageService
  ) {}

  getAllProductDetail(): Observable<any> {
    return this.httpClient.get<any>(
      this.apiProductDetail + '/productDetail/getAll'
    );
  }
}
