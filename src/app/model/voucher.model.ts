export interface Voucher {
  id?: number;
  voucherCode?: string;
  voucherName?: string;
  startDate?: Date;
  endDate?: Date;
  voucherType?: any;
  discount?: number;
  quantity?: number;
  ctime?: Date;
  status?: number;
}

export interface VoucherDTO {
  id?: number;
  voucherCode?: string;
  voucherName?: string;
  startDate?: Date;
  endDate?: Date;
  voucherType?: any;
  discount?: number;
  quantity?: number;
  ctime?: Date;
  status?: number;
}
