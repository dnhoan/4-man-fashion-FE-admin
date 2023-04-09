import { Component, Input, OnInit } from '@angular/core';
import { OrderDetail, OrderDetailDTO } from '../../order/orderDetails.model';
import {
  ORDER_DETAIL_STATUS,
  ORDER_STATUS,
} from 'src/app/constants/constant.constant';
import { finalize } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { CommonService } from 'src/app/common-services/common.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Exchange, ExchangeImage } from 'src/app/model/exchange.model';
import { ReturnOrderService } from './return-order.service';
import { ExchangeShopRequestBody } from 'src/app/model/exchangeShopRequestBody.model';
@Component({
  selector: 'app-return-order',
  templateUrl: './return-order.component.html',
  styleUrls: ['./return-order.component.scss'],
})
export class ReturnOrderComponent implements OnInit {
  @Input() orderDetail!: OrderDetailDTO;
  @Input() orderId!: number;
  ORDER_DETAIL_STATUS = ORDER_DETAIL_STATUS;
  reason: string = '';
  images: string[] = [];
  quantity: number = 1;
  constructor(
    private storage: AngularFireStorage,
    private commonService: CommonService,
    private modal: NzModalService,
    private returnOrderService: ReturnOrderService,
    private modalRef: NzModalRef
  ) {}

  ngOnInit(): void {}
  submit() {
    this.modal.confirm({
      nzTitle: `<i>Trả hàng hoàn tiền</i>`,
      nzContent: `<b>Bạn có muốn trả hàng hoàn tiền đơn hàng này không?</b>`,
      nzOkText: 'Ok',
      nzCancelText: 'Hủy',
      nzOnOk: () => {
        let exchange: Exchange = {
          id: 0,
          reason: this.reason,
          exchangeImages: this.images.map(
            (image: any) => ({ id: 0, image } as ExchangeImage)
          ),
          orderDetailIdOrigin: this.orderDetail.id!,
        };
        let data: ExchangeShopRequestBody = {
          orderDetails: {
            ...this.orderDetail,
            exchange,
            quantity: this.quantity * -1,
            quantityOrigin: this.quantity * -1,
          } as OrderDetail,
          orderId: this.orderId,
          statusOrder: ORDER_STATUS.EXCHANGE,
        };
        this.returnOrderService.returnOrderDetail(data).subscribe((res) => {
          if (res) this.modalRef.close(true);
        });
      },
    });
  }
  removeImage(i: number) {
    this.images.splice(i, 1);
  }
  changeImage(event: any) {
    let n = Date.now();
    const file = event.target.files[0];
    const filePath = `product_images/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`product_images/${n}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url: any) => {
            if (url) {
              this.images.push(url);
            }
          });
        })
      )
      .subscribe((url: any) => {
        if (url) {
          console.log(url);
        }
      });
  }
  editorInstance: any;
  imageHandler(event: any) {
    this.editorInstance = event;
    let toolbar = event.getModule('toolbar');
    toolbar.addHandler('image', () => {
      let data = this.editorInstance;
      if (this.editorInstance) {
        let range = this.editorInstance.getSelection();
        if (range) {
          let input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.addEventListener('change', () => {
            const file = input.files![0];
            let n = Date.now();
            const filePath = `product_images/${n}`;
            const fileRef = this.storage.ref(filePath);
            const task = this.storage.upload(`product_images/${n}`, file);
            task
              .snapshotChanges()
              .pipe(
                finalize(() => {
                  fileRef.getDownloadURL().subscribe((url: any) => {
                    if (url) {
                      data.insertEmbed(range.index, 'image', url);
                    }
                  });
                })
              )
              .subscribe();
          });
          input.click();
        }
      }
    });
  }
}
