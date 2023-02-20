import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Material, MaterialDTO } from 'src/app/model/material.model';
import { MaterialService } from 'src/app/service/material.service';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss'],
})
export class MaterialComponent implements OnInit {
  formMaterial!: FormGroup;
  formSearch!: FormGroup;
  radioValue = 'A';
  material: Material = {};
  datas: MaterialDTO[] = [];
  sortBy = 'materialName';
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
    private toastr: ToastrService,
    private materialService: MaterialService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initFormSearch();
    this.pagination(this.offset);
  }

  showModal(): void {
    this.submit = false;
    this.formMaterial = this.fb.group({
      id: null,
      materialName: ['', [Validators.required]],
      status: [1],
    });
    this.isVisible = true;
  }

  handleOk() {
    this.submit = true;
    if (this.formMaterial.valid) {
      this.saveMaterial();
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

  pagination(page: any) {
    if (page < 0) page = 0;
    this.offset = page;
    this.materialService
      .getAllMaterial(this.offset, this.limit, this.status)
      .subscribe((res) => {
        this.datas = res.data.items;
        this.Page = res.data;
      });
  }

  saveMaterial() {
    if (this.material.id) {
      this.updateMaterial();
      return;
    }
    this.addMaterial(this.material);
  }

  getAllMaterial() {
    this.materialService
      .getAllMaterial(this.offset, this.limit, this.status)
      .subscribe((res: any) => {
        this.datas = res.data.items;
      });
  }

  addMaterial(material: MaterialDTO) {
    if (this.formMaterial.valid) {
      console.log(material);

      this.addValueMaterial();
      this.materialService.createMaterial(material).subscribe(
        (res) => {
          this.getAllMaterial();
          this.toastr.success('Thêm dữ liệu thành công');
          this.isVisible = false;
        },
        (error) => {
          this.toastr.error('Thêm dữ liệu thất bại');
        }
      );
    }
  }

  updateMaterial() {
    if (this.formMaterial.valid) {
      this.addValueMaterial();
      this.materialService.updateMaterial(this.material).subscribe(
        (res) => {
          this.getAllMaterial();
          this.toastr.success('Cập nhật dữ liệu thành công');
          this.isVisible = false;
          return;
        },
        (error) => {
          this.toastr.error('Cập nhật dữ liệu thất bại');
        }
      );
    }
    return;
  }

  deleteMaterial(id: any) {
    this.materialService.deleteMaterial(id).subscribe((res: any) =>
      this.datas.forEach((value) => {
        if (value.id == id) {
          value.status = 0;
        }
      })
    );
    this.pagination(this.offset);
  }

  getInfoMaterial(id: any) {
    this.showModal();
    const materialID = this.datas.find((value) => {
      return value.id == id;
    });
    if (materialID) {
      this.material = materialID;
    }
    this.fillValueForm();
  }

  addValueMaterial() {
    this.material.id = this.formMaterial.value.id;
    this.material.materialName = this.formMaterial.value.materialName;
    this.material.status = this.formMaterial.value.status;
  }

  fillValueForm() {
    this.formMaterial.patchValue({
      id: this.material.id,
      materialName: this.material.materialName,
      status: this.material.status,
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
