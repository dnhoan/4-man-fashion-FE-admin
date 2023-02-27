import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Size, SizeDTO } from 'src/app/model/size.model';
import { SizeService } from 'src/app/service/size.service';

@Component({
  selector: 'app-size',
  templateUrl: './size.component.html',
  styleUrls: ['./size.component.scss'],
})
export class SizeComponent implements OnInit {
  formSize!: FormGroup;
  formSearch!: FormGroup;
  radioValue = 'A';
  size: Size = {};
  datas: SizeDTO[] = [];
  sortBy = 'sizeName';
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
    private sizeService: SizeService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // this.getAllAccount();
    this.initFormSearch();
    this.pagination(this.offset);
  }

  showModal(): void {
    this.submit = false;
    this.formSize = this.fb.group({
      id: null,
      sizeName: ['', [Validators.required]],
      status: [1],
    });
    this.isVisible = true;
  }

  handleOk() {
    this.submit = true;
    if (this.formSize.valid) {
      this.saveSize();
    }
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  saveSize() {
    if (this.size.id) {
      this.updateSize();
      return;
    }
    this.addSize(this.size);
  }

  getAllSize() {
    this.sizeService
      .getAllSize(this.offset, this.limit, this.status)
      .subscribe((res: any) => {
        this.datas = res.data.items;
      });
  }

  pagination(page: any) {
    if (page < 0) page = 0;
    this.offset = page;
    this.sizeService
      .getAllSize(this.offset, this.limit, this.status)
      .subscribe((res) => {
        this.datas = res.data.items;
        this.Page = res.data;
      });
  }

  addSize(size: SizeDTO) {
    if (this.formSize.valid) {
      this.addValueSize();
      this.sizeService.createSize(size).subscribe(
        (res) => {
          this.getAllSize();
          this.message.success('Thêm dữ liệu thành công');
          this.isVisible = false;
        },
        (error) => {
          this.message.error('Thêm dữ liệu thất bại');
        }
      );
    }
  }

  updateSize() {
    if (this.formSize.valid) {
      this.addValueSize();
      this.sizeService.updateSize(this.size).subscribe(
        (res) => {
          this.getAllSize();
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

  deleteSize(id: any) {
    this.sizeService.deleteSize(id).subscribe(
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

  getInfoSize(id: any) {
    this.showModal();
    const sizeID = this.datas.find((value) => {
      return value.id == id;
    });
    if (sizeID) {
      this.size = sizeID;
    }
    this.fillValueForm();
  }

  addValueSize() {
    this.size.id = this.formSize.value.id;
    this.size.sizeName = this.formSize.value.sizeName;
    this.size.status = this.formSize.value.status;
  }

  fillValueForm() {
    this.formSize.patchValue({
      id: this.size.id,
      sizeName: this.size.sizeName,
      status: this.size.status,
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
