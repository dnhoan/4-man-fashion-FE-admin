import { Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs';
import { Page } from 'src/app/model/pageable.model';
import { SearchOption } from 'src/app/model/search-option.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from './customer.service';
import { CommonService } from 'src/app/common-services/common.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Customer } from './customerDto.model';
import { CommonConstants } from 'src/app/constants/common-constants';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent implements OnInit {
  subsearchCustomer!: Subscription;
  searchCustomer: SearchOption = {
    searchTerm: '',
    status: 1,
    offset: 0,
    limit: 10,
  };
  page!: Page;
  formCustomer!: FormGroup;
  customers: Customer[] = [];
  customer: Customer = {};
  searchChange$ = new BehaviorSubject<SearchOption>(this.searchCustomer);
  isVisibleModal = false;
  currentCus!: number;
  submit = false;

  constructor(
    private customerService: CustomerService,
    public commonService: CommonService,
    private modal: NzModalService,
    private fb: FormBuilder,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.getAllCustomer();
  }
  search(value: any) {
    this.searchCustomer.searchTerm = value;
    this.searchCustomer.offset = 0;
    this.searchChange$.next({ ...this.searchCustomer });
  }
  onChangeStatus(status: any) {
    this.searchCustomer.status = status;
    this.searchCustomer.offset = 0;
    this.searchChange$.next({ ...this.searchCustomer });
  }
  onChangeCustomerPage(event: any) {
    this.searchCustomer.limit = event;
    this.searchChange$.next({ ...this.searchCustomer });
  }
  onChangeIndexPage(event: any) {
    --event;
    this.searchCustomer.offset = event;
    this.searchChange$.next({ ...this.searchCustomer });
  }
  showModalE(): void {
    this.isVisibleModal = true;
  }

  showModal(): void {
    this.submit = false;
    // if (action === 'save') this.action = true;
    // if (action === 'update') this.action = false;
    this.formCustomer = this.fb.group({
      id: null,
      customerName: ['', [Validators.required]],
      gender: [''],
      birthday: ['', [Validators.required]],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.pattern('(84|0[3|5|7|8|9])+([0-9]{8})'),
        ],
      ],
      address: [''],
      email: ['', [Validators.required, Validators.email]],
      note: [''],
    });
    this.isVisibleModal = true;
  }

  fillValueForm() {
    this.formCustomer.patchValue({
      id: this.customer.id,
      customerName: this.customer.customerName,
      gender: this.customer.gender,
      birthday: this.customer.birthday,
      phoneNumber: this.customer.phoneNumber,
      address: this.customer.address,
      email: this.customer.email,
      note: this.customer.note,
    });
  }

  getInfoCustomer(customer: Customer) {
    this.showModal();
    const customerByID = this.customers.find((value) => {
      return value == customer;
    });
    if (customerByID) {
      this.customer = customerByID;
    }
    this.fillValueForm();
    this.formCustomer.get('email')?.disable();
    this.formCustomer.get('phoneNumber')?.disable();
  }

  handleOk(): void {
    this.submit = true;
    if(this.formCustomer.valid){
      this.saveCustomer();
    }
  }

  saveCustomer() {
    this.addValueCustomer();
    if (this.formCustomer.value.id) {
      this.updateCustomer();
    }
    if (!this.formCustomer.value.id) {
      this.addAccount(this.customer);
    }
  }

  handleCancel(): void {
    this.isVisibleModal = false;
    this.getAllCustomer();
  }

  getAllCustomer() {
    this.subsearchCustomer = this.searchChange$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((res) => {
          return this.customerService.getAllCustomer(res);
        })
      )
      .subscribe((res: any) => {
        this.page = { ...res };
        this.customers = res.items;
      });
  }

  addAccount(customer: Customer) {
    if(this.formCustomer.valid){
      this.customerService.createCustomer(customer).subscribe(
        (res) => {
          if (res.code === '000') {
            this.isVisibleModal = false;
            this.message.success('Tạo Khách hàng thành công!');
          } else {
            this.isVisibleModal = true;
            this.message.error(`${res.desc}`);
          }
          this.getAllCustomer();
          return;
        }
      );
    }
  }

  updateCustomer() {
    if(this.formCustomer.valid){
      this.formCustomer.get('email')?.enable();
      this.formCustomer.get('phoneNumber')?.enable();
      this.addValueCustomer();
      this.customerService.updateCustomer(this.customer).subscribe((res) => {
        if (res.code === '000') {
          this.isVisibleModal = false;
          this.message.success('Cập nhật tài khoản thành công!');
          this.getAllCustomer();
        } else {
          this.isVisibleModal = true;
          this.message.error(`${res.desc}`);
        }
        return;
      });
    }
  }

  updateStatus(customer: Customer, index: number, status: number) {
    this.modal.confirm({
      nzTitle:
        'Bạn có muốn ' +
        (status == 0 ? 'xóa' : 'khôi phục') +
        ' khách hàng này không?',
      nzOnOk: () => {
        this.customerService
          .updateStatus({ ...customer, status })
          .subscribe((res) => {
            if (res) {
              if (this.searchCustomer.status == -1) {
                this.customers[index] = res;
              } else {
                this.customers.splice(index, 1);
              }
            }
          });
      },
    });
  }

  addValueCustomer() {
    // let bd;
    // if (this.customer.birthday) bd = this.reFormatDate(this.customer.birthday);
    // else bd = null;

    this.customer.customerName = this.formCustomer.value.customerName;
    this.customer.gender = this.formCustomer.value.gender;
    this.customer.phoneNumber = this.formCustomer.value.phoneNumber;
    this.customer.birthday = this.formCustomer.value.birthday;
    this.customer.email = this.formCustomer.value.email;
    this.customer.address = this.formCustomer.value.address;
    this.customer.note = this.formCustomer.value.note;
  }
}
