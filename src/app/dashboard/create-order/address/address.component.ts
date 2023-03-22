import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { orderStore } from '../order.repository';
import { OrdersService } from 'src/app/service/order.service';
export interface Address {
  code: number;
  name: string;
}
@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {
  @Input('address') address: string = '';
  initAdress = {
    code: 0,
    name: '',
  };
  baseUrl = 'https://provinces.open-api.vn/api';
  isVisibleModal = false;
  provinces: Address[] = [];
  districts: Address[] = [];
  warts: Address[] = [];
  addressDetail = '';
  provinceSelected!: Address;
  districtSelected!: Address;
  wartSelected!: Address;
  isLoadingProvince = false;
  isLoadingDistrict = false;
  isLoadingWart = false;
  constructor(private http: HttpClient,
    private orderService: OrdersService) {}

  ngOnInit() {
    this.isLoadingProvince = true;
    this.http.get(`${this.baseUrl}/p`).subscribe((res: any) => {
      this.provinces = res.map((r: any) => ({ code: r.code, name: r.name }));
      this.isLoadingProvince = false;
    });
  }
  changeProvince() {
    this.districts = [];
    this.districtSelected = this.initAdress;
    this.warts = [];
    this.wartSelected = this.initAdress;
    if (this.provinceSelected) {
      this.isLoadingDistrict = true;
      this.http
        .get(`${this.baseUrl}/d/search/?p=${this.provinceSelected.code}&q=*`)
        .subscribe((res: any) => {
          this.districts = res.map((r: any) => ({
            code: r.code,
            name: r.name,
          }));
          this.isLoadingDistrict = false;
          this.districtSelected = this.initAdress;
        });
    }
  }
  changeDistrict() {
    this.warts = [];
    this.wartSelected = this.initAdress;
    if (this.districtSelected) {
      this.isLoadingWart = true;
      this.http
        .get(
          `${this.baseUrl}/w/search/?d=${this.districtSelected.code}&p=${this.provinceSelected.code}&q=*`
        )
        .subscribe((res: any) => {
          this.warts = res.map((r: any) => ({ code: r.code, name: r.name }));
          this.isLoadingWart = false;
        });
    }
  }
  showModal() {
    this.isVisibleModal = true;
  }
  handleCancel() {
    this.isVisibleModal = false;
  }
  handleOk() {
    this.isVisibleModal = false;
    this.address =
      this.addressDetail +
      ', ' +
      this.wartSelected.name +
      ', ' +
      this.districtSelected.name +
      ', ' +
      this.provinceSelected.name;
    this.orderService.getFeeShip(this.address).subscribe((res) => {
      orderStore.update((state) => ({
        orderDto: {
          ...state.orderDto,
          address: this.address,
          delivery: 1,
          shipFee: res,
        },
      }));
    });
  }
  changeAddress(detail: string) {}
}
