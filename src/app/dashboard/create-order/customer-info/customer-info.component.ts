import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import {
  ORDER_STATUS,
  PURCHASE_TYPE,
} from 'src/app/constants/constant.constant';
import { environment } from 'src/environments/environment';
import { CustomerService } from '../../customer/customer.service';
import { CustomerDto } from '../../customer/customerDto.model';
import { orderStore } from '../order.repository';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CreateCustomerComponent } from './create-customer/create-customer.component';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.scss'],
})
export class CustomerInfoComponent implements OnInit {
  @Input('orderStatus') orderStatus!: number;
  @Input('purchaseType') purchaseType!: number;
  baseUrl = environment.baseUrl;
  searchChange$ = new BehaviorSubject('');
  customers: CustomerDto[] = [];
  isLoading = false;
  subSearchCustomer!: Subscription;
  customer!: CustomerDto;
  statuses = ORDER_STATUS;
  purchaseTypes = PURCHASE_TYPE;
  onSearch(value: string): void {
    if (value) {
      this.isLoading = true;
      this.searchChange$.next(value);
    }
  }

  constructor(
    private customerService: CustomerService,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    let customer_id = orderStore.getValue().orderDto.customerId;
    if (customer_id) {
      this.customer = orderStore.getValue().orderDto.customerInfo!;
    }
    this.subSearchCustomer = this.searchChange$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((term: string) => this.customerService.getPageCustomer(term))
      )
      .subscribe((res) => {
        this.isLoading = false;
        this.customers = res;
      });
  }
  createCustomer() {
    const modal = this.modal.create({
      nzTitle: 'Thêm khách hàng',
      nzContent: CreateCustomerComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzFooter: null,
    });
    modal.afterClose.subscribe((result) => {
      if (result) {
        this.customers.unshift(result);
        this.message.success('Thêm khách hàng thành công');
      }
    });
  }
  changeCustomer() {
    if (this.customer) {
      orderStore.update((state: any) => {
        return {
          orderDto: {
            ...state.orderDto,
            customerId: this.customer.id,
            customerDTO: this.customer,
            recipientEmail: this.customer!.email,
            recipientName: this.customer!.customerName,
            recipientPhone: this.customer!.phoneNumber,
          },
        };
      });
    } else {
      orderStore.update((state: any) => {
        return {
          orderDto: {
            ...state.orderDto,
            customerId: null,
            customerDTO: {},
            recipientEmail: '',
            recipientName: '',
            recipientPhone: '',
          },
        };
      });
    }
  }
  ngOnDestroy() {
    this.subSearchCustomer.unsubscribe();
  }
}
