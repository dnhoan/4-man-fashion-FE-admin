import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Subscription, switchMap } from 'rxjs';
import { CommonService } from 'src/app/common-services/common.service';
import { CommonConstants } from 'src/app/constants/common-constants';
import { Material } from 'src/app/model/material.model';
import { Page } from 'src/app/model/pageable.model';
import { SearchOption } from 'src/app/model/search-option.model';
import { MaterialService } from 'src/app/service/material.service';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss'],
})
export class MaterialComponent implements OnInit {
  subSearchMaterial!: Subscription;
  searchMaterial: SearchOption = {
    searchTerm: '',
    status: 1,
    offset: 0,
    limit: 10,
  };
  page!: Page;
  materials: Material[] = [];
  searchChange$ = new BehaviorSubject<SearchOption>(this.searchMaterial);
  isVisibleModal = false;
  inputMaterial: string = '';
  currentMaterial!: number;
  constructor(
    private materialService: MaterialService,
    public commonService: CommonService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.subSearchMaterial = this.searchChange$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((res) => {
          return this.materialService.getAllMaterial(res);
        })
      )
      .subscribe((res: any) => {
        this.page = { ...res };
        this.materials = res.items;
      });
  }
  search(value: any) {
    this.searchMaterial.searchTerm = value;
    this.searchMaterial.offset = 0;
    this.searchChange$.next({ ...this.searchMaterial });
  }
  onChangeStatus(status: any) {
    this.searchMaterial.status = status;
    this.searchMaterial.offset = 0;
    this.searchChange$.next({ ...this.searchMaterial });
  }
  onChangeMaterialPage(event: any) {
    this.searchMaterial.limit = event;
    this.searchChange$.next({ ...this.searchMaterial });
  }
  onChangeIndexPage(event: any) {
    --event;
    this.searchMaterial.offset = event;
    this.searchChange$.next({ ...this.searchMaterial });
  }
  showModal(): void {
    this.isVisibleModal = true;
    this.inputMaterial;
  }

  handleOk() {
    if (this.validateMaterial()) {
      this.messageError = '';
      if (this.currentMaterial >= 0) {
        this.updateMaterial();
        return;
      }
      this.createMaterial();
    }
    this.isVisibleModal = false;
  }

  handleCancel(): void {
    this.inputMaterial = '';
    this.messageError = '';
    this.currentMaterial = -1;
    this.isVisibleModal = false;
  }

  messageError = '';
  validateMaterial() {
    if (this.inputMaterial.trim().length == 0) {
      this.messageError = 'Vui lòng nhập chất liệu';
      return false;
    }
    if (this.inputMaterial.trim().length > 225) {
      this.messageError = 'Vui lòng nhập tên chất liệu dưới 225 ký tự';
      return false;
    }
    return true;
  }

  createMaterial() {
    this.materialService
      .createMaterial({
        id: 0,
        materialName: this.inputMaterial,
        status: CommonConstants.STATUS.ACTIVE,
      })
      .subscribe((res) => {
        if (res) {
          this.materials.unshift(res);
          this.isVisibleModal = false;
        }
      });
  }

  updateMaterial() {
    this.materialService
      .updateMaterial({ ...this.materials[this.currentMaterial], materialName: this.inputMaterial })
      .subscribe((res) => {
        if (res) {
          this.materials[this.currentMaterial] = res;
        }
      });
      this.isVisibleModal = false;
  }

  updateStatus(material: Material, index: number, status: number) {
    this.modal.confirm({
      nzTitle:
        'Bạn có muốn ' +
        (status == 0 ? 'xóa' : 'khôi phục') +
        ' chất liệu này không?',
      nzOnOk: () => {
        this.materialService.updateStatus({ ...material, status }).subscribe((res) => {
          if (res) {
            if (this.searchMaterial.status == -1) {
              this.materials[index] = res;
            } else {
              this.materials.splice(index, 1);
            }
          }
        });
      },
    });
  }

  showModalEdit(index: number) {
    this.currentMaterial = index;
    this.inputMaterial = this.materials[this.currentMaterial].materialName!;
    this.showModal();
  }
}
