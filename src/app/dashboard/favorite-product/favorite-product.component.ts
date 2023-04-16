import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject, Subscription, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { CommonService } from 'src/app/common-services/common.service';
import { CommonConstants } from 'src/app/constants/common-constants';
import { Category } from 'src/app/model/category.model';
import { FavoriteProduct } from 'src/app/model/favoriteProduct.model';
import { Page } from 'src/app/model/pageable.model';
import { Product } from 'src/app/model/product.model';
import { SearchOption } from 'src/app/model/search-option.model';
import { CategoryService } from 'src/app/service/category.service';
import { FavoriteProductService } from 'src/app/service/favorite.service';

@Component({
  selector: 'app-favorite-product',
  templateUrl: './favorite-product.component.html',
  styleUrls: ['./favorite-product.component.scss']
})
export class FavoriteProductComponent implements OnInit {
  subSearchFavoriteProduct!: Subscription;
  searchFavorite: SearchOption = {
    searchTerm: '',
    status: 1,
    offset: 0,
    limit: 10,
  };
  page!: Page;
  products: Product[] = [];
  searchChange$ = new BehaviorSubject<SearchOption>(this.searchFavorite);
  isVisibleModal = false;
  inputCategory: string = '';
  currentCategory!: number;
  constructor(
    private favoriteProduct: FavoriteProductService,
    public commonService: CommonService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.subSearchFavoriteProduct = this.searchChange$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((res) => {
          return this.favoriteProduct.getAllFavoriteProduct(res);
        })
      )
      .subscribe((res: any) => {
        this.page = { ...res };
        this.products = res.items;
      });
  }
  search(value: any) {
    this.searchFavorite.searchTerm = value;
    this.searchFavorite.offset = 0;
    this.searchChange$.next({ ...this.searchFavorite });
  }
  onChangeStatus(status: any) {
    this.searchFavorite.status = status;
    this.searchFavorite.offset = 0;
    this.searchChange$.next({ ...this.searchFavorite });
  }
  onChangeFavoriteProductPage(event: any) {
    this.searchFavorite.limit = event;
    this.searchChange$.next({ ...this.searchFavorite });
  }
  onChangeIndexPage(event: any) {
    --event;
    this.searchFavorite.offset = event;
    this.searchChange$.next({ ...this.searchFavorite });
  }
  showModal(): void {
    this.isVisibleModal = true;
  }


  handleCancel(): void {
    this.inputCategory = '';
    this.messageError = '';
    this.currentCategory = -1;
    this.isVisibleModal = false;
  }

  messageError = '';


}
