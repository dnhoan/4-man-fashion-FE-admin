import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, of } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RequestService } from '../common-services/request.service';
import { SearchOption } from '../model/search-option.model';
import { OrderStatus } from '../model/orderStatus.model';
import { UpdateStatus } from '../model/updateStatus.model';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {

  public apiOrder = `${environment.baseUrl}/api/admin`;
  constructor(
    private httpClient: HttpClient,
    private message: NzMessageService,
    private readonly requestService: RequestService
  ) {}

  getAllOrder(search: SearchOption) {
    return this.requestService
      .get(
        `${this.apiOrder}/order/getAll?offset=${search.offset}&limit=${search.limit}&status=${search.status}&search=${search.searchTerm}`,
        'lấy danh sách đơn hàng'
      )
      .pipe(
        map((res) => {
          if ((res.code = '000')) {
            return res.data;
          } else {
            this.message.error('Lỗi lấy danh sách đơn hàng');
            return false;
          }
        })
      );
  }

  updateOrderStatus(id: number, newStatus: number, cancelNot?: string) {
    let data: UpdateStatus = {
      orderId: id,
      newStatus,
      note: cancelNot ? cancelNot : '',
    };
    return this.httpClient
      .put(`${this.apiOrder}/order/updateOrderStatus`, data)
      .pipe(
        map((res: any) => {
          if (res.code === '000') {
            this.message.success('Cập nhật trạng thái đơn hàng thành công');
            return true;
          }
          return false;
        }),
        catchError(this.handleError<any>('Lỗi cập nhật đơn hàng', false))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.message.error(operation);
      return of(result as T);
    };
  }

  getFeeShip(address: string) {
    let arr = address.split(', ');
    let district = arr[arr.length - 2];
    let province = arr[arr.length - 1];
    let data = {
      package_type: 'express',
      pick_province: 'Hà Nội',
      pick_district: 'Quận Từ Liêm',
      province,
      district,
      address,
      weight: 500,
      value: 0,
      tags: [14],
      transport: 'road',
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${environment.token_ghtk}`,
    });
    return this.httpClient
      .post(`${environment.apiGHTK}`, data, { headers })
      .pipe(
        map((res: any) => {
          if (res.success) {
            return res.fee.ship_fee_only;
          }
          return 0;
        }),
        catchError(this.handleError<any>('Lỗi tính phí giao dịch', 0))
      );
  }
}
