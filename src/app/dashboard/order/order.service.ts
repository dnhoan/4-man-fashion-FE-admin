import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, of } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RequestService } from '../../common-services/request.service';
import { SearchOption } from '../../model/search-option.model';
import { OrderStatus } from '../../model/orderStatus.model';
import { UpdateStatus } from '../../model/updateStatus.model';
import { OrderDTO } from './order.model';
import {
  DELIVERY_STATUS,
  ORDER_STATUS,
  PURCHASE_TYPE,
} from '../../constants/constant.constant';

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
          if (res.code == '000') {
            return res.data;
          } else {
            this.message.error('Lỗi lấy danh sách đơn hàng');
            return false;
          }
        })
      );
  }
  getOrderByOrderId(orderId: string) {
    return this.requestService
      .get(`${this.apiOrder}/order/${orderId}`, 'lấy đơn hàng')
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return res.data;
          } else if (res.code == '002') {
            this.message.error('Đơn hàng không tồn tại');
            return false;
          } else {
            this.message.error('Lỗi lấy đơn hàng');
            return false;
          }
        })
      );
  }

  updateOrderStatus(id: number, newStatus: number, cancelNote?: string) {
    let data: UpdateStatus = {
      orderId: id,
      newStatus,
      note: cancelNote ? cancelNote : '',
    };
    return this.requestService
      .put(
        `${this.apiOrder}/order/updateOrderStatus`,
        data,
        'cập nhật trạng thái đơn hàng'
      )
      .pipe(
        map((res: any) => {
          if (res.code === '000') {
            this.message.success('Cập nhật trạng thái đơn hàng thành công');
            return res.data;
          } else {
            this.message.error('Lỗi lấy đơn hàng');
            return false;
          }
        })
      );
  }
  createOrder() {
    let data: OrderDTO = {
      id: 0,
      orderId: '',
      orderStatus: ORDER_STATUS.DRAFT,
      recipientName: '',
      recipientPhone: '',
      recipientEmail: '',
      address: '',
      shipFee: 0,
      goodsValue: 0,
      checkout: 0,
      sale: 0,
      totalMoney: 0,
      delivery: DELIVERY_STATUS.NON_DELIVERY,
      purchaseType: PURCHASE_TYPE.STORE,
      note: '',
      cancelNote: '',
      orderDetails: [],
      logsOrderStatus: [
        {
          id: 0,
          user_change: '',
          note: 'Tạo đơn hàng',
          currentStatus: ORDER_STATUS.DRAFT,
          newStatus: ORDER_STATUS.DRAFT,
        },
      ],
    };
    return this.requestService
      .post(`${this.apiOrder}/order/create`, data, 'tạo đơn hàng')
      .pipe(
        map((res: any) => {
          if (res.code === '000') {
            this.message.success('Tạo đơn hàng thành công');
            return res.data;
          } else {
            this.message.error('Lỗi tạo đơn hàng');
            return false;
          }
        })
      );
  }
  updateOrder(order: OrderDTO) {
    return this.requestService
      .put(`${this.apiOrder}/order/update`, order, 'cập nhật đơn hàng')
      .pipe(
        map((res: any) => {
          if (res.code === '000') {
            this.message.success('Cập nhật đơn hàng thành công');
            return res.data;
          } else {
            this.message.error('Lỗi cập nhật đơn hàng');
            return false;
          }
        })
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.message.error(operation);
      return of(result as T);
    };
  }

  getFeeShip(province: string, district: string, address: string) {
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

  checkUpdateOrderStatus(
    currentStatus: number,
    newStatus: number,
    isDelivery: number
  ) {
    if (
      (newStatus == ORDER_STATUS.PACKAGING ||
        newStatus == ORDER_STATUS.DELIVERING) &&
      isDelivery == DELIVERY_STATUS.NON_DELIVERY
    ) {
      this.message.error('Vui lòng chọn giao hàng');
      return false;
    }
    if (
      currentStatus == ORDER_STATUS.DRAFT &&
      [
        ORDER_STATUS.PACKAGING,
        ORDER_STATUS.DELIVERING,
        ORDER_STATUS.COMPLETE,
        ORDER_STATUS.CANCEL_ORDER,
      ].includes(newStatus)
    )
      return true;
    if (
      currentStatus == ORDER_STATUS.PENDING &&
      [
        ORDER_STATUS.CONFIRMED,
        ORDER_STATUS.PACKAGING,
        ORDER_STATUS.DELIVERING,
        ORDER_STATUS.COMPLETE,
        ORDER_STATUS.CANCEL_ORDER,
      ].includes(newStatus)
    )
      return true;
    if (
      currentStatus == ORDER_STATUS.CONFIRMED &&
      [
        ORDER_STATUS.PACKAGING,
        ORDER_STATUS.DELIVERING,
        ORDER_STATUS.COMPLETE,
        ORDER_STATUS.CANCEL_ORDER,
      ].includes(newStatus)
    )
      return true;
    if (
      currentStatus == ORDER_STATUS.PACKAGING &&
      [
        ORDER_STATUS.DRAFT,
        ORDER_STATUS.DELIVERING,
        ORDER_STATUS.COMPLETE,
        ORDER_STATUS.CANCEL_ORDER,
      ].includes(newStatus)
    )
      return true;
    if (
      currentStatus == ORDER_STATUS.DELIVERING &&
      [ORDER_STATUS.COMPLETE, ORDER_STATUS.CANCEL_ORDER].includes(newStatus)
    )
      return true;
    if (
      currentStatus == ORDER_STATUS.COMPLETE &&
      [ORDER_STATUS.EXCHANGE, ORDER_STATUS.CANCEL_ORDER].includes(newStatus)
    )
      return true;
    if (
      currentStatus == ORDER_STATUS.EXCHANGE &&
      [ORDER_STATUS.COMPLETE, ORDER_STATUS.CANCEL_ORDER].includes(newStatus)
    )
      return true;
    this.message.error('Không thể chuyển trạng thái đơn hàng');
    return false;
  }
}
