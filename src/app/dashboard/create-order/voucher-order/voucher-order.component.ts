import { Component, Input, OnInit } from '@angular/core';
import { VoucherOrderService } from './voucher-order.service';
import { Voucher } from 'src/app/model/voucher.model';
import { orderStore } from '../order.repository';
import { ORDER_STATUS, VOUCHER_TYPE } from 'src/app/constants/constant.constant';
import { NzMessageService } from 'ng-zorro-antd/message';
import { OrderDTO } from '../../order/order.model';

@Component({
  selector: 'app-voucher-order',
  templateUrl: './voucher-order.component.html',
  styleUrls: ['./voucher-order.component.scss'],
})
export class VoucherOrderComponent implements OnInit {
  @Input() goodValue!: number;
  @Input() order!: OrderDTO
  radioValue = 'A';
  vouchers: Voucher[] = [];
  @Input() voucherOrder!: Voucher;
  voucher!: Voucher;
  VOUCHER_TYPE = VOUCHER_TYPE;
  ORDER_STATUS = ORDER_STATUS;
  isShowModalVoucher = false;
  voucherCode = '';
  constructor(
    private voucherOrderService: VoucherOrderService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.voucherOrderService.getAllVoucher().subscribe((res) => {
      this.vouchers = res.items.sort((a: any, b: any) => {
        return a.minimumInvoiceValue - b.minimumInvoiceValue;
      });
    });
  }
  changeVoucherOrder() {}
  removeVoucher() {
    orderStore.update((state) => {
      return {
        orderDto: {
          ...state.orderDto,
          voucher: undefined,
          sale: 0,
          totalMoney: state.orderDto.goodsValue + state.orderDto.shipFee!,
        },
      };
    });
  }
  showModal() {
    this.isShowModalVoucher = true;
    this.voucher = { ...this.voucherOrder };
    console.log(this.voucher);
  }
  applyVoucher() {
    let v = this.vouchers.filter((v) => v.voucherCode == this.voucherCode);
    if (v && v.length) {
      if (this.goodValue > v[0].minimumInvoiceValue!) {
        this.voucher = v[0];
        this.updateOrderStore();
      } else this.message.error('Bạn chưa đủ điều kiện áp mã giảm giá này');
    } else {
      this.message.error('Mã giảm giá không tồn tại!');
    }
  }
  handleOk() {
    if (this.voucher) this.updateOrderStore();

    this.isShowModalVoucher = false;
  }
  updateOrderStore() {
    console.log(this.voucher);

    orderStore.update((state) => {
      let sale =
        this.voucher!.voucherType == VOUCHER_TYPE.PERCENT
          ? (state.orderDto.goodsValue * this.voucher!.discount!) / 100
          : this.voucher!.discount!;

      let totalMoney =
        state.orderDto.goodsValue + state.orderDto.shipFee! - sale;

      return {
        orderDto: {
          ...state.orderDto,
          voucher: this.voucher,
          sale,
          totalMoney,
        },
      };
    });
  }
  handleCancel() {
    this.isShowModalVoucher = false;
  }
}
