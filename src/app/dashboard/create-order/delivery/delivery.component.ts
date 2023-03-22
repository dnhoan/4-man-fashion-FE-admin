import { Component, Input, OnInit } from '@angular/core';
import { OrdersService } from 'src/app/service/order.service';
import { orderStore } from '../order.repository';
@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss']
})
export class DeliveryComponent implements OnInit {
  @Input('address') address: string = '';
  @Input('delivery') delivery: number = 0;
  constructor(private orderService: OrdersService) {}

  ngOnInit(): void {}
  changeDelivery() {
    if (this.delivery == 1) {
      this.getShipFee();
    } else {
      orderStore.update((state: any) => {
        return {
          orderDto: {
            ...state.orderDto,
            delivery: this.delivery,
            shipFee: 0,
          },
        };
      });
    }
  }
  getShipFee() {
    this.orderService.getFeeShip(this.address).subscribe((res) => {
      if (res) {
        orderStore.update((state: any) => {
          return {
            orderDto: {
              ...state.orderDto,
              delivery: this.delivery,
              shipFee: res,
            },
          };
        });
      }
    });
  }

}
