import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { map } from 'rxjs';
import { RequestService } from 'src/app/common-services/request.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  public apiAdmin = `${environment.baseUrl}/api/admin`;
  constructor(
    private message: NzMessageService,
    private readonly requestService: RequestService
  ) {}

  getOrderTotalIsCheckout(s_date: string, e_date: string) {
    return this.requestService
      .get(
        `${this.apiAdmin}/getOrderTotalIsCheckout?time1=${s_date}&time2=${e_date}`,
        'lấy tổng đơn hàng'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return res.data;
          } else {
            this.message.error('lấy tổng đơn hàng');
            return false;
          }
        })
      );
  }

  getOrderTotal(s_date: string, e_date: string) {
    return this.requestService
      .get(
        `${this.apiAdmin}/getOrderTotal?time1=${s_date}&time2=${e_date}`,
        'lấy tổng đơn hàng'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return res.data;
          } else {
            this.message.error('lấy tổng đơn hàng');
            return false;
          }
        })
      );
  }
  getRevenueTotal(s_date: string, e_date: string) {
    return this.requestService
      .get(
        `${this.apiAdmin}/getRevenueTotal?time1=${s_date}&time2=${e_date}`,
        'lấy tổng doanh thu'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return res.data;
          } else {
            this.message.error('lấy tổng doanh thu');
            return false;
          }
        })
      );
  }
  getStatisticIncomeByDate(s_date: string, e_date: string) {
    return this.requestService
      .get(
        `${this.apiAdmin}/statisticIncome/date?time1=${s_date}&time2=${e_date}`,
        'thu nhap theo ngay'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return res.data;
          } else {
            this.message.error('thu nhap theo ngay');
            return false;
          }
        })
      );
  }
  getStatisticOrderStatus(s_date: string, e_date: string) {
    return this.requestService
      .get(
        `${this.apiAdmin}/statisticOrderStatus?time1=${s_date}&time2=${e_date}`,
        'thong ke trang thai'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return res.data;
          } else {
            this.message.error('thong ke trang thai');
            return false;
          }
        })
      );
  }
  getStatisticBestSellingProduct(s_date: string, e_date: string) {
    return this.requestService
      .get(
        `${this.apiAdmin}/statisticBestSellingProduct?time1=${s_date}&time2=${e_date}`,
        'top san pham ban chay'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return res.data;
          } else {
            this.message.error('top san pham ban chay');
            return false;
          }
        })
      );
  }
}
