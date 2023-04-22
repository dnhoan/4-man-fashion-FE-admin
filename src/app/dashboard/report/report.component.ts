import { Component, OnInit, ViewChild } from '@angular/core';
import { getISOWeek } from 'date-fns';
import { ReportService } from './report.service';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/common-services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';

export interface StatisticIncome {
  dt_store: number;
  dt_online: number;
  ngay?: string | null;
  thang?: number;
}
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {
  mode = 'date';
  options: any;
  data: any;
  date = [new Date(new Date().setDate(new Date().getDate() - 30)), new Date()];
  orderStatuses: any;
  orderStatusOptions: any = null;

  totalOrder: number = 0;
  totalOrderIsCheckout: number = 0;
  dt_online: number = 0;
  dt_store: number = 0;
  bestSellingProducts: {
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[] = [];
  message: string = '';
  constructor(
    private reportService: ReportService,
    public datePipe: DatePipe,
    private commonService: CommonService
  ) {}
  ngOnInit() {
    this.report();
  }
  valid() {
    if (this.date[0] && this.date[1]) {
      this.message = '';
      return true;
    } else {
      this.message = 'Vui lòng chọn ngày bắt đầu và kết thúc';
      return false;
    }
  }
  report() {
    if (this.valid()) {
      let s_date = this.datePipe.transform(this.date[0], 'dd/MM/yyyy');
      let e_date = this.datePipe.transform(this.date[1], 'dd/MM/yyyy');
      // get order total
      this.reportService.getOrderTotal(s_date!, e_date!).subscribe((res) => {
        if (res) this.totalOrder = res;
        else this.totalOrder = 0;
      });
      this.reportService
        .getOrderTotalIsCheckout(s_date!, e_date!)
        .subscribe((res) => {
          if (res) this.totalOrderIsCheckout = res;
          else this.totalOrderIsCheckout = 0;
        });

      this.reportService.getRevenueTotal(s_date!, e_date!).subscribe((res) => {
        if (res) {
          this.dt_online = res.dt_online;
          this.dt_store = res.dt_store;
        } else {
          this.dt_online = 0;
          this.dt_store = 0;
        }
      });
      this.reportService
        .getStatisticIncomeByDate(s_date!, e_date!)
        .subscribe((res: StatisticIncome[]) => {
          if (res) {
            let i_date: Date = new Date(this.date[0].getTime());
            let dataReport: StatisticIncome[] = [];
            while (i_date.getTime() <= this.date[1].getTime()) {
              let ngay = this.datePipe.transform(i_date, 'dd/MM/yyyy');
              let report: StatisticIncome[] = res.filter((r) => r.ngay == ngay);
              if (report && report.length) {
                dataReport.push({
                  ngay: ngay,
                  dt_store: report[0].dt_store,
                  dt_online: report[0].dt_online,
                });
              } else {
                dataReport.push({
                  ngay: ngay,
                  dt_store: 0,
                  dt_online: 0,
                });
              }
              i_date.setDate(i_date.getDate() + 1);
            }
            this.data = {
              labels: dataReport.map((d) => d.ngay),
              datasets: [
                {
                  type: 'bar',
                  label: 'DT cửa hàng',
                  backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                  data: dataReport.map((d) => d.dt_store),
                },
                {
                  type: 'bar',
                  label: 'DT online',
                  backgroundColor:
                    documentStyle.getPropertyValue('--green-500'),
                  data: dataReport.map((d) => d.dt_online),
                },
              ],
            };
          }
        });

      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');

      const textColorSecondary = documentStyle.getPropertyValue(
        '--text-color-secondary'
      );
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

      this.options = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
          tooltips: {
            mode: 'index',
            intersect: false,
          },
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
        scales: {
          x: {
            stacked: true,
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false,
            },
          },
          y: {
            stacked: true,
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false,
            },
          },
        },
      };

      this.reportService
        .getStatisticOrderStatus(s_date!, e_date!)
        .subscribe((res) => {
          if (res) {
            this.orderStatuses = {
              labels: this.commonService.orderStatuses.map((o) => o.statusName),
              datasets: [
                {
                  data: res,
                  backgroundColor: this.commonService.orderStatuses.map(
                    (o) => o.color
                  ),
                  hoverBackgroundColor: this.commonService.orderStatuses.map(
                    (o) => o.color
                  ),
                },
              ],
            };
          }
        });

      this.reportService
        .getStatisticBestSellingProduct(s_date!, e_date!)
        .subscribe((res) => {
          if (res) this.bestSellingProducts = res;
        });
    }
  }
}
