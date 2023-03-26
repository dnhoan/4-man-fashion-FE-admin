import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { finalize } from 'rxjs';
import { CommonConstants } from 'src/app/constants/common-constants';
import { Category } from 'src/app/model/category.model';
import { Color } from 'src/app/model/color.model';
import { Material } from 'src/app/model/material.model';
import { Models } from 'src/app/model/model.model';
import { ProductDetailDTO } from 'src/app/model/productDetail.model';
import { SearchOption } from 'src/app/model/search-option.model';
import { Size } from 'src/app/model/size.model';
import { CategoryService } from 'src/app/service/category.service';
import { ColorService } from 'src/app/service/color.service';
import { MaterialService } from 'src/app/service/material.service';
import { ModelService } from 'src/app/service/model.service';
import { SizeService } from 'src/app/service/size.service';
import { ProductNameValidator } from 'src/app/validators/input.validator';
import { ProductsService } from '../product.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
})
export class CreateProductComponent implements OnInit {
  formCreateProduct!: FormGroup;

  categories: Category[] = [];
  materials: Material[] = [];
  models: Models[] = [];
  images: string[] = [];
  colors: Color[] = [];
  sizes: Size[] = [];
  productDetails: ProductDetailDTO[] = [
    {
      size: undefined,
      color: undefined,
      productDetailCode: '',
      productDetailName: '',
      stock: 0,
      price: 0,
      sizeName: '',
      colorName: '',
      status: CommonConstants.STATUS.ACTIVE
    },
  ];
  searchProperty: SearchOption = {
    searchTerm: '',
    status: 1,
    offset: 0,
    limit: 10,
  };
  categoryName = '';
  modelName = '';
  materialName = '';
  colorName = '';
  sizeName = '';
  modulesDescription = {};
  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private materialService: MaterialService,
    private modelService: ModelService,
    private sizeService: SizeService,
    private colorService: ColorService,
    private storage: AngularFireStorage,
    private productService: ProductsService,
    private drawerRef: NzDrawerRef<string>,
    private message: NzMessageService
  ) {
    this.modulesDescription = {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        ['blockquote'],
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ align: [] }],
      ],
    };
  }

  ngOnInit() {
    this.getProperties();

    this.formCreateProduct = this.fb.group({
      productName: ['', Validators.compose([ProductNameValidator()])],
      material: ['', Validators.compose([Validators.required])],
      category: ['', Validators.compose([Validators.required])],
      model: ['', Validators.compose([Validators.required])],
      color: [[]],
      size: [[]],
      description: [''],
      detail: [''],
    });
    new FormControl('', Validators.required);
  }
  submitted = false;
  submit() {
    this.submitted = true;
    if (this.formCreateProduct.valid && this.images.length) {
      let data = this.formCreateProduct.value;
      data.productDetails = this.productDetails;
      data.productImages = this.images.map((image) => ({ id: '', image }));
      data.productName = data.productName.trim();
      this.productService.createProduct(data).subscribe((res) => {
        if (res) this.drawerRef.close(res);
      });
    }
  }
  changeProductName({ target }: any) {
    let productName = target.value.trim();
    this.productDetails = this.productDetails.map((p) => ({
      ...p,
      productDetailName: this.mapProductDetailName(
        productName,
        p.colorName!,
        p.sizeName!
      ),
    }));
  }
  mapTiers() {
    let colorSelected: Color[] = this.formCreateProduct.value.color;
    let sizeSelected: Size[] = this.formCreateProduct.value.size;
    let productName: string = this.formCreateProduct.value.productName;
    let productDetail: ProductDetailDTO = {
      size: undefined,
      color: undefined,
      stock: 0,
      price: 0,
      sizeName: '',
      colorName: '',
      productDetailCode: '',
      productDetailName: productName,
    };
    this.productDetails = [];
    if (colorSelected.length && sizeSelected.length) {
      colorSelected.forEach((color) => {
        productDetail.color = color;
        productDetail.colorName = color.colorName;
        sizeSelected.forEach((size) => {
          productDetail.size = size;
          productDetail.sizeName = size.sizeName;
          productDetail.productDetailName = this.mapProductDetailName(
            productName,
            color.colorName!,
            size.sizeName!
          );
          this.productDetails.push({ ...productDetail });
        });
      });
    } else if (colorSelected.length) {
      colorSelected.forEach((color) => {
        productDetail.color = color;
        productDetail.colorName = color.colorName;
        productDetail.productDetailName = this.mapProductDetailName(
          productName,
          color.colorName!,
          ''
        );
        this.productDetails.push({ ...productDetail });
      });
    } else if (sizeSelected.length) {
      sizeSelected.forEach((size) => {
        productDetail.size = size;
        productDetail.productDetailName = this.mapProductDetailName(
          productName,
          '',
          size.sizeName!
        );
        this.productDetails.push({ ...productDetail });
      });
    } else {
      this.productDetails = [productDetail];
    }
  }

  mapProductDetailName(
    productName: string,
    colorName: string,
    sizeName: string
  ) {
    return `${productName}${colorName ? ' - ' + colorName : ''}${
      sizeName ? ' - ' + sizeName : ''
    }`;
  }

  insertCategory() {
    if (this.categoryName.trim().length > 0) {
      this.categoryService
        .createCategory({
          categoryName: this.categoryName.trim(),
          status: CommonConstants.STATUS.ACTIVE,
        })
        .subscribe((res) => {
          if (res) {
            this.categories.unshift(res);
            this.categoryName = '';
          }
        });
    } else {
      this.message.error('Vui lòng nhập tên danh mục');
    }
  }
  insertModel() {
    if (this.modelName.trim().length > 0) {
      this.modelService
        .createModel({
          modelsName: this.modelName.trim(),
          status: CommonConstants.STATUS.ACTIVE,
        })
        .subscribe((res) => {
          if (res) {
            this.models.unshift(res);
            this.modelName = '';
          }
        });
    } else {
      this.message.error('Vui lòng nhập tên kiểu dáng');
    }
  }
  insertMaterial() {
    if (this.materialName.trim().length > 0) {
      this.materialService
        .createMaterial({
          materialName: this.materialName.trim(),
          status: CommonConstants.STATUS.ACTIVE,
        })
        .subscribe((res) => {
          if (res) {
            this.materials.unshift(res);
            this.materialName = '';
          }
        });
    } else {
      this.message.error('Vui lòng nhập tên chất liệu');
    }
  }
  insertColor() {
    if (this.colorName.trim().length > 0) {
      this.colorService
        .createColor({
          colorName: this.colorName.trim(),
          status: CommonConstants.STATUS.ACTIVE,
        })
        .subscribe((res) => {
          if (res) {
            this.colors.unshift(res);
            this.colorName = '';
          }
        });
    } else {
      this.message.error('Vui lòng nhập tên màu sắc');
    }
  }
  insertSize() {
    if (this.sizeName.trim().length > 0) {
      this.sizeService
        .createSize({
          sizeName: this.sizeName.trim(),
          status: CommonConstants.STATUS.ACTIVE,
        })
        .subscribe((res) => {
          if (res) {
            this.sizes.unshift(res);
            this.sizeName = '';
          }
        });
    } else {
      this.message.error('Vui lòng nhập tên kích cỡ');
    }
  }

  removeImage(i: any) {
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

  getProperties() {
    this.categoryService
      .getAllCategory(this.searchProperty)
      .subscribe((res) => {
        if (res) {
          this.categories = res.items;
        }
      });
    this.materialService
      .getAllMaterial(this.searchProperty)
      .subscribe((res) => {
        if (res) {
          this.materials = res.items;
        }
      });
    this.modelService.getAllModel(this.searchProperty).subscribe((res) => {
      if (res) {
        this.models = res.items;
      }
    });
    this.sizeService
      .getAllSize({
        offset: 0,
        limit: 9999,
        searchTerm: '',
        status: CommonConstants.STATUS.ACTIVE,
      })
      .subscribe((res) => {
        if (res) {
          this.sizes = res.items;
        }
      });
    this.colorService.getAllColor(this.searchProperty).subscribe((res) => {
      if (res) {
        this.colors = res.items;
      }
    });
  }
}
