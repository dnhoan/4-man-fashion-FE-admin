import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Category, CategoryDTO } from 'src/app/model/category.model';
import { CategoryService } from 'src/app/service/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  formCategory!: FormGroup;
  formSearch!: FormGroup;
  radioValue = 'A';
  category: Category = {};
  datas: CategoryDTO[] = [];
  sortBy = 'categoryName';
  descAsc = 'desc';
  offset = 0;
  limit = 5;
  Page: any;
  isVisible = false;
  action = true;
  submit = false;
  status!: number;
  disable = false;
  constructor(
    private readonly router: Router,
    private message: NzMessageService,
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initFormSearch();
    this.pagination(this.offset);
  }

  showModal(): void {
    this.submit = false;
    this.formCategory = this.fb.group({
      id: null,
      categoryName: ['', [Validators.required]],
      status: [1],
    });
    this.isVisible = true;
  }

  handleOk() {
    this.submit = true;
    if (this.formCategory.valid) {
      this.saveCategory();
    }
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  saveCategory() {
    if (this.category.id) {
      this.updateCategory();
      return;
    }
    this.addCategory(this.category);
  }

  getAllCategory() {
    this.categoryService
      .getAllCategory(this.offset, this.limit, this.status)
      .subscribe((res: any) => {
        this.datas = res.data.items;
      });
  }

  pagination(page: any) {
    if (page < 0) page = 0;
    this.offset = page;
    this.categoryService
      .getAllCategory(this.offset, this.limit, this.status)
      .subscribe((res) => {
        this.datas = res.data.items;
        this.Page = res.data;
      });
  }

  addCategory(category: CategoryDTO) {
    if (this.formCategory.valid) {
      this.addValueCategory();
      this.categoryService.createCategory(category).subscribe(
        (res) => {
          this.getAllCategory();
          this.message.success('Thêm dữ liệu thành công');
          this.isVisible = false;
        },
        (error) => {
          this.message.error('Thêm dữ liệu thất bại');
        }
      );
    }
  }

  updateCategory() {
    if (this.formCategory.valid) {
      this.addValueCategory();
      this.categoryService.updateCategory(this.category).subscribe(
        (res) => {
          this.getAllCategory();
          this.message.success('Cập nhật dữ liệu thành công');
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

  deleteCategory(id: any) {
    this.categoryService.deleteCategory(id).subscribe(
      (res) => {
        this.datas.forEach((value) => {
          if (value.id == id) {
            value.status = 0;
            return;
          }
          this.message.success('Xóa dữ liệu thành công');
        });
      },
      (error) => {
        this.message.error('Xóa dữ liệu thất bại');
      }
    );
  }

  getInfoCategory(id: any) {
    this.showModal();
    const categoryID = this.datas.find((value) => {
      return value.id == id;
    });
    if (categoryID) {
      this.category = categoryID;
    }
    this.fillValueForm();
  }

  addValueCategory() {
    this.category.id = this.formCategory.value.id;
    this.category.categoryName = this.formCategory.value.categoryName;
    this.category.status = this.formCategory.value.status;
  }

  fillValueForm() {
    this.formCategory.patchValue({
      id: this.category.id,
      categoryName: this.category.categoryName,
      status: this.category.status,
    });
  }

  initFormSearch() {
    this.formSearch! = this.fb.group({
      valueSearch: [''],
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

  searchWithPage(page: any) {
    if (page < 0) page = 0;
    this.offset = page;
  }

  timkiem() {
    this.searchWithPage(0);
    this.initFormSearch();
  }
}
