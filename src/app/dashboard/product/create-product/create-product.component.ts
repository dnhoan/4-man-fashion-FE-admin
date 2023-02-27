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
  sizeSelected: Size[] = [];
  productDetails: ProductDetailDTO[] = [
    {
      size: undefined,
      color: undefined,
      stock: 0,
      price: 0,
      sizeName: '',
      colorName: '',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private materialService: MaterialService,
    private modelService: ModelService,
    private sizeService: SizeService,
    private colorService: ColorService,
    private storage: AngularFireStorage
  ) {}

  ngOnInit() {
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
    this.sizeService
      .getAllSize(0, 100, CommonConstants.STATUS.ACTIVE)
      .subscribe((res) => {
        if (res.code == '000') {
          this.sizes = res.data.items;
        }
      });
    this.colorService
      .getAllColor(0, 100, CommonConstants.STATUS.ACTIVE)
      .subscribe((res) => {
        if (res.code == '000') {
          this.colors = res.data.items;
        }
      });

    this.formCreateProduct = this.fb.group({
      name: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(225),
        ]),
      ],
      material: ['', Validators.compose([Validators.required])],
      category: ['', Validators.compose([Validators.required])],
      model: ['', Validators.compose([Validators.required])],
      color: [[], Validators.compose([Validators.required])],
      size: [[], Validators.compose([Validators.required])],
    });
    new FormControl('', Validators.required);
  }
  submit() {
    console.log(this.formCreateProduct.value);
  }

  mapTiers() {
    let colorSelected = this.formCreateProduct.value.color;
    let sizeSelected = this.formCreateProduct.value.size;
    this.productDetails = [];
    if (colorSelected.length || sizeSelected.length) {
      let productDetail = {
        color: null,
        size: null,
        stock: 0,
        productDetailCode: '',
        price: 0,
      };
      colorSelected.forEach((color: any) => {
        productDetail.color = color;
      });
      sizeSelected.forEach((size: any) => {
        productDetail.size = size;
      });
      console.log('color: ', colorSelected, ' size: ', sizeSelected);
    } else {
      console.log('....');
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
}
