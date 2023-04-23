import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  Subscription,
  switchMap,
} from 'rxjs';
import { CommonService } from 'src/app/common-services/common.service';
import { Order, OrderDTO } from 'src/app/dashboard/order/order.model';
import { Page } from 'src/app/model/pageable.model';
import { SearchOption } from 'src/app/model/search-option.model';
import { OrdersService } from 'src/app/dashboard/order/order.service';
import { OrderDetailComponent } from './orderDetail/orderDetail.component';
import { SearchOrder } from 'src/app/model/search-order';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  subSearchOrder!: Subscription;
  searchOrder: SearchOrder = {
    // date: ['', ''],
    delivery: -1,
    purchaseType: -1,
    searchTerm: '',
    status: -1,
    offset: 0,
    limit: 10,
    isLoading: true,
  };
  page!: Page;
  orders: Order[] = [];
  searchChange$ = new BehaviorSubject<SearchOrder>(this.searchOrder);
  isVisibleModal = false;
  inputOrder: string = '';
  currentOrder!: number;
  // date = [new Date(new Date().setDate(new Date().getDate() - 7)), new Date()];

  constructor(
    private ordersService: OrdersService,
    private router: Router,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef,
    public commonService: CommonService,
    public datePipe: DatePipe
  ) {
    // let s_date = this.datePipe.transform(this.date[0], 'dd/MM/yyyy hh:mm');
    // let e_date = this.datePipe.transform(this.date[1], 'dd/MM/yyyy hh:mm');
    // this.searchOrder.date = [s_date!, e_date!];
  }

  ngOnInit(): void {
    this.subSearchOrder = this.searchChange$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((res) => {
          return this.ordersService.searchOrder(res);
        })
      )
      .subscribe((res: any) => {
        this.page = { ...res };
        this.orders = res.items;
        this.searchOrder.isLoading = false;
      });
  }
  search() {
    this.searchOrder.offset = 0;
    this.searchChange$.next({ ...this.searchOrder, isLoading: true });
  }
  createOrder() {
    this.ordersService.createOrder().subscribe((res) => {
      if (res) this.router.navigate([`dashboard/order/${res.orderId}`]);
    });
  }
  onChangeSizePage(event: any) {
    this.searchOrder.limit = event;
    this.searchOrder.offset = 0;
    this.searchChange$.next({ ...this.searchOrder });
  }
  onChangeIndexPage(event: any) {
    --event;
    this.searchOrder.offset = event;
    this.searchChange$.next({ ...this.searchOrder });
  }
  showOrderDetail(order: Order) {
    const modal = this.modal.create({
      nzTitle: 'Chi tiết đơn hàng',
      nzContent: OrderDetailComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        currentOrder: order,
      },
      nzWidth: '1000px',
      nzOnOk: () => new Promise((resolve) => setTimeout(resolve, 1000)),
      nzFooter: [],
    });
  }
  openEditOrder(orderId: string) {
    this.router.navigate([`dashboard/order/${orderId}`]);
  }
}
