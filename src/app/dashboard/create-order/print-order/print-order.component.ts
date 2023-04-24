import { Component, Input, OnInit } from '@angular/core';
import { OrderDTO } from '../../order/order.model';
import { ORDER_DETAIL_STATUS } from 'src/app/constants/constant.constant';
import { CommonService } from 'src/app/common-services/common.service';

@Component({
  selector: 'app-print-order',
  templateUrl: './print-order.component.html',
  styleUrls: ['./print-order.component.scss'],
})
export class PrintOrderComponent implements OnInit {
  @Input() order!: OrderDTO;
  nowDate = new Date();
  ORDER_DETAIL_STATUS = ORDER_DETAIL_STATUS;
  constructor(public commonService: CommonService) {}

  ngOnInit(): void {}
}
