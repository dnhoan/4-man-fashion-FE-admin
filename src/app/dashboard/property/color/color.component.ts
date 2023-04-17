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
import { Color } from 'src/app/model/color.model';
import { Page } from 'src/app/model/pageable.model';
import { SearchOption } from 'src/app/model/search-option.model';
import { ColorService } from 'src/app/service/color.service';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss'],
})
export class ColorComponent implements OnInit {
  subSearchColor!: Subscription;
  searchColor: SearchOption = {
    searchTerm: '',
    status: 1,
    offset: 0,
    limit: 10,
  };
  page!: Page;
  colors: Color[] = [];
  searchChange$ = new BehaviorSubject<SearchOption>(this.searchColor);
  isVisibleModal = false;
  inputColorCode: string = '';
  inputColorName: string = '';
  currentColor!: number;
  constructor(
    private colorService: ColorService,
    public commonService: CommonService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.subSearchColor = this.searchChange$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((res) => {
          return this.colorService.getAllColor(res);
        })
      )
      .subscribe((res: any) => {
        this.page = { ...res };
        this.colors = res.items;
      });
  }
  search(value: any) {
    this.searchColor.searchTerm = value;
    this.searchColor.offset = 0;
    this.searchChange$.next({ ...this.searchColor });
  }
  onChangeStatus(status: any) {
    this.searchColor.status = status;
    this.searchColor.offset = 0;
    this.searchChange$.next({ ...this.searchColor });
  }
  onChangeColorPage(event: any) {
    this.searchColor.limit = event;
    this.searchChange$.next({ ...this.searchColor });
  }
  onChangeIndexPage(event: any) {
    --event;
    this.searchColor.offset = event;
    this.searchChange$.next({ ...this.searchColor });
  }
  showModal(): void {
    this.isVisibleModal = true;
    this.inputColorCode;
    this.inputColorName;
  }

  handleOk() {
    if (this.validateColor()) {
      if (this.currentColor >= 0) {
        this.updateColor();
        return;
      }
      this.createColor();
    }
  }

  handleCancel(): void {
    this.inputColorCode = '';
    this.inputColorName = '';
    this.messageError = '';
    this.currentColor = -1;
    this.isVisibleModal = false;
  }

  messageError = '';
  validateColor() {
    this.messageError = '';
    if (this.inputColorCode.trim().length == 0) {
      this.messageError = 'Vui lòng nhập mã màu sắc';
      return false;
    }
    if (this.inputColorName.trim().length == 0) {
      this.messageError = 'Vui lòng nhập màu sắc';
      return false;
    }
    if (this.inputColorCode.trim().length > 225) {
      this.messageError = 'Vui lòng nhập mã màu sắc dưới 225 ký tự';
      return false;
    }
    if (this.inputColorName.trim().length > 225) {
      this.messageError = 'Vui lòng nhập màu sắc dưới 225 ký tự';
      return false;
    }
    return true;
  }

  createColor() {
    this.colorService
      .createColor({
        id: 0,
        colorCode: this.inputColorCode,
        colorName: this.inputColorName,
        status: CommonConstants.STATUS.ACTIVE,
      })
      .subscribe((res) => {
        if (res) {
          console.log(res);

          this.colors.unshift(res);
          this.isVisibleModal = false;
        }
      });
  }

  updateColor() {
    this.colorService
      .updateColor({
        ...this.colors[this.currentColor],
        colorCode: this.inputColorCode,
        colorName: this.inputColorName,
      })
      .subscribe((res) => {
        if (res) {
          this.colors[this.currentColor] = res;
          this.isVisibleModal = false;
        }
      });
  }

  updateStatus(color: Color, index: number, status: number) {
    this.modal.confirm({
      nzTitle:
        'Bạn có muốn ' +
        (status == 0 ? 'xóa' : 'khôi phục') +
        ' màu sắc này không?',
      nzOnOk: () => {
        this.colorService
          .updateStatus({ ...color, status })
          .subscribe((res) => {
            if (res) {
              if (this.searchColor.status == -1) {
                this.colors[index] = res;
              } else {
                this.colors.splice(index, 1);
              }
            }
          });
      },
    });
  }

  showModalEdit(index: number) {
    this.currentColor = index;
    if (index >= 0) {
      this.inputColorCode = this.colors[this.currentColor].colorCode!;
      this.inputColorName = this.colors[this.currentColor].colorName!;
    } else {
      this.inputColorCode = '';
      this.inputColorName = '';
    }
    this.showModal();
  }
}
