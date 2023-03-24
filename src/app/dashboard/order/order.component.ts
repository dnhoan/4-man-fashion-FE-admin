import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Subscription, switchMap } from 'rxjs';
import { CommonService } from 'src/app/common-services/common.service';
import { Order, OrderDTO } from 'src/app/model/order.model';
import { Page } from 'src/app/model/pageable.model';
import { SearchOption } from 'src/app/model/search-option.model';
import { OrdersService } from 'src/app/service/order.service';
import { OrderDetailComponent } from './orderDetail/orderDetail.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  subSearchOrder!: Subscription;
  searchOrder: SearchOption = {
    searchTerm: '',
    status: 1,
    offset: 0,
    limit: 10,
  };
  page!: Page;
  orders: Order[] = [];
  searchChange$ = new BehaviorSubject<SearchOption>(this.searchOrder);
  isVisibleModal = false;
  inputOrder: string = '';
  currentOrder!: number;
  constructor(
    private ordersService: OrdersService,
    private router: Router,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef,
    public commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.subSearchOrder = this.searchChange$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((res) => {
          return this.ordersService.getAllOrder(res);
        })
      )
      .subscribe((res: any) => {
        this.page = { ...res };
        this.orders = res.items;
        console.log(this.orders);

      });
  }
  // changeStatusOrder() {
  //   if (this.orderStatusSelected == null) {
  //     this.orderStatusSelected = 999;
  //   }
  //   this.searchOrders();
  // }
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
  openEditOrder(id: number) {
    this.router.navigate([`/admin/order/${id}`]);
  }

}
