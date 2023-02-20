
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductDetailService {
  public apiProductDetail = `${environment.baseUrl}/api/admin`;
  constructor(private httpClient: HttpClient, private toastr: ToastrService) {}

  getAllProductDetail(): Observable<any> {
    return this.httpClient.get<any>(
      this.apiProductDetail +
        '/productDetail/getAll'
    );
  }
}
