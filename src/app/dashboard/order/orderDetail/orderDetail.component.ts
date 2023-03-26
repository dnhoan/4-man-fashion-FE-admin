import { Component, Input, OnInit } from '@angular/core';
import { OrderDTO } from '../order.model';

@Component({
  selector: 'app-orderDetail',
  templateUrl: './orderDetail.component.html',
  styleUrls: ['./orderDetail.component.scss'],
})
export class OrderDetailComponent implements OnInit {
  @Input('order') currentOrder!: OrderDTO;
  constructor() {}

  ngOnInit() {}
}
