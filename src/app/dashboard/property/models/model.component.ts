import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Models, ModelsDTO } from 'src/app/model/model.model';
import { ModelService } from 'src/app/service/model.service';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss'],
})
export class ModelComponent implements OnInit {
  formModel!: FormGroup;
  formSearch!: FormGroup;
  radioValue = 'A';
  models: Models = {};
  datas: ModelsDTO[] = [];
  sortBy = 'modelName';
  descAsc = 'desc';
  offset = 0;
  limit = 5;
  Page: any;
  isVisible = false;
  action = true;
  submit = false;
  status = 1;
  disable = false;
  constructor(
    private readonly router: Router,
    private message: NzMessageService,
    private modelService: ModelService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // this.getAllAccount();
    this.initFormSearch();
    this.pagination(this.offset);
  }

  showModal(): void {
    this.submit = false;
    this.formModel = this.fb.group({
      id: null,
      modelsName: ['', [Validators.required]],
      status: [1],
    });
    this.isVisible = true;
  }

  handleOk() {
    this.submit = true;
    if (this.formModel.valid) {
      this.saveModel();
    }
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  initFormSearch() {
    this.formSearch! = this.fb.group({
      valueSearch: [''],
    });
  }

  saveModel() {
    if (this.models.id) {
      this.updateModel();
      return;
    }
    this.addModel(this.models);
  }

  getAllModel() {
    this.modelService
      .getAllModel(this.offset, this.limit, this.status)
      .subscribe((res: any) => {
        this.datas = res.data.items;
      });
  }

  pagination(page: any) {
    if (page < 0) page = 0;
    this.offset = page;
    this.modelService
      .getAllModel(this.offset, this.limit, this.status)
      .subscribe((res) => {
        console.log(res);

        this.datas = res.data.items;
        this.Page = res.data;
      });
  }

  addModel(model: ModelsDTO) {
    if (this.formModel.valid) {
      this.addValueModel();
      this.modelService.createModel(model).subscribe(
        (res) => {
          this.getAllModel();
          this.message.success('Thêm dữ liệu thành công');
          this.isVisible = false;
        },
        (error) => {
          this.message.error('Thêm dữ liệu thất bại');
        }
      );
    }
  }

  updateModel() {
    if (this.formModel.valid) {
      this.addValueModel();
      this.modelService.updateModel(this.models).subscribe(
        (res) => {
          this.getAllModel();
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

  deleteModel(id: any) {
    this.modelService.deleteModel(id).subscribe((res: any) =>
      this.datas.forEach((value) => {
        if (value.id == id) {
          value.status = 0;
        }
      })
    );
    this.pagination(this.offset);
  }
  getInfoModel(id: any) {
    this.showModal();
    const modelID = this.datas.find((value) => {
      return value.id == id;
    });
    if (modelID) {
      this.models = modelID;
    }
    this.fillValueForm();
  }

  addValueModel() {
    this.models.id = this.formModel.value.id;
    this.models.modelsName = this.formModel.value.modelsName;
    this.models.status = this.formModel.value.status;
  }

  fillValueForm() {
    this.formModel.patchValue({
      id: this.models.id,
      modelsName: this.models.modelsName,
      status: this.models.status,
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
