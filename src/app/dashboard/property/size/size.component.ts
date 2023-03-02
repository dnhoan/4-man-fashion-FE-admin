import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  Subscription,
  switchMap,
} from 'rxjs';
import { CommonService } from 'src/app/common-services/common.service';
import { CommonConstants } from 'src/app/constants/common-constants';
import { Page } from 'src/app/model/pageable.model';
import { SearchOption } from 'src/app/model/search-option.model';
import { Size, SizeDTO } from 'src/app/model/size.model';
import { SizeService } from 'src/app/service/size.service';

@Component({
  selector: 'app-size',
  templateUrl: './size.component.html',
  styleUrls: ['./size.component.scss'],
})
export class SizeComponent implements OnInit {
  subSearchSize!: Subscription;
  searchSize: SearchOption = {
    searchTerm: '',
    status: 1,
    offset: 0,
    limit: 10,
  };
  page!: Page;
  sizes: Size[] = [];
  searchChange$ = new BehaviorSubject<SearchOption>(this.searchSize);
  isVisibleModal = false;
  inputSize: string = '';
  currentSize!: number;
  constructor(
    private sizeService: SizeService,
    public commonService: CommonService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.subSearchSize = this.searchChange$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((res) => {
          return this.sizeService.getAllSize(res);
        })
      )
      .subscribe((res: any) => {
        this.page = { ...res };
        this.sizes = res.items;
      });
  }
  search(value: any) {
    this.searchSize.searchTerm = value;
    this.searchSize.offset = 0;
    this.searchChange$.next({ ...this.searchSize });
  }
  onChangeStatus(status: any) {
    this.searchSize.status = status;
    this.searchSize.offset = 0;
    this.searchChange$.next({ ...this.searchSize });
  }
  onChangeSizePage(event: any) {
    this.searchSize.limit = event;
    this.searchChange$.next({ ...this.searchSize });
  }
  onChangeIndexPage(event: any) {
    --event;
    this.searchSize.offset = event;
    this.searchChange$.next({ ...this.searchSize });
  }
  showModal(): void {
    this.isVisibleModal = true;
  }

  handleOk() {
    if (this.validateSize()) {
      this.messageError = '';
      if (this.currentSize >= 0) {
        this.updateSize();
        return;
      }
      this.createSize();
    }
  }

  handleCancel(): void {
    this.inputSize = '';
    this.messageError = '';
    this.currentSize = -1;
    this.isVisibleModal = false;
  }

  messageError = '';
  validateSize() {
    if (this.inputSize.trim().length == 0) {
      this.messageError = 'Vui lòng nhập tên size';
      return false;
    }
    if (this.inputSize.trim().length > 225) {
      this.messageError = 'Vui lòng nhập tên size dưới 225 ký tự';
      return false;
    }
    return true;
  }

  createSize() {
    this.sizeService
      .createSize({
        id: 0,
        sizeName: this.inputSize,
        status: CommonConstants.STATUS.ACTIVE,
      })
      .subscribe((res) => {
        if (res) {
          this.sizes.unshift(res);
          this.isVisibleModal = false;
        }
      });
  }

  updateSize() {
    this.sizeService
      .updateSize({ ...this.sizes[this.currentSize], sizeName: this.inputSize })
      .subscribe((res) => {
        if (res) {
          this.sizes[this.currentSize] = res;
        }
      });
  }

  updateStatus(size: Size, index: number, status: number) {
    this.modal.confirm({
      nzTitle:
        'Bạn có muốn ' +
        (status == 0 ? 'xóa' : 'khôi phục') +
        ' size này không?',
      nzOnOk: () => {
        this.sizeService.updateStatus({ ...size, status }).subscribe((res) => {
          if (res) {
            if (this.searchSize.status == -1) {
              this.sizes[index] = res;
            } else {
              this.sizes.splice(index, 1);
            }
          }
        });
      },
    });
  }

  showModalEdit(index: number) {
    this.currentSize = index;
    this.inputSize = this.sizes[this.currentSize].sizeName!;
    this.showModal();
  }
}
