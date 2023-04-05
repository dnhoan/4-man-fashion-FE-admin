import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Subscription } from 'rxjs';
import { CommonConstants } from 'src/app/constants/common-constants';
import { Address, District, Province, Ward } from 'src/app/model/address.model';
import { OrdersService } from 'src/app/dashboard/order/order.service';
import {
  EmailValidator,
  EmptyValidator,
  PhoneNumber,
} from 'src/app/validators/input.validator';
import { OrderDTO } from '../../order/order.model';
import { orderStore } from '../order.repository';
import { AddressesService } from './addresses.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent implements OnInit {
  provinces: Province[] = [];
  districts: District[] = [];
  wards: Ward[] = [];
  formAddress!: FormGroup;
  loadingProvince = false;
  loadingDistrict = false;
  loadingWard = false;
  isVisibleModal = false;
  address!: string;
  order!: OrderDTO;
  constructor(
    private addressService: AddressesService,
    private fb: FormBuilder,
    private modal: NzModalRef,
    private orderService: OrdersService
  ) {
    this.order = orderStore.getValue().orderDto;
  }
  ngOnInit(): void {
    this.loadingProvince = true;
    this.addressService.getProvinces().subscribe((res) => {
      this.provinces = res;
      this.loadingProvince = false;
    });
    this.formAddress = this.fb.group({
      province: [null, Validators.required],
      district: [null, Validators.required],
      ward: [null, Validators.required],
      detail: ['', Validators.compose([EmptyValidator()])],
      // recipientEmail: [this.order.recipientEmail, Validators.email],
      // recipientName: [
      //   this.order.recipientName,
      //   Validators.compose([EmptyValidator()]),
      // ],
      // recipientPhone: [
      //   this.order.recipientPhone,
      //   Validators.compose([PhoneNumber()]),
      // ],
    });
  }
  onSubmit() {
    console.log(this.formAddress);

    if (this.formAddress.valid) {
      let value = this.formAddress.value;
      let province = value.province.name;
      let district = value.district.name;
      let ward = value.detail + ', ' + value.ward.name;
      this.getShipFee(province, district, ward);
    }
  }
  getShipFee(province: string, district: string, address: string) {
    this.orderService
      .getFeeShip(province, district, address)
      .subscribe((res) => {
        console.log(res);

        let addressDetail = address + ', ' + district + ', ' + province;
        orderStore.update((state: any) => {
          let totalMoney =
            state.orderDto.goodsValue + (res ? res : 0) - state.orderDto.sale;
          return {
            orderDto: {
              ...state.orderDto,
              delivery: CommonConstants.DELIVERY_STATUS.DELIVERY,
              shipFee: res ? res : 0,
              address: addressDetail,
              totalMoney,
            },
          };
        });
        if (res) this.modal.destroy(addressDetail);
      });
  }
  cancel() {
    this.modal.destroy(false);
  }
  onChangeProvince(province: Province) {
    this.loadingDistrict = true;
    this.formAddress.patchValue({
      district: null,
      ward: null,
    });
    this.districts = [];
    this.wards = [];
    this.addressService.getDistricts(province.code!).subscribe((res) => {
      this.districts = res;
      this.loadingDistrict = false;
    });
  }
  onChangeDistrict(district: District) {
    if (district) {
      this.loadingWard = true;
      this.formAddress.patchValue({
        ward: null,
      });
      this.wards = [];
      this.addressService.getWards(district.code!).subscribe((res) => {
        this.wards = res;
        this.loadingWard = false;
      });
    }
  }
  onChangeWard(ward: Ward) {
    console.log(this.formAddress.value);
  }
  showModal() {
    this.isVisibleModal = true;
  }
  ngOnDestroy() {}
}
