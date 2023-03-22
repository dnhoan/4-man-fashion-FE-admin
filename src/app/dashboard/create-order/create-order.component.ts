import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ProductDTO } from 'src/app/model/product.model';
import { debounceTime, distinctUntilChanged, Subject, Subscription, switchMap } from 'rxjs';
import { OrderDTO } from 'src/app/model/order.model';
import { NzModalService } from 'ng-zorro-antd/modal';
import { OrdersService } from 'src/app/service/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/common-services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProductsService } from '../product/product.service';
import { orderInit, orderStore } from './order.repository';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss']
})
export class CreateOrderComponent implements OnInit {
  nowDate = new Date();
  isEdit = false;
  products: ProductDTO[] = [];
  searchTerm = '';
  subProducts!: Subscription;
  subOrder!: Subscription;
  order!: OrderDTO;
  cancelNote: string = '';
  isShowConfirmCancelOrder = false;
  private searchTerms = new Subject<string>();
  constructor(
    private productsService: ProductsService,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef,
    private orderService: OrdersService,
    private route: ActivatedRoute,
    private router: Router,
    public commonService: CommonService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    // this.subProducts = this.searchTerms
    //   .pipe(
    //     debounceTime(500),
    //     distinctUntilChanged(),
    //     switchMap((term: string) => this.productsService.getAllProduct(term))
    //   )
    //   .subscribe((res) => {
    //     this.products = res;
    //   });
    // let id = this.route.snapshot.paramMap.get('id');
    // if (id) {
    //   this.isEdit = true;
    //   this.orderService.getOrderById(id).subscribe((orderDto) => {
    //     console.log(orderDto);

    //     orderStore.update(() => ({
    //       orderDto,
    //     }));
    //   });
    // } else {
    //   orderStore.update(() => ({
    //     orderDto: orderInit,
    //   }));
    // }

    // this.subOrder = orderStore.subscribe((state) => {
    //   console.log(state);
    //   this.order = state.orderDto;
    // });
  }
  search(searchTerm: any){}
  saveOrderStore(){}
  noteChange(event: any){}
  save(){}
  handleCancel(){}
  handleOk(){}
}
