import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProductDetailService } from 'src/app/service/productDetail.service';
import { ProductDetail } from 'src/app/model/productDetail.model';

@Component({
  selector: 'app-productDetail',
  templateUrl: './productDetail.component.html',
  styleUrls: ['./productDetail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: ProductDetail = {};
  product$!: Subscription;

  baseUrl = `${environment.baseUrl}/admin`;
  modulesDescription = {};
  constructor(
    private productDetailService: ProductDetailService,
    private httpClient: HttpClient,
    private message: NzMessageService
  ) {
    this.modulesDescription = {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        ['blockquote'],
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ align: [] }],
      ],
    };
  }

  ngOnInit() {
    this.productDetailService.getAllProductDetail().subscribe((res) => {
      this.product = res.data.items;
      console.log(this.product);
    });

  }

}
