import { Component, Input, OnInit } from '@angular/core';
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
import { ProductDTO } from 'src/app/model/product.model';
import { ProductDetailDTO } from 'src/app/model/productDetail.model';
import { Size } from 'src/app/model/size.model';
import { CategoryService } from 'src/app/service/category.service';
import { ColorService } from 'src/app/service/color.service';
import { MaterialService } from 'src/app/service/material.service';
import { ModelService } from 'src/app/service/model.service';
import { SizeService } from 'src/app/service/size.service';
import { ProductNameValidator } from 'src/app/validators/input.validator';
import { ProductsService } from '../product.service';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss'],
})
export class UpdateProductComponent implements OnInit {
  @Input('product') product!: ProductDTO;
  formUpdateProduct!: FormGroup;

  categories: Category[] = [];
  materials: Material[] = [];
  models: Models[] = [];
  images: {
    id?: number;
    image: string;
  }[] = [];
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
    },
  ];

  compareSelectFn = (o1: any, o2: any): boolean =>
    o1 && o2 ? o1.id === o2.id : o1 === o2;

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
    this.images = [...this.product.productImages!];
    this.productDetails = [...this.product.productDetails];

    this.getProperties();

    this.formUpdateProduct = this.fb.group({
      productName: [
        this.product.productName,
        Validators.compose([ProductNameValidator()]),
      ],
      material: [
        this.product.material,
        Validators.compose([Validators.required]),
      ],
      category: [
        this.product.category,
        Validators.compose([Validators.required]),
      ],
      model: [this.product.model, Validators.compose([Validators.required])],
      color: [[]],
      size: [[]],
      description: [this.product.description],
      detail: [this.product.detail],
    });

    new FormControl('', Validators.required);
  }
  submitted = false;
  submit() {
    this.submitted = true;
    if (this.formUpdateProduct.valid && this.images.length) {
      let data = { ...this.product, ...this.formUpdateProduct.value };
      data.productDetails = this.productDetails;
      data.productImages = this.images;
      data.productName = data.productName.trim();
      this.productService.updateProduct(data).subscribe((res) => {
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
          fileRef.getDownloadURL().subscribe((image: any) => {
            if (image) {
              this.images.push({ id: 0, image });
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
      .getAllCategory(0, 100, CommonConstants.STATUS.ACTIVE)
      .subscribe((res) => {
        if (res.code == '000') {
          this.categories = res.data.items;
        }
      });
    this.materialService
      .getAllMaterial(0, 100, CommonConstants.STATUS.ACTIVE)
      .subscribe((res) => {
        if (res.code == '000') {
          this.materials = res.data.items;
        }
      });
    this.modelService
      .getAllModel(0, 100, CommonConstants.STATUS.ACTIVE)
      .subscribe((res) => {
        if (res.code == '000') {
          this.models = res.data.items;
        }
      });
  }
  stopSell(e: any, i: number) {
    if (e) {
      this.productDetails[i].status = CommonConstants.STATUS.INACTIVE;
    } else {
      this.productDetails[i].status = CommonConstants.STATUS.ACTIVE;
    }
  }
}
