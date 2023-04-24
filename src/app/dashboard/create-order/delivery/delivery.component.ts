import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { OrdersService } from 'src/app/dashboard/order/order.service';
import {
  EmailValidator,
  EmptyValidator,
  PhoneNumber,
} from 'src/app/validators/input.validator';
import { OrderDTO } from '../../order/order.model';
import { AddressComponent } from '../address/address.component';
import { orderStore } from '../order.repository';
import { ORDER_STATUS } from 'src/app/constants/constant.constant';
@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss'],
})
export class DeliveryComponent implements OnInit {
  @Input('address') address!: string;
  @Input('delivery') delivery!: number;
  formDeliveryInfo!: FormGroup;
  @Input('order') order!: OrderDTO;
  ORDER_STATUS = ORDER_STATUS;
  constructor(
    private orderService: OrdersService,
    private viewContainerRef: ViewContainerRef,
    private modal: NzModalService,
    private message: NzMessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.formDeliveryInfo = this.fb.group({
      address: [this.order.address, Validators.required],
      recipientEmail: [this.order.recipientEmail, Validators.email],
      recipientName: [
        this.order.recipientName,
        Validators.compose([EmptyValidator()]),
      ],
      recipientPhone: [
        this.order.recipientPhone,
        Validators.compose([PhoneNumber()]),
      ],
    });
  }
  updateOrder() {
    let value = this.formDeliveryInfo.value;
    this.order.recipientEmail = value.recipientEmail;
    this.order.recipientName = value.recipientName;
    this.order.recipientPhone = value.recipientPhone;
    orderStore.update((state) => ({
      orderDto: this.order,
    }));
  }
  showModal() {
    const modal = this.modal.create({
      nzTitle: 'Thêm địa chỉ',
      nzContent: AddressComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzFooter: null,
    });
    modal.afterClose.subscribe((result) => {
      if (result) {
        this.address = result;
        this.message.success('Thêm địa chỉ thành công');
      }
    });
  }
  changeDelivery() {
    orderStore.update((state: any) => {
      return {
        orderDto: {
          ...state.orderDto,
          delivery: this.delivery,
          shipFee: this.delivery == 0 ? 0 : state.shipFee,
          totalMoney:
            state.orderDto.goodsValue +
            (this.delivery == 1 ? (state.shipFee ? state.shipFee : 0) : 0) -
            state.orderDto.sale,
        },
      };
    });

    if (this.delivery == 1) {
      this.formDeliveryInfo.patchValue({
        recipientEmail: this.order.recipientEmail,
        address: this.order.address,
        recipientName: this.order.recipientName,
        recipientPhone: this.order.recipientPhone,
      });
      let address = this.order.address;
      if (address) {
        let arr = address.split(', ');
        let district = arr[arr.length - 2];
        let province = arr[arr.length - 1];
        this.getShipFee(province, district, this.address);
      }
    }
  }
  getShipFee(province: string, district: string, address: string) {
    // let quantity = this.order
    //   .orderDetails!.map((item) => item.quantity)
    //   .reduce((prev, next) => prev! + next!);
    this.orderService
      .getFeeShip(province, district, address)
      .subscribe((res) => {
        if (res) {
          orderStore.update((state: any) => {
            let totalMoney =
              state.orderDto.goodsValue + (res ? res : 0) - state.orderDto.sale;
            return {
              orderDto: {
                ...state.orderDto,
                delivery: this.delivery,
                shipFee: res ? res : 0,
                totalMoney,
              },
            };
          });
        }
      });
  }
}
