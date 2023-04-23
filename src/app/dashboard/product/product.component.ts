import { Component, OnInit, ViewContainerRef } from '@angular/core';
import {
  addEntities,
  deleteEntities,
  getEntity,
  selectAllEntities,
  setEntities,
  updateEntities,
} from '@ngneat/elf-entities';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Category, CategoryDTO } from 'src/app/model/category.model';
import { Color, ColorDTO } from 'src/app/model/color.model';
import { Material, MaterialDTO } from 'src/app/model/material.model';
import { Models, ModelsDTO } from 'src/app/model/model.model';
import { Product, ProductDTO } from 'src/app/model/product.model';
import { ProductDetailDTO } from 'src/app/model/productDetail.model';
import { Size, SizeDTO } from 'src/app/model/size.model';
import { MaterialService } from 'src/app/service/material.service';
import { ProductsService } from './product.service';
import { productsStore } from './product.repository';
import { SearchOption } from 'src/app/model/search-option.model';
import { CommonService } from 'src/app/common-services/common.service';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  Subscription,
  switchMap,
} from 'rxjs';
import { Page } from 'src/app/model/pageable.model';
import { CreateProductComponent } from './create-product/create-product.component';
import { UpdateProductComponent } from './update-product/update-product.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CommonConstants } from 'src/app/constants/common-constants';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  searchProduct: SearchOption = {
    searchTerm: '',
    status: 1,
    offset: 0,
    limit: 10,
  };
  searchChange$ = new BehaviorSubject<SearchOption>(this.searchProduct);
  subSearchProduct!: Subscription;
  page!: Page;
  subProducts!: Subscription;
  products: ProductDTO[] = [];
  expand = false;

  constructor(
    private drawerService: NzDrawerService,
    private productService: ProductsService,
    private materialService: MaterialService,
    private modal: NzModalService,
    private message: NzMessageService,
    public commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.subSearchProduct = this.searchChange$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((res) => {
          return this.productService.getAllProduct(res);
        })
      )
      .subscribe((res: any) => {
        this.page = { ...res };
        productsStore.update(setEntities(res.items));
      });
    this.subProducts = productsStore
      .pipe(selectAllEntities())
      .subscribe((products: any) => {
        this.products = products;
      });
  }
  showModalEdit(product_id: number) {
    let product: ProductDTO = productsStore.query(getEntity(product_id))!;
    const drawerRef = this.drawerService.create<
      UpdateProductComponent,
      { value: string },
      string
    >({
      nzTitle: 'Sửa sản phẩm',
      nzWidth: '70%',
      nzContent: UpdateProductComponent,
      nzContentParams: { product },
    });
    drawerRef.afterClose.subscribe((data: any) => {
      if (data) {
        productsStore.update(updateEntities(product_id, data));
      }
    });
  }
  showDrawerCreateProduct() {
    const drawerRef = this.drawerService.create<
      CreateProductComponent,
      { value: string },
      string
    >({
      nzTitle: 'Tạo sản phẩm',
      nzWidth: '70%',
      nzContent: CreateProductComponent,
    });
    drawerRef.afterClose.subscribe((data: any) => {
      if (data) {
        productsStore.update(addEntities(data, { prepend: true }));
      }
    });
  }
  updateStatus(product: ProductDTO, index: number, status: number) {
    this.modal.confirm({
      nzTitle:
        'Bạn có muốn ' +
        (status == 0 ? 'xóa' : 'khôi phục') +
        ' sản phẩm này không?',
      nzOnOk: () => {
        this.productService
          .updateStatus(product.id, status)
          .subscribe((res) => {
            if (res) {
              this.products.splice(index, 1);
            }
          });
      },
    });
  }

  search(value: any) {
    this.searchProduct.searchTerm = value;
    this.searchProduct.offset = 0;
    this.searchChange$.next({ ...this.searchProduct });
  }
  onChangeStatus(status: any) {
    this.searchProduct.status = status;
    this.searchProduct.offset = 0;
    this.searchChange$.next({ ...this.searchProduct });
  }
  onChangeSizePage(event: any) {
    this.searchProduct.limit = event;
    this.searchProduct.offset = 0;
    this.searchChange$.next({ ...this.searchProduct });
  }
  onChangeIndexPage(event: any) {
    --event;
    this.searchProduct.offset = event;
    this.searchChange$.next({ ...this.searchProduct });
  }

  getAllProduct() {
    // this.productService
    //   .getAllProduct(this.offset, this.limit, this.status)
    //   .subscribe((res: any) => {
    //     this.datas = res.data.items;
    //   });
  }

  // getByProductId(productId: any) {
  //   this.productDetailService
  //     .getProducByProductId(productId, this.status)
  //     .subscribe((res: any) => {
  //       this.datasPD = res.data;
  //     });
  // }

  deleteProductById(product_id: any) {
    this.productService.deleteProduct(product_id).subscribe((res) => {
      if (res) {
        this.message.success('Xóa sản phẩm thành công');
        productsStore.update(deleteEntities(product_id));
      }
    });
  }
}
