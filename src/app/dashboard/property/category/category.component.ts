import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Subscription, switchMap } from 'rxjs';
import { CommonService } from 'src/app/common-services/common.service';
import { CommonConstants } from 'src/app/constants/common-constants';
import { Category } from 'src/app/model/category.model';
import { Page } from 'src/app/model/pageable.model';
import { SearchOption } from 'src/app/model/search-option.model';
import { CategoryService } from 'src/app/service/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  subSearchCategory!: Subscription;
  searchCategory: SearchOption = {
    searchTerm: '',
    status: 1,
    offset: 0,
    limit: 10,
  };
  page!: Page;
  categories: Category[] = [];
  searchChange$ = new BehaviorSubject<SearchOption>(this.searchCategory);
  isVisibleModal = false;
  inputCategory: string = '';
  currentCategory!: number;
  constructor(
    private categoryService: CategoryService,
    public commonService: CommonService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.subSearchCategory = this.searchChange$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((res) => {
          return this.categoryService.getAllCategory(res);
        })
      )
      .subscribe((res: any) => {
        this.page = { ...res };
        this.categories = res.items;
      });
  }
  search(value: any) {
    this.searchCategory.searchTerm = value;
    this.searchCategory.offset = 0;
    this.searchChange$.next({ ...this.searchCategory });
  }
  onChangeStatus(status: any) {
    this.searchCategory.status = status;
    this.searchCategory.offset = 0;
    this.searchChange$.next({ ...this.searchCategory });
  }
  onChangeCategoryPage(event: any) {
    this.searchCategory.limit = event;
    this.searchChange$.next({ ...this.searchCategory });
  }
  onChangeIndexPage(event: any) {
    --event;
    this.searchCategory.offset = event;
    this.searchChange$.next({ ...this.searchCategory });
  }
  showModal(): void {
    this.isVisibleModal = true;
    this.inputCategory;
  }

  handleOk() {
    if (this.validateCategory()) {
      this.messageError = '';
      if (this.currentCategory >= 0) {
        this.updateCategory();
        return;
      }
      this.createCategory();
    }
    this.isVisibleModal = false;
  }

  handleCancel(): void {
    this.inputCategory = '';
    this.messageError = '';
    this.currentCategory = -1;
    this.isVisibleModal = false;
  }

  messageError = '';
  validateCategory() {
    if (this.inputCategory.trim().length == 0) {
      this.messageError = 'Vui lòng nhập loại sản phẩm';
      return false;
    }
    if (this.inputCategory.trim().length > 225) {
      this.messageError = 'Vui lòng nhập loại sản phẩm dưới 225 ký tự';
      return false;
    }
    return true;
  }

  createCategory() {
    this.categoryService
      .createCategory({
        id: 0,
        categoryName: this.inputCategory,
        status: CommonConstants.STATUS.ACTIVE,
      })
      .subscribe((res) => {
        if (res) {
          this.categories.unshift(res);
          this.isVisibleModal = false;
        }
      });
  }

  updateCategory() {
    this.categoryService
      .updateCategory({ ...this.categories[this.currentCategory], categoryName: this.inputCategory })
      .subscribe((res) => {
        if (res) {
          this.categories[this.currentCategory] = res;
        }
      });
      this.isVisibleModal = false;
  }

  updateStatus(category: Category, index: number, status: number) {
    this.modal.confirm({
      nzTitle:
        'Bạn có muốn ' +
        (status == 0 ? 'xóa' : 'khôi phục') +
        ' loại sản phẩm này không?',
      nzOnOk: () => {
        this.categoryService.updateStatus({ ...category, status }).subscribe((res) => {
          if (res) {
            if (this.searchCategory.status == -1) {
              this.categories[index] = res;
            } else {
              this.categories.splice(index, 1);
            }
          }
        });
      },
    });
  }

  showModalEdit(index: number) {
    this.currentCategory = index;
    this.inputCategory = this.categories[this.currentCategory].categoryName!;
    this.showModal();
  }
}
