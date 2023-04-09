import { Component, Input, OnInit } from '@angular/core';
import { OrderDetailDTO } from '../../order/orderDetails.model';
import { ExchangeService } from './exchange-online.service';
import { CommonConstants } from 'src/app/constants/common-constants';
import { ORDER_DETAIL_STATUS } from 'src/app/constants/constant.constant';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { SearchOption } from 'src/app/model/search-option.model';
import {
  BehaviorSubject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  skip,
  switchMap,
} from 'rxjs';
import { ProductDTO } from 'src/app/model/product.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProductsService } from '../../product/product.service';

@Component({
  selector: 'app-exchange-online',
  templateUrl: './exchange-online.component.html',
  styleUrls: ['./exchange-online.component.scss'],
})
export class ExchangeOnlineComponent implements OnInit {
  @Input() orderDetail!: OrderDetailDTO;
  ORDER_DETAIL_STATUS = ORDER_DETAIL_STATUS;
  quantity: number = 0;
  searchProduct: SearchOption = {
    searchTerm: '',
    status: 1,
    offset: 0,
    limit: 10,
  };
  searchChange$ = new BehaviorSubject<SearchOption>(this.searchProduct);
  products: ProductDTO[] = [];
  subSearchProduct!: Subscription;
  constructor(
    private exchangeService: ExchangeService,
    private modalRef: NzModalRef,
    private modal: NzModalService,
    private message: NzMessageService,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.quantity = this.orderDetail.quantityOrigin!;
    this.subSearchProduct = this.searchChange$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        skip(1),
        switchMap((res) => {
          return this.productsService.getAllProduct(res);
        })
      )
      .subscribe((res: any) => {
        if (res.items)
          this.products = res.items.map((item: ProductDTO) => {
            if (item.productDetails.length == 1) {
              item.stock = item.productDetails[0].stock;
              item.productDetailSelected = item.productDetails[0];
            } else {
              item.stock = item.productDetails.reduce((a, b) => a + b.stock, 0);
            }
            return item;
          });
      });
  }
  addToCart(product: ProductDTO, index: number) {
    let productDetail = product.productDetailSelected;
    if (this.orderDetail.productDetail!.id == productDetail!.id) {
      // update
      this.message.info('Sản phẩm đã có trong đơn hàng');
    } else {
      // create
      this.orderDetail.productDetail = productDetail;
      this.orderDetail.quantity = product.amount;
      this.quantity = product.amount!;
      this.orderDetail.price = productDetail?.price;
    }
  }

  reject(isExchange: boolean) {
    this.modal.confirm({
      nzTitle: `<i>Hủy đổi trả hàng</i>`,
      nzContent: `<b>Bạn có muốn hủy xác nhận đơn hàng này không?</b>`,
      nzOkText: 'Ok',
      nzCancelText: 'Hủy',
      nzOnOk: () => {
        if (isExchange) {
          this.exchangeService
            .rejectExchangeOrderDetail(this.orderDetail)
            .subscribe((res) => {
              if (res) {
                this.orderDetail.statusOrderDetail =
                  ORDER_DETAIL_STATUS.REJECT_EXCHANGE;
              }
            });
        } else
          this.exchangeService
            .rejectReturnOrderDetail(this.orderDetail)
            .subscribe((res) => {
              if (res) {
                this.orderDetail.statusOrderDetail =
                  ORDER_DETAIL_STATUS.REJECT_RETURN;
              }
            });
      },
    });
  }
  confirm(isExchange: boolean) {
    this.modal.confirm({
      nzTitle: `<i>Xác nhận đổi trả hàng</i>`,
      nzContent: `<b>Bạn có muốn xác nhận đơn hàng này không?</b>`,
      nzOkText: 'Ok',
      nzCancelText: 'Hủy',
      nzOnOk: () => {
        this.orderDetail.quantity = this.quantity;
        if (isExchange)
          this.exchangeService
            .confirmExchangeOrderDetail(this.orderDetail)
            .subscribe((res) => {
              if (res) {
                this.orderDetail.statusOrderDetail =
                  ORDER_DETAIL_STATUS.EXCHANGE;
              }
            });
        else
          this.exchangeService
            .confirmReturnOrderDetail(this.orderDetail)
            .subscribe((res) => {
              if (res) {
                this.orderDetail.statusOrderDetail = ORDER_DETAIL_STATUS.RETURN;
              }
            });
      },
    });
  }
  search(searchTerm: any) {
    this.searchChange$.next({ ...this.searchProduct });
  }
  onChangeOptions(product: ProductDTO, index: number) {
    if (
      !(
        ((product.sizes && product.sizes.length >= 1) ||
          (product.colors && product.colors.length >= 1)) &&
        ((product.sizes && product.sizes.length > 0
          ? product.sizeSelected == null
          : false) ||
          (product.colors && product.colors.length > 0
            ? product.colorSelected == null
            : false))
      )
    ) {
      let productDetail = product.productDetails.filter((proDetail) => {
        let result = true;
        if (product.sizes && product.sizes.length >= 1) {
          result = result && proDetail.size?.id == product.sizeSelected?.id;
        }
        if (product.colors && product.colors.length >= 1) {
          result = result && proDetail.color?.id == product.colorSelected?.id;
        }
        return result;
      });
      this.products[index].stock = productDetail[0].stock;
      this.products[index].amount = productDetail[0].stock == 0 ? 0 : 1;
      this.products[index].productDetailSelected = productDetail[0];
    }
  }
  ngOnDestroy() {
    this.subSearchProduct.unsubscribe();
  }
}
