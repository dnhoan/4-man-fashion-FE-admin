// import { Component, Input, OnInit } from '@angular/core';
// import { Subscription } from 'rxjs';
// import { HttpClient } from '@angular/common/http';
// import { environment } from 'src/environments/environment';
// import { NzMessageService } from 'ng-zorro-antd/message';
// import { ProductDetailService } from 'src/app/service/productDetail.service';
// import {
//   ProductDetail,
//   ProductDetailDTO,
// } from 'src/app/model/productDetail.model';
// import { Product, ProductDTO } from 'src/app/model/product.model';
// import { FormGroup } from '@angular/forms';
// import { NzDrawerService } from 'ng-zorro-antd/drawer';
// import { Category, CategoryDTO } from 'src/app/model/category.model';
// import { Material, MaterialDTO } from 'src/app/model/material.model';
// import { Size, SizeDTO } from 'src/app/model/size.model';
// import { Models, ModelsDTO } from 'src/app/model/model.model';
// import { Color, ColorDTO } from 'src/app/model/color.model';

// @Component({
//   selector: 'app-productDetail',
//   templateUrl: './productDetail.component.html',
//   styleUrls: ['./productDetail.component.scss'],
// })
// export class ProductDetailComponent implements OnInit {
//   @Input('productDetailId') productDetail!: ProductDetailDTO;
//   @Input('productId') productId!: number | string;
//   @Input('i_product_detail') i_product_detail: number = -1;
//   productDetails: ProductDetail = {};
//   product$!: Subscription;
//   visible = false;
//   product: Product = {
//     productId: 0,
//     id: 0,
//     productDetails: [],
//   };
//   datas: ProductDTO[] = [];
//   dataCate: CategoryDTO[] = [];
//   dataMaterial: MaterialDTO[] = [];
//   dataSize: SizeDTO[] = [];
//   dataModel: ModelsDTO[] = [];
//   dataColor: ColorDTO[] = [];
//   formProduct!: FormGroup;
//   formCate!: FormGroup;
//   formMate!: FormGroup;
//   formSize!: FormGroup;
//   formModel!: FormGroup;
//   formColor!: FormGroup;
//   formSearch!: FormGroup;
//   radioValue = 'A';
//   sortBy = 'productName';
//   descAsc = 'desc';
//   offset = 0;
//   limit = 5;
//   status = 1;
//   Page: any;
//   isVisible = false;
//   action = true;
//   submit = false;
//   disable = false;
//   category: Category = {};
//   material: Material = {};
//   size: Size = {};
//   models: Models = {};
//   color: Color = {};

//   constructor(
//     private productDetailService: ProductDetailService,
//     private httpClient: HttpClient,
//     private drawerService: NzDrawerService,
//     private message: NzMessageService
//   ) {}

//   ngOnInit() {
//     this.productDetailService.getAllProductDetail().subscribe((res) => {
//       this.product = res.data.items;
//       console.log(this.product);
//     });
//   }

//   handleOk() {
//     this.submit = true;
//     if (this.formProduct.valid) {
//     }
//   }

//   handleCancel(): void {
//     this.isVisible = false;
//   }
// }
