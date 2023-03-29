import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Product, ProductDTO } from 'src/app/model/product.model';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  skip,
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
  STATUS_INACTIVE,
} from 'src/app/constants/constant.constant';
import { OrderDetailService } from '../order/orderDetail/order-detail.service';
import { CommonConstants } from 'src/app/constants/common-constants';

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
  subUpdateOrderDetail!: Subscription;
  searchProduct: SearchOption = {
    searchTerm: '',
    status: 1,
    offset: 0,
    limit: 10,
  };
  product: ProductDTO[] = [];
  searchChange$ = new BehaviorSubject<SearchOption>(this.searchProduct);
  updateOrderDetail$ = new BehaviorSubject<OrderDetailDTO>({});
  isGetOrderDetail = false;
  orderStatuses: any[] = [];
  isShowStatusHistory = false;
  currentIndex!: number;
  constructor(
    private productsService: ProductsService,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef,
    private createOrderService: CreateOrderService,
    private orderService: OrdersService,
    private route: ActivatedRoute,
    private router: Router,
    public commonService: CommonService,
    private message: NzMessageService,
    private orderDetailService: OrderDetailService
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
                item.stock = item.productDetails.reduce(
                  (a, b) => a + b.stock,
                  0
                );
              }
              return item;
            });
        });
      this.subUpdateOrderDetail = this.updateOrderDetail$
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          skip(1),
          switchMap((res) => {
            return this.orderDetailService.updateOrderDetail(
              this.order.orderId,
              res
            );
          })
        )
        .subscribe((res: any) => {
          if (res) {
            this.order.orderDetails = res.orderDetails;
            this.order.goodsValue = res.goodsValue;
            this.updateOrderMoney();
          }
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
          this.currentIndex = this.orderStatuses.findIndex(
            (s) => s.status == this.order.orderStatus
          );
          this.isGetOrderDetail = true;
        } else this.redirect404();
      });
      this.subOrder = orderStore.subscribe((state) => {
        this.order = state.orderDto;
      });
    }
  }
  addToCart(product: ProductDTO, index: number) {
    let productDetail = product.productDetailSelected;
    let orderDetail: OrderDetailDTO = {
      id: 0,
      orderId: this.order.id,
      price: productDetail?.price,
      quantity: product.amount,
      productDetail,
    };
    if (
      this.order.orderDetails?.some(
        (orderDetail) => orderDetail.productDetail!.id == productDetail!.id
      )
    ) {
      // update
      this.message.info('Sản phẩm đã có trong đơn hàng');
    } else {
      // create
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
  onIndexChange(event: any) {
    let newStatus = this.orderStatuses[event].status;
    let currentStatus = this.order.orderStatus;

    switch (true) {
      case currentStatus == ORDER_STATUS.DRAFT &&
        [
          ORDER_STATUS.PACKAGING,
          ORDER_STATUS.DELIVERING,
          ORDER_STATUS.COMPLETE,
          ORDER_STATUS.CANCEL_ORDER,
        ].includes(newStatus):
        this.updateStatus(this.order.id, newStatus);
        break;
      case currentStatus == ORDER_STATUS.PENDING &&
        [
          ORDER_STATUS.CONFIRMED,
          ORDER_STATUS.PACKAGING,
          ORDER_STATUS.DELIVERING,
          ORDER_STATUS.COMPLETE,
          ORDER_STATUS.CANCEL_ORDER,
        ].includes(newStatus):
        this.updateStatus(this.order.id, newStatus);
        break;
      case currentStatus == ORDER_STATUS.PACKAGING &&
        [
          ORDER_STATUS.DRAFT,
          ORDER_STATUS.DELIVERING,
          ORDER_STATUS.COMPLETE,
          ORDER_STATUS.CANCEL_ORDER,
        ].includes(newStatus):
        this.updateStatus(this.order.id, newStatus);
        break;
      case currentStatus == ORDER_STATUS.DELIVERING &&
        [ORDER_STATUS.COMPLETE, ORDER_STATUS.CANCEL_ORDER].includes(newStatus):
        this.updateStatus(this.order.id, newStatus);
        break;
      case currentStatus == ORDER_STATUS.COMPLETE &&
        [ORDER_STATUS.EXCHANGE, ORDER_STATUS.CANCEL_ORDER].includes(newStatus):
        this.updateStatus(this.order.id, newStatus);
        break;
      case currentStatus == ORDER_STATUS.EXCHANGE &&
        [ORDER_STATUS.COMPLETE, ORDER_STATUS.CANCEL_ORDER].includes(newStatus):
        this.updateStatus(this.order.id, newStatus);
        break;
      default:
        this.message.error('Không thể chuyển trạng thái đơn hàng');
        break;
    }
  }
  updateStatus(orderId: number, newStatus: number, note?: string) {
    this.modal.confirm({
      nzTitle: '<i>Xác nhận cập nhật trạng thái đơn hàng</i>',
      nzContent: '<b>Bạn có muốn cập nhật trạng thái đơn hàng này không?</b>',
      nzOkText: 'Ok',
      nzCancelText: 'Hủy',
      nzOnOk: () => {
        if (newStatus == ORDER_STATUS.CANCEL_ORDER) {
          this.isShowConfirmCancelOrder = true;
        } else
          this.orderService
            .updateOrderStatus(orderId, newStatus, note)
            .subscribe((res) => {
              if (res) {
                this.order.orderStatus = newStatus;
                this.currentIndex = this.orderStatuses.findIndex(
                  (s) => s.status == this.order.orderStatus
                );
                this.order.logsOrderStatus?.unshift(res);
                this.saveOrderStore();
              }
            });
      },
    });
  }
  search(searchTerm: any) {
    this.searchChange$.next({ ...this.searchProduct });
  }
  updateQuantityOrderDetail(orderDetail: OrderDetailDTO) {
    orderDetail.orderId = this.order.id;
    this.updateOrderDetail$.next(orderDetail);
  }
  deleteProductToOrderDetail(orderDetail: OrderDetailDTO) {
    this.modal.confirm({
      nzTitle: '<i>Xác nhận xóa</i>',
      nzContent: '<b>Bạn có muốn xóa sản phẩm này khỏi giỏ hàng?</b>',
      nzOkText: 'Xóa',
      nzCancelText: 'Hủy',
      nzOnOk: () => {
        orderDetail.statusOrderDetail = CommonConstants.STATUS.INACTIVE;
        this.updateOrderDetail$.next(orderDetail);
      },
    });
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
  handleCancel() {
    this.isShowConfirmCancelOrder = false;
    this.cancelNote = '';
  }
  cancelOrder() {
    this.orderService
      .updateOrderStatus(
        this.order.id,
        ORDER_STATUS.CANCEL_ORDER,
        this.cancelNote
      )
      .subscribe((res) => {
        if (res) {
          this.order.orderStatus = ORDER_STATUS.CANCEL_ORDER;
          this.currentIndex = this.orderStatuses.findIndex(
            (s) => s.status == this.order.orderStatus
          );
          this.order.logsOrderStatus?.unshift(res);
          this.saveOrderStore();
        }
      });
  }
  ngOnDestroy() {
    this.subSearchProduct.unsubscribe();
    this.subUpdateOrderDetail.unsubscribe();
  }
  redirect404() {
    this.message.error('Lỗi lấy thông tin sản phẩm chi tiết');
  }
}
