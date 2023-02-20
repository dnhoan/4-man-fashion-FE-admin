import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subscription } from 'rxjs';
import { ProductDTO } from 'src/app/model/product.model';
import { ProductsService } from '../../service/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  visible = false;
  datas: ProductDTO[] = [];
  subProducts!: Subscription;
  formProduct!: FormGroup;
  formSearch!: FormGroup;
  radioValue = 'A';
  sortBy = 'productName';
  descAsc = 'desc';
  offset = 0;
  limit = 5;
  status = 1;
  Page: any;
  isVisible = false;
  action = true;
  submit = false;
  disable = false;
  constructor(
    private httpClient: HttpClient,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef,
    private productService: ProductsService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.pagination(this.offset);
  }

  showModal(): void {
    this.submit = false;
    this.formProduct = this.fb.group({
      id: null,
      productId: ['', [Validators.required]],
      productName: ['', [Validators.required]],
      description: [''],
      detail: [''],
      materialName: ['', [Validators.required]],
      categoryName: ['', [Validators.required]],
      modelsName: ['', [Validators.required]],
      gender: [''],
      status: [1],
      productDetail: ['', [Validators.required]],
    });
    this.isVisible = true;
  }

  handleOk() {
    this.submit = true;
    if (this.formProduct.valid) {
    }
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  getAllProduct() {
    this.productService
      .getAllProduct(this.offset, this.limit, this.status)
      .subscribe((res: any) => {
        this.datas = res.data.items;
        console.log(res);
      });
  }

  pagination(page: any) {
    if (page < 0) page = 0;
    this.offset = page;
    this.productService
      .getAllProduct(this.offset, this.limit, this.status)
      .subscribe((res) => {
        this.datas = res.data.items;
        this.Page = res.data;
      });
  }

  pageItem(pageItems: any) {
    this.limit = pageItems;
    this.pagination(this.offset);
  }

  preNextPage(selector: string) {
    if (selector == 'pre') --this.offset;
    if (selector == 'next') ++this.offset;
    this.pagination(this.offset);
  }
  initFormSearch() {
    this.formSearch! = this.fb.group({
      valueSearch: [''],
    });
  }

  searchWithPage(page: any) {
    if (page < 0) page = 0;
    this.offset = page;
  }

  timkiem() {
    this.searchWithPage(0);
    this.initFormSearch();
  }
}
