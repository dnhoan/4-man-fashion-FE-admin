import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
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
import { environment } from 'src/environments/environment';
import { CustomerService } from '../../customer/customer.service';
import { CustomerDto } from '../../customer/customerDto.model';
import { orderStore } from '../order.repository';

@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.scss'],
})
export class CustomerInfoComponent implements OnInit {
  baseUrl = environment.baseUrl;
  searchChange$ = new BehaviorSubject('');
  customers: CustomerDto[] = [];
  isLoading = false;
  subSearchCustomer!: Subscription;
  customer!: CustomerDto;
  onSearch(value: string): void {
    if (value) {
      this.isLoading = true;
      this.searchChange$.next(value);
    }
  }

  constructor(private customerService: CustomerService) {}

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
  changeCustomer() {
    if (this.customer) {
      orderStore.update((state: any) => {
        return {
          orderDto: {
            ...state.orderDto,
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
