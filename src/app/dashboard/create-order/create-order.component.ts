import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Product, ProductDTO } from 'src/app/model/product.model';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  Subject,
  Subscription,
  switchMap,
} from 'rxjs';
import { OrderDTO } from 'src/app/dashboard/order/order.model';
import { NzModalService } from 'ng-zorro-antd/modal';
import { OrdersService } from 'src/app/service/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/common-services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProductsService } from '../product/product.service';
import { orderInit, orderStore } from './order.repository';
import { SearchOption } from 'src/app/model/search-option.model';
import { Page } from 'ngx-pagination';
import { CreateOrderService } from './create-order.service';
import { OrderDetailDTO } from '../order/orderDetails.model';
import {
  ORDER_STATUS,
  PURCHASE_TYPE,
} from 'src/app/constants/constant.constant';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss'],
})
export class CreateOrderComponent implements OnInit {
  nowDate = new Date();
  isEdit = false;
  products: ProductDTO[] = [];
  subProducts!: Subscription;
  subOrder!: Subscription;
  order!: OrderDTO;
  cancelNote: string = '';
  isShowConfirmCancelOrder = false;
  private searchTerms = new Subject<string>();
  subSearchProduct!: Subscription;
  searchProduct: SearchOption = {
    searchTerm: '',
    status: 1,
    offset: 0,
    limit: 10,
  };
  product: ProductDTO[] = [];
  searchChange$ = new BehaviorSubject<SearchOption>(this.searchProduct);
  isGetOrderDetail = false;
  orderStatuses: any[] = [];
  constructor(
    private productsService: ProductsService,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef,
    private createOrderService: CreateOrderService,
    private orderService: OrdersService,
    private route: ActivatedRoute,
    private router: Router,
    public commonService: CommonService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    const order_id = this.route.snapshot.paramMap.get('order_id') as string;
    if (!order_id) {
      this.redirect404();
    } else {
      this.subSearchProduct = this.searchChange$
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap((res) => {
            return this.productsService.getAllProduct(res);
          })
        )
        .subscribe((res: any) => {
          this.products = res.items.map((item: ProductDTO) => {
            if (item.productDetails.length == 1) {
              item.stock = item.productDetails[0].stock;
            }
            return item;
          });
        });
      this.orderService.getOrderByOrderId(order_id).subscribe((res) => {
        if (res) {
          orderStore.update(() => ({
            orderDto: res,
          }));
          this.orderStatuses = this.commonService.orderStatuses.filter((s) => {
            if (res.purchaseType == PURCHASE_TYPE.ONLINE) {
              return s.status != ORDER_STATUS.DRAFT;
            } else {
              return (
                s.status != ORDER_STATUS.PENDING &&
                s.status != ORDER_STATUS.CONFIRMED
              );
            }
          });

          this.isGetOrderDetail = true;
        } else this.redirect404();
      });
      this.subOrder = orderStore.subscribe((state) => {
        this.order = state.orderDto;
      });
    }
  }
  addToCart(product: ProductDTO, index: number) {
    let orderDetail: OrderDetailDTO = {
      id: 0,
      orderId: this.order.id,
      price: 0,
      quantity: product.amount,
      productDetailId: '',
    };
    // case product has 1 product detail
    if (product.productDetails.length == 1) {
      let orderDetails = this.order.orderDetails;
      if (
        orderDetails?.some(
          (o) => o.productDetailId == product.productDetails[0].id
        )
      ) {
        // update quantity of order detail
      } else {
        // add product to order detail
        orderDetail.price = product.productDetails[0].price;
        orderDetail.productDetail = product.productDetails[0];
        this.createOrderService
          .createOrderDetailToOrder(this.order.orderId, orderDetail)
          .subscribe((res) => {
            if (res) {
              orderStore.update((state) => ({
                orderDto: res,
              }));
            }
          });
      }
    }
    this.products[index].amount = 10;
  }
  search(searchTerm: any) {
    this.searchChange$.next({ ...this.searchProduct });
  }

  updateOrderMoney() {
    let goodsValue = this.order.orderDetails?.reduce(
      (a, b) => a + b.price! * b.quantity!,
      0
    ) as number;
    this.order.goodsValue = goodsValue;
    this.order.totalMoney = goodsValue + this.order.delivery! - this.order.sale;
    this.saveOrderStore();
  }
  saveOrderStore() {
    orderStore.update((state) => ({
      orderDto: this.order,
    }));
  }
  noteChange(event: any) {}
  save() {}
  handleCancel() {}
  handleOk() {}
  ngOnDestroy() {
    this.subSearchProduct.unsubscribe();
  }
  redirect404() {
    this.message.error('Lỗi lấy thông tin sản phẩm chi tiết');
  }
}
