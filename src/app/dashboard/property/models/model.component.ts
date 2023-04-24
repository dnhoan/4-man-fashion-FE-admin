import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Subscription, switchMap } from 'rxjs';
import { CommonService } from 'src/app/common-services/common.service';
import { CommonConstants } from 'src/app/constants/common-constants';
import { Models, ModelsDTO } from 'src/app/model/model.model';
import { Page } from 'src/app/model/pageable.model';
import { SearchOption } from 'src/app/model/search-option.model';
import { ModelService } from 'src/app/service/model.service';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss'],
})
export class ModelComponent implements OnInit {
  subSearchModel!: Subscription;
  searchModel: SearchOption = {
    searchTerm: '',
    status: 1,
    offset: 0,
    limit: 10,
  };
  page!: Page;
  models: Models[] = [];
  searchChange$ = new BehaviorSubject<SearchOption>(this.searchModel);
  isVisibleModal = false;
  inputModel: string = '';
  currentModel!: number;
  constructor(
    private modelService: ModelService,
    public commonService: CommonService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.subSearchModel = this.searchChange$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((res) => {
          return this.modelService.getAllModel(res);
        })
      )
      .subscribe((res: any) => {
        this.page = { ...res };
        this.models = res.items;
      });
  }
  search(value: any) {
    this.searchModel.searchTerm = value;
    this.searchModel.offset = 0;
    this.searchChange$.next({ ...this.searchModel });
  }
  onChangeStatus(status: any) {
    this.searchModel.status = status;
    this.searchModel.offset = 0;
    this.searchChange$.next({ ...this.searchModel });
  }
  onChangeModelPage(event: any) {
    this.searchModel.limit = event;
    this.searchChange$.next({ ...this.searchModel });
  }
  onChangeIndexPage(event: any) {
    --event;
    this.searchModel.offset = event;
    this.searchChange$.next({ ...this.searchModel });
  }
  showModal(): void {
    this.isVisibleModal = true;
    this.inputModel;
  }

  handleOk() {
    if (this.validateModel()) {
      this.messageError = '';
      if (this.currentModel >= 0) {
        this.updateModel();
        return;
      }
      this.createModel();
    }
    this.isVisibleModal = false
  }

  handleCancel(): void {
    this.inputModel = '';
    this.messageError = '';
    this.currentModel = -1;
    this.isVisibleModal = false;
  }

  messageError = '';
  validateModel() {
    if (this.inputModel.trim().length == 0) {
      this.messageError = 'Vui lòng nhập kiểu dáng';
      return false;
    }
    if (this.inputModel.trim().length > 225) {
      this.messageError = 'Vui lòng nhập tên kiểu dáng dưới 225 ký tự';
      return false;
    }
    return true;
  }

  createModel(){
    this.modelService
      .createModel({
        id: 0,
        modelsName: this.inputModel,
        status: CommonConstants.STATUS.ACTIVE,
      })
      .subscribe((res) => {
        if (res) {
          this.models.unshift(res);
          this.isVisibleModal = false;
        }
      });
  }

  updateModel() {
    this.modelService
      .updateModel({ ...this.models[this.currentModel], modelsName: this.inputModel })
      .subscribe((res) => {
        if (res) {
          this.models[this.currentModel] = res;
        }
      });
      this.isVisibleModal = false;
  }

  updateStatus(model: Models, index: number, status: number) {
    this.modal.confirm({
      nzTitle:
        'Bạn có muốn ' +
        (status == 0 ? 'xóa' : 'khôi phục') +
        ' kiểu dáng này không?',
      nzOnOk: () => {
        this.modelService.updateStatus({ ...model, status }).subscribe((res) => {
          if (res) {
            if (this.searchModel.status == -1) {
              this.models[index] = res;
            } else {
              this.models.splice(index, 1);
            }
          }
        });
      },
    });
  }

  showModalEdit(index: number) {
    this.currentModel = index;
    if (index >= 0) {
      this.inputModel = this.models[this.currentModel].modelsName!;
    } else {
      this.inputModel = '';
    }
    this.showModal();
  }
}
