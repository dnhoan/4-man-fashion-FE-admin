import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { deleteEntities } from '@ngneat/elf-entities';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Category, CategoryDTO } from 'src/app/model/category.model';
import { Color, ColorDTO } from 'src/app/model/color.model';
import { Material, MaterialDTO } from 'src/app/model/material.model';
import { Models, ModelsDTO } from 'src/app/model/model.model';
import { Product, ProductDTO } from 'src/app/model/product.model';
import { ProductDetailDTO } from 'src/app/model/productDetail.model';
import { Size, SizeDTO } from 'src/app/model/size.model';
import { CategoryService } from 'src/app/service/category.service';
import { ColorService } from 'src/app/service/color.service';
import { MaterialService } from 'src/app/service/material.service';
import { ModelService } from 'src/app/service/model.service';
import { ProductDetailService } from 'src/app/service/productDetail.service';
import { SizeService } from 'src/app/service/size.service';
import { ProductsService } from '../../service/product.service';
import { productsStore } from './product.repository';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  changePage(arg0: any) {
    this.productService
      .getAllProduct(this.offset, this.limit, this.status)
      .subscribe((res: any) => {});
    console.log(arg0);
  }
  visible = false;
  expandSet = new Set<number>();
  product: Product = {
    id: 0,
    productId: 0,
    productDetails: [],
  };
  productDTO: ProductDTO = {
    id: 0,
    productId: 0,
    productDetails: [],
  };
  datasPD: ProductDetailDTO[] = [];
  datas: ProductDTO[] = [];
  dataCate: CategoryDTO[] = [];
  dataMaterial: MaterialDTO[] = [];
  dataSize: SizeDTO[] = [];
  dataModel: ModelsDTO[] = [];
  dataColor: ColorDTO[] = [];
  formProduct!: FormGroup;
  formCate!: FormGroup;
  formMate!: FormGroup;
  formClassify!: FormGroup;
  formSize!: FormGroup;
  formModel!: FormGroup;
  formColor!: FormGroup;
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
  category: Category = {};
  categoryDTO: CategoryDTO[] = [];
  material: Material = {};
  materialDTO: MaterialDTO[] = [];
  size: Size = {};
  sizeDTO: SizeDTO[] = [];
  models: Models = {};
  modelDTO: ModelsDTO[] = [];
  color: Color = {};
  colorDTO: ColorDTO[] = [];
  expand = false;

  constructor(
    private httpClient: HttpClient,
    private drawerService: NzDrawerService,
    private modal: NzModalService,
    private productDetailService: ProductDetailService,
    private productService: ProductsService,
    private sizeService: SizeService,
    private colorService: ColorService,
    private materialService: MaterialService,
    private modelService: ModelService,
    private viewContainerRef: ViewContainerRef,
    private categoryService: CategoryService,
    private message: NzMessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.pagination(this.offset);
    this.initFormAddCate();
    this.initFormAddColor();
    this.initFormAddMate();
    this.initFormAddModel();
    this.initFormAddSize();
    this.initFormAddClassify();
    this.initFormSearch();
  }

  onExpandChange(id: number, expand: boolean): void {
    if (expand!) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  saveProductss() {
    if (this.product.id) {
      this.updateProduct();
      return;
    }
  }
  updateProduct() {
    if (this.formProduct.valid) {
      this.addValueProduct();
      this.productService.updateProduct(this.product).subscribe(
        (res) => {
          this.getAllProduct();
          this.message.success('Cập nhật sản phẩm thành công');
          this.isVisible = false;
          return;
        },
        (error) => {
          this.message.error('Cập nhật dữ liệu thất bại');
        }
      );
    }
    return;
  }

  addValueProduct() {
    this.product.id = this.formProduct.value.id;
    this.product.productId = this.formProduct.value.productId;
    this.product.productName = this.formProduct.value.productName;
    this.product.description = this.formProduct.value.description;
    this.product.detail = this.formProduct.value.detail;
    this.product.gender = this.formProduct.value.gender;
    let mateId = this.formProduct.value.material;
    this.product.material = this.dataMaterial.find((material) => {
      return material.id == mateId;
    });
    let cateId = this.formProduct.value.category;
    this.product.category = this.dataCate.find((category) => {
      return category.id == cateId;
    });
    let modelId = this.formProduct.value.model;
    this.product.model = this.dataModel.find((model) => {
      return model.id == modelId;
    });
    //   (this.product.materialName = this.formProduct.value.materialName);
    // this.product.categoryName = this.formProduct.value.categoryName;
    // this.product.modelName = this.formProduct.value.modelName;
    this.product.status = this.formProduct.value.status;
  }

  showModal(): void {
    this.getAllMaterial();
    this.getAllCategory();
    this.getAllModel();
    this.submit = false;
    this.formProduct = this.fb.group({
      id: null,
      productId: ['', [Validators.required]],
      productName: ['', [Validators.required]],
      description: [''],
      detail: [''],
      material: ['', [Validators.required]],
      category: ['', [Validators.required]],
      model: ['', [Validators.required]],
      gender: [1],
      status: [1],
    });
    this.isVisible = true;
  }

  initFormAddCate() {
    this.formCate = this.fb.group({
      id: '',
      categoryName: ['', [Validators.required]],
    });
  }

  initFormAddMate() {
    this.formMate = this.fb.group({
      id: '',
      materialName: ['', [Validators.required]],
    });
  }

  initFormAddModel() {
    this.formModel = this.fb.group({
      id: '',
      modelsName: ['', [Validators.required]],
    });
  }

  initFormAddSize() {
    this.formSize = this.fb.group({
      id: '',
      sizeName: ['', [Validators.required]],
    });
  }

  initFormAddColor() {
    this.formColor = this.fb.group({
      id: '',
      colorCode: ['', [Validators.required, Validators.maxLength(20)]],
      colorName: ['', [Validators.required]],
    });
  }

  handleOk() {
    this.submit = true;
    if (this.formProduct.valid) {
      this.saveProductss();
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
      });
  }

  getListProduct() {
    this.productService.getListproduct().subscribe((result) => {
      this.product = result;
    });
  }

  // getByProductId(productId: any) {
  //   this.productDetailService
  //     .getProducByProductId(productId, this.status)
  //     .subscribe((res: any) => {
  //       this.datasPD = res.data;
  //     });
  // }

  addMaterial(input: HTMLInputElement) {
    let value = input.value;
    if (value) {
      this.materialService
        .createMaterial({ id: 0, materialName: value, status: 1 })
        .subscribe((res: any) => {
          if (res) {
            this.message.success('Tạo thành công');
            this.materialDTO.unshift({ ...res });
            input.value = '';
          }
        });
    } else {
      this.message.error('Vui lòng nhập giá trị!');
    }
  }

  getInfoProduct(id: any) {
    this.showModal();
    const productByID = this.datas.find((value) => {
      return value.id == id;
    });
    if (productByID) {
      this.product = productByID;
    }
    this.fillValueForm();
  }

  getAllSize() {
    this.sizeService.getListSize().subscribe((res: any) => {
      this.datas = res.data.items;
    });
  }
  getAllModel() {
    this.modelService.getListModel().subscribe((res: any) => {
      this.dataModel = res.data;
    });
  }
  getAllMaterial() {
    this.materialService.getListMaterial().subscribe((res: any) => {
      this.dataMaterial = res.data;
    });
  }
  getAllColor() {
    this.colorService.getListColor().subscribe((res: any) => {
      this.datas = res.data.items;
    });
  }
  getAllCategory() {
    this.categoryService.getListCategory().subscribe((res: any) => {
      this.dataCate = res.data;
    });
  }

  fillValueForm() {
    console.log(this.product.category);
    console.log(this.product.model);

    this.formProduct.patchValue({
      id: this.product.id,
      productId: this.product.productId,
      productName: this.product.productName,
      description: this.product.description,
      detail: this.product.detail,
      gender: this.product.gender,
      material: this.product.material?.id,
      category: this.product.category?.id,
      model: this.product.model?.id,
      status: this.product.status,
    });
  }

  deleteProductById(product_id: any) {
    this.productService.deleteProduct(product_id).subscribe((res) => {
      if (res) {
        this.message.success('Xóa sản phẩm thành công');
        productsStore.update(deleteEntities(product_id));
      }
    });
  }

  initFormAddClassify() {
    this.formClassify = this.fb.group({
      id: '',
      sizeName: ['', [Validators.required]],
      colorName: ['', [Validators.required]],
    });
  }

  modalClassifying() {}

  // addClassifying(
  //   productDetail: ProductDetailDTO,
  //   productId?: number | string,
  //   i_product_detail?: number
  // ) {
  //   const modal = this.modal.create({
  //     nzTitle: 'Thêm phân loại sản phẩm',
  //     nzContent: ProductDetailComponent,
  //     nzViewContainerRef: this.viewContainerRef,
  //     nzComponentParams: {
  //       productDetail: { ...productDetail },
  //       productId,
  //       i_product_detail,
  //     },
  //     nzOnOk: () => new Promise((resolve) => setTimeout(resolve, 1000)),
  //     nzFooter: [],
  //   });
  //   const instance = modal.getContentComponent();
  // }

  pagination(page: any) {
    if (page < 0) {
      page = 0;
      this.offset = page;
    }
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
