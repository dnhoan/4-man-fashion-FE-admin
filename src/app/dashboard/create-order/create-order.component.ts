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
import { OrderDTO } from 'src/app/model/order.model';
import { NzModalService } from 'ng-zorro-antd/modal';
import { OrdersService } from 'src/app/service/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/common-services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProductsService } from '../product/product.service';
import { orderInit, orderStore } from './order.repository';
import { SearchOption } from 'src/app/model/search-option.model';
import { Page } from 'ngx-pagination';

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
  constructor(
    private productsService: ProductsService,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef,
    private orderService: OrdersService,
    private route: ActivatedRoute,
    private router: Router,
    public commonService: CommonService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
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

    this.subOrder = orderStore.subscribe((state) => {
      this.order = state.orderDto;
    });
  }
  addToCart(product: ProductDTO, index: number) {
    console.log(product);

    if (product.productDetails.length == 1) {
    }
    this.products[index].amount = 10;
  }
  search(searchTerm: any) {
    console.log(searchTerm);
    console.log(this.searchProduct);

    this.searchChange$.next({ ...this.searchProduct });
  }

  saveOrderStore() {}
  noteChange(event: any) {}
  save() {}
  handleCancel() {}
  handleOk() {}
  ngOnDestroy() {
    this.subSearchProduct.unsubscribe();
  }
}
