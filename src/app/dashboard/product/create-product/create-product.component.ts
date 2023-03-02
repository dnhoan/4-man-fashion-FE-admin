import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { finalize } from 'rxjs';
import { CommonConstants } from 'src/app/constants/common-constants';
import { Category } from 'src/app/model/category.model';
import { Color } from 'src/app/model/color.model';
import { Material } from 'src/app/model/material.model';
import { Models } from 'src/app/model/model.model';
import { ProductDetailDTO } from 'src/app/model/productDetail.model';
import { Size } from 'src/app/model/size.model';
import { CategoryService } from 'src/app/service/category.service';
import { ColorService } from 'src/app/service/color.service';
import { MaterialService } from 'src/app/service/material.service';
import { ModelService } from 'src/app/service/model.service';
import { SizeService } from 'src/app/service/size.service';
import { ProductNameValidator } from 'src/app/validators/input.validator';
import { CreateProductService } from './create-product.service';

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
      stock: 0,
      price: 0,
      sizeName: '',
      colorName: '',
    },
  ];
  modulesDescription = {};
  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private materialService: MaterialService,
    private modelService: ModelService,
    private sizeService: SizeService,
    private colorService: ColorService,
    private storage: AngularFireStorage,
    private createProductService: CreateProductService
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
    console.log(this.formCreateProduct);

    if (this.formCreateProduct.valid && this.images.length) {
      let data = this.formCreateProduct.value;
      data.productDetails = this.productDetails;
      data.productImages = this.images.map((image) => ({ id: '', image }));
      this.createProductService
        .createProduct(data)
        .subscribe((res) => console.log(res));
      console.log(data);
    }
  }

  mapTiers() {
    let colorSelected: Color[] = this.formCreateProduct.value.color;
    let sizeSelected: Size[] = this.formCreateProduct.value.size;
    let productDetail: ProductDetailDTO = {
      size: undefined,
      color: undefined,
      stock: 0,
      price: 0,
      sizeName: '',
      colorName: '',
      productDetailCode: '',
    };
    this.productDetails = [];
    if (colorSelected.length && sizeSelected.length) {
      colorSelected.forEach((color) => {
        productDetail.color = color;
        productDetail.colorName = color.colorName;
        sizeSelected.forEach((size) => {
          productDetail.size = size;
          productDetail.sizeName = size.sizeName;
          this.productDetails.push({ ...productDetail });
        });
      });
    } else if (colorSelected.length) {
      colorSelected.forEach((color) => {
        productDetail.color = color;
        productDetail.colorName = color.colorName;
        this.productDetails.push({ ...productDetail });
      });
    } else if (sizeSelected.length) {
      sizeSelected.forEach((size) => {
        productDetail.size = size;
        productDetail.sizeName = size.sizeName;
        this.productDetails.push({ ...productDetail });
      });
    } else {
      this.productDetails = [
        {
          size: undefined,
          color: undefined,
          stock: 0,
          price: 0,
          sizeName: '',
          colorName: '',
          productDetailCode: '',
        },
      ];
    }
  }

  insertCategory(event: any) {}
  insertModel(event: any) {}
  insertMaterial(event: any) {}
  insertColor(event: any) {}
  insertSize(event: any) {}

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
    // this.sizeService
    //   .getAllSize(0, 100, CommonConstants.STATUS.ACTIVE)
    //   .subscribe((res) => {
    //     if (res.code == '000') {
    //       this.sizes = res.data.items;
    //     }
    //   });
    this.colorService
      .getAllColor(0, 100, CommonConstants.STATUS.ACTIVE)
      .subscribe((res) => {
        if (res.code == '000') {
          this.colors = res.data.items;
        }
      });
  }
}
