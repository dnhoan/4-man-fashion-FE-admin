import { Pipe, PipeTransform } from '@angular/core';
import { CommonService } from '../common-services/common.service';

@Pipe({
  name: 'orderStatus',
})
export class OrderStatusPipe implements PipeTransform {
  constructor(private commonService: CommonService) {}

  transform(value: unknown, ...args: unknown[]): unknown {
    let status = this.commonService.orderStatuses.filter(
      (o) => o.status == value
    )[0];
    return status.statusName?.toUpperCase();
  }
}
