import { Component, Input, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  finalize,
  skip,
  switchMap,
} from 'rxjs';
import { ExchangeShopRequestBody } from 'src/app/model/exchangeShopRequestBody.model';
import { OrderDetail, OrderDetailDTO } from '../../order/orderDetails.model';
import { Exchange, ExchangeImage } from 'src/app/model/exchange.model';
import {
  ORDER_DETAIL_STATUS,
  ORDER_STATUS,
} from 'src/app/constants/constant.constant';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { CommonService } from 'src/app/common-services/common.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ReturnOrderService } from '../return-order/return-order.service';
import { SearchOption } from 'src/app/model/search-option.model';
import { ProductDTO } from 'src/app/model/product.model';
import { ProductsService } from '../../product/product.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ExchangeStoreService } from './exchange-store.service';

@Component({
  selector: 'app-exchange-store',
  templateUrl: './exchange-store.component.html',
  styleUrls: ['./exchange-store.component.scss'],
})
export class ExchangeStoreComponent implements OnInit {
  @Input() orderDetail!: OrderDetailDTO;
  @Input() orderId!: number;
  ORDER_DETAIL_STATUS = ORDER_DETAIL_STATUS;
  reason: string = '';
  images: string[] = [];
  quantity: number = 1;
  searchProduct: SearchOption = {
    searchTerm: '',
    status: 1,
    offset: 0,
    limit: 10,
  };
  searchChange$ = new BehaviorSubject<SearchOption>(this.searchProduct);
  products: ProductDTO[] = [];
  subSearchProduct!: Subscription;
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
  constructor(
    private storage: AngularFireStorage,
    private commonService: CommonService,
    private modal: NzModalService,
    private exchangeStoreService: ExchangeStoreService,
    private modalRef: NzModalRef,
    private productsService: ProductsService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
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
  search(searchTerm: any) {
    this.searchChange$.next({ ...this.searchProduct });
  }
  submit() {
    this.modal.confirm({
      nzTitle: `<i>Đổi trả hàng</i>`,
      nzContent: `<b>Bạn có muốn đổi trả đơn hàng này không?</b>`,
      nzOkText: 'Ok',
      nzCancelText: 'Hủy',
      nzOnOk: () => {
        let exchange: Exchange = {
          id: 0,
          reason: this.reason,
          exchangeImages: this.images.map(
            (image: any) => ({ id: 0, image } as ExchangeImage)
          ),
          orderDetailIdOrigin: this.orderDetail.id!,
        };
        let data: ExchangeShopRequestBody = {
          orderDetails: {
            ...this.orderDetail,
            exchange,
            quantity: this.quantity,
            quantityOrigin: this.quantity,
          } as OrderDetail,
          orderId: this.orderId,
          statusOrder: ORDER_STATUS.EXCHANGE,
        };
        this.exchangeStoreService.exchangeOrderDetail(data).subscribe((res) => {
          if (res) this.modalRef.close(true);
        });
      },
    });
  }
  removeImage(i: number) {
    this.images.splice(i, 1);
  }
  changeImage(event: any) {
    let n = Date.now();
    const file = event.target.files[0];
    const filePath = `product_images/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`product_images/${n}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url: any) => {
            if (url) {
              this.images.push(url);
            }
          });
        })
      )
      .subscribe((url: any) => {
        if (url) {
          console.log(url);
        }
      });
  }
  editorInstance: any;
  imageHandler(event: any) {
    this.editorInstance = event;
    let toolbar = event.getModule('toolbar');
    toolbar.addHandler('image', () => {
      let data = this.editorInstance;
      if (this.editorInstance) {
        let range = this.editorInstance.getSelection();
        if (range) {
          let input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.addEventListener('change', () => {
            const file = input.files![0];
            let n = Date.now();
            const filePath = `product_images/${n}`;
            const fileRef = this.storage.ref(filePath);
            const task = this.storage.upload(`product_images/${n}`, file);
            task
              .snapshotChanges()
              .pipe(
                finalize(() => {
                  fileRef.getDownloadURL().subscribe((url: any) => {
                    if (url) {
                      data.insertEmbed(range.index, 'image', url);
                    }
                  });
                })
              )
              .subscribe();
          });
          input.click();
        }
      }
    });
  }
  ngOnDestroy() {
    this.subSearchProduct.unsubscribe();
  }
}
