import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  Subscription,
  switchMap,
} from 'rxjs';
import { CommonService } from 'src/app/common-services/common.service';
import { CommonConstants } from 'src/app/constants/common-constants';
import { SearchOption } from 'src/app/model/search-option.model';
import { Size } from 'src/app/model/size.model';
import { Voucher, VoucherDTO } from 'src/app/model/voucher.model';
import { Page } from 'src/app/model/pageable.model';
import { VoucherService } from 'src/app/service/voucher.service';
import { formatDate } from '@angular/common';
import { getISOWeek } from 'date-fns';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.scss'],
})
export class VoucherComponent implements OnInit {
  subSearchSize!: Subscription;
  searchVoucher: SearchOption = {
    searchTerm: '',
    status: 1,
    offset: 0,
    limit: 10,
  };
  page!: Page;
  vouchers: Voucher[] = [];
  searchChange$ = new BehaviorSubject<SearchOption>(this.searchVoucher);
  isVisibleModal = false;
  inputVoucherCode: string = '';
  inputVoucherName: string = '';
  startDate!: Date;
  endDate!: Date;
  voucherType!: number;
  quantity!: number;
  currentVoucher!: any;
  lstType = [
    { id:1, label: 'Phần trăm', value: 'Phần trăm' },
    { id:0, label: 'VNĐ', value: 'VNĐ' },
  ];
  compareFn = (o1: any, o2: any): boolean =>
    o1 && o2 ? o1.value === o2.value : o1 === o2;
  discount!: number;
  minimumInvoiceValue!: number;

  constructor(
    private voucherService: VoucherService,
    public commonService: CommonService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.subSearchSize = this.searchChange$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((res) => {
          return this.voucherService.getAllVoucher(res);
        })
      )
      .subscribe((res: any) => {
        this.page = { ...res };
        this.vouchers = res.items;
      });
  }
  search(value: any) {
    this.searchVoucher.searchTerm = value;
    this.searchVoucher.offset = 0;
    this.searchChange$.next({ ...this.searchVoucher });
  }
  onChangeStatus(status: any) {
    this.searchVoucher.status = status;
    this.searchVoucher.offset = 0;
    this.searchChange$.next({ ...this.searchVoucher });
  }
  onChangeSizePage(event: any) {
    this.searchVoucher.limit = event;
    this.searchChange$.next({ ...this.searchVoucher });
  }
  onChangeIndexPage(event: any) {
    --event;
    this.searchVoucher.offset = event;
    this.searchChange$.next({ ...this.searchVoucher });
  }
  showModal(): void {
    this.isVisibleModal = true;
  }

  handleOk() {
    if (this.validateSize()) {
      this.messageError = '';
      if (this.currentVoucher >= 0) {
        this.updateVoucher();
        return;
      }
      this.createVoucher();
    }
    this.isVisibleModal = false;
  }

  handleCancel(): void {
    this.inputVoucherCode = '';
    this.inputVoucherName = '';
    this.messageError = '';
    this.currentVoucher = '-1';
    this.isVisibleModal = false;
  }

  messageError = '';
  validateSize() {
    if (this.inputVoucherName.trim().length == 0) {
      this.messageError = 'Vui lòng nhập tên voucher';
      return false;
    }
    if (this.inputVoucherName.trim().length > 255) {
      this.messageError = 'Vui lòng nhập tên voucher dưới 255 ký tự';
      return false;
    }
    return true;
  }

  createVoucher() {
    this.voucherService
      .createVoucher({
        id: 0,
        voucherCode: this.inputVoucherCode,
        voucherName: this.inputVoucherName,
        startDate: this.startDate,
        endDate: this.endDate,
        voucherType: this.voucherType,
        minimumInvoiceValue: this.minimumInvoiceValue,
        discount: this.discount,
        quantity: this.quantity,
        status: CommonConstants.STATUS.ACTIVE,
      })
      .subscribe((res) => {
        if (res) {
          this.vouchers.unshift(res);
          this.isVisibleModal = false;
        }
      });
      this.isVisibleModal = false;
  }

  updateVoucher() {
    this.voucherService
      .updateVoucher({
        ...this.vouchers[this.currentVoucher],
        voucherCode: this.inputVoucherCode,
        voucherName: this.inputVoucherName,
        startDate: this.startDate,
        endDate: this.endDate,
        voucherType: this.voucherType,
        discount: this.discount,
        minimumInvoiceValue: this.minimumInvoiceValue,
        quantity: this.quantity,
      })
      .subscribe((res) => {
        if (res) {
          this.vouchers[this.currentVoucher] = res;
        }
      });
      this.isVisibleModal = false;
  }

  updateStatus(voucher: Voucher, index: number, status: number) {
    this.modal.confirm({
      nzTitle:
        'Bạn có muốn ' +
        (status == 0 ? 'xóa' : 'khôi phục') +
        ' voucher này không?',
      nzOnOk: () => {
        this.voucherService
          .updateStatus({ ...voucher, status })
          .subscribe((res) => {
            if (res) {
              if (this.searchVoucher.status == -1) {
                this.vouchers[(index = res)];
              } else {
                this.vouchers.splice(index, 1);
              }
            }
          });
      },
    });
  }

  showModalEdit(index: number) {
    this.currentVoucher = index;
    this.inputVoucherCode = this.vouchers[this.currentVoucher].voucherCode!;
    this.inputVoucherName = this.vouchers[this.currentVoucher].voucherName!;
    this.startDate = this.vouchers[this.currentVoucher].startDate!;
    this.endDate = this.vouchers[this.currentVoucher].endDate!;
    this.voucherType = this.vouchers[this.currentVoucher].voucherType!;
    this.discount = this.vouchers[this.currentVoucher].discount!;
    this.minimumInvoiceValue = this.vouchers[this.currentVoucher].minimumInvoiceValue!;
    this.quantity = this.vouchers[this.currentVoucher].quantity!;
    this.showModal();
  }
}
